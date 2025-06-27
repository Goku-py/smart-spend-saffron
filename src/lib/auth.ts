import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Security configuration
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Admin credentials (in production, this would be in a secure database)
const ADMIN_CREDENTIALS = {
  email: 'admin@system.com',
  // Pre-hashed password for Admin@123#Secure
  passwordHash: '$2a$12$LQv3c1yqBwEHXk.JHd3vVeaJQQNvghqQvRtECSRUxdmrU0VJ9HOBO',
  role: 'admin' as const,
  id: 'admin-001'
};

// User interface
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  isLocked?: boolean;
  lockoutUntil?: Date;
  loginAttempts?: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  recoveryCodes?: string[];
  preferences?: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

// Session interface
interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
  deviceInfo: {
    userAgent: string;
    ipAddress: string;
    lastActive: Date;
  };
}

// Login attempt interface
interface LoginAttempt {
  email: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

// In-memory storage (replace with database in production)
const users = new Map<string, User>();
const sessions = new Map<string, Session>();
const activeSessions = new Map<string, { userId: string; expiresAt: Date }>();
const loginAttempts: LoginAttempt[] = [];
const loginAttemptsMap = new Map<string, { count: number; lastAttempt: Date }>();

// Initialize admin user
users.set(ADMIN_CREDENTIALS.email, {
  id: ADMIN_CREDENTIALS.id,
  email: ADMIN_CREDENTIALS.email,
  passwordHash: ADMIN_CREDENTIALS.passwordHash,
  role: ADMIN_CREDENTIALS.role,
  createdAt: new Date(),
});

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting
const checkRateLimit = (email: string): boolean => {
  const now = new Date();
  const attempt = loginAttemptsMap.get(email);
  
  if (!attempt) {
    loginAttemptsMap.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset count if last attempt was more than 1 hour ago
  if (now.getTime() - attempt.lastAttempt.getTime() > 60 * 60 * 1000) {
    loginAttemptsMap.set(email, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if too many attempts
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  loginAttemptsMap.set(email, attempt);
  return true;
};

// Account lockout check
const isAccountLocked = (email: string): boolean => {
  const user = users.get(email);
  if (!user) return false;
  
  if (user.isLocked && user.lockoutUntil) {
    if (new Date() < user.lockoutUntil) {
      return true;
    } else {
      // Unlock account
      user.isLocked = false;
      user.lockoutUntil = undefined;
      user.loginAttempts = 0;
    }
  }
  
  return false;
};

// Lock account after failed attempts
const lockAccount = (email: string): void => {
  const user = users.get(email);
  if (user) {
    user.isLocked = true;
    user.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION);
    user.loginAttempts = 0;
  }
};

// Log login attempt
const logLoginAttempt = (email: string, success: boolean, ipAddress?: string, userAgent?: string): void => {
  const attempt: LoginAttempt = {
    email,
    timestamp: new Date(),
    success,
    ipAddress,
    userAgent
  };
  
  loginAttempts.push(attempt);
  
  // Keep only last 1000 attempts
  if (loginAttempts.length > 1000) {
    loginAttempts.splice(0, loginAttempts.length - 1000);
  }
  
  console.log(`Login attempt: ${email} - ${success ? 'SUCCESS' : 'FAILED'} at ${attempt.timestamp}`);
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generate session token
const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Register user
export const registerUser = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    // Validate input
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') };
    }
    
    // Check if user already exists
    if (users.has(email)) {
      return { success: false, error: 'User already exists' };
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      email,
      passwordHash,
      role: 'user',
      createdAt: new Date(),
      loginAttempts: 0
    };
    
    users.set(email, user);
    
    logLoginAttempt(email, true);
    
    return { success: true, user: { ...user, passwordHash: '' } }; // Don't return password hash
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Login user
export const loginUser = async (email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; error?: string; user?: User; sessionToken?: string }> => {
  try {
    // Validate input
    if (!validateEmail(email)) {
      logLoginAttempt(email, false, ipAddress, userAgent);
      return { success: false, error: 'Invalid email format' };
    }
    
    // Check rate limiting
    if (!checkRateLimit(email)) {
      logLoginAttempt(email, false, ipAddress, userAgent);
      return { success: false, error: 'Too many failed attempts. Please try again later.' };
    }
    
    // Check if account is locked
    if (isAccountLocked(email)) {
      logLoginAttempt(email, false, ipAddress, userAgent);
      return { success: false, error: 'Account is temporarily locked. Please try again later.' };
    }
    
    // Get user
    const user = users.get(email);
    if (!user) {
      logLoginAttempt(email, false, ipAddress, userAgent);
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      // Increment failed attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account if too many failed attempts
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockAccount(email);
      }
      
      logLoginAttempt(email, false, ipAddress, userAgent);
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Reset failed attempts on successful login
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    
    // Generate session token
    const sessionToken = generateSessionToken();
    activeSessions.set(sessionToken, {
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT)
    });
    
    logLoginAttempt(email, true, ipAddress, userAgent);
    
    return { 
      success: true, 
      user: { ...user, passwordHash: '' }, // Don't return password hash
      sessionToken 
    };
  } catch (error) {
    console.error('Login error:', error);
    logLoginAttempt(email, false, ipAddress, userAgent);
    return { success: false, error: 'Login failed' };
  }
};

// Validate session
export const validateSession = (sessionToken: string): { valid: boolean; user?: User } => {
  const session = activeSessions.get(sessionToken);
  if (!session) {
    return { valid: false };
  }
  
  // Check if session expired
  if (new Date() > session.expiresAt) {
    activeSessions.delete(sessionToken);
    return { valid: false };
  }
  
  // Find user
  const user = Array.from(users.values()).find(u => u.id === session.userId);
  if (!user) {
    activeSessions.delete(sessionToken);
    return { valid: false };
  }
  
  // Extend session
  session.expiresAt = new Date(Date.now() + SESSION_TIMEOUT);
  
  return { valid: true, user: { ...user, passwordHash: '' } };
};

// Logout user
export const logoutUser = (sessionToken: string): boolean => {
  return activeSessions.delete(sessionToken);
};

// Password reset (simplified - in production, this would send an email)
export const initiatePasswordReset = async (email: string): Promise<{ success: boolean; error?: string; resetToken?: string }> => {
  try {
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    
    const user = users.get(email);
    if (!user) {
      // Don't reveal if user exists
      return { success: true };
    }
    
    // Generate reset token (in production, this would be stored securely and sent via email)
    const resetToken = generateSessionToken();
    
    console.log(`Password reset requested for ${email}. Reset token: ${resetToken}`);
    
    return { success: true, resetToken };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Password reset failed' };
  }
};

// Reset password with token
export const resetPassword = async (email: string, newPassword: string, resetToken: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate input
    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') };
    }
    
    // In production, validate reset token here
    if (!resetToken) {
      return { success: false, error: 'Invalid reset token' };
    }
    
    const user = users.get(email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = passwordHash;
    
    // Reset login attempts and unlock account
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockoutUntil = undefined;
    
    console.log(`Password reset completed for ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Password reset failed' };
  }
};

// Get login attempts (admin only)
export const getLoginAttempts = (limit: number = 100): LoginAttempt[] => {
  return loginAttempts.slice(-limit);
};

// Check if user is admin
export const isAdmin = (user: User): boolean => {
  return user.role === 'admin';
};

// Get all users (admin only)
export const getAllUsers = (): User[] => {
  return Array.from(users.values()).map(user => ({ ...user, passwordHash: '' }));
};

// Clean up expired sessions
setInterval(() => {
  const now = new Date();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}, 60000); // Clean up every minute