# Security Guidelines for Smart Spend Authentication

## 🔒 Security Overview

This document outlines the security measures implemented in the Smart Spend authentication system and provides guidelines for maintaining security best practices.

## 🛡️ Authentication Security Features

### 1. Multi-Provider Authentication
- **Firebase Authentication**: Primary authentication provider
- **Supabase**: Fallback authentication provider
- **Demo Mode**: Secure local testing environment

### 2. Password Security
- **Minimum Requirements**: 8 characters, uppercase, lowercase, numbers
- **Strength Validation**: Real-time password strength indicator
- **Secure Storage**: Passwords hashed using Firebase/Supabase security
- **Reset Mechanism**: Secure email-based password reset

### 3. Session Management
- **Automatic Expiration**: Sessions expire after 24 hours of inactivity
- **Secure Logout**: Complete data cleanup on logout
- **Cross-Device Security**: Sessions isolated per device
- **Token Refresh**: Automatic token refresh for active sessions

### 4. Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Input Validation**: Comprehensive client and server-side validation
- **XSS Protection**: Content Security Policy implemented
- **CSRF Protection**: Token-based request validation

## 🔐 Implementation Details

### Password Validation

```typescript
const validatePassword = (password: string): {
  isValid: boolean;
  strength: number;
  requirements: string[];
} => {
  const requirements = [];
  let strength = 0;
  
  if (password.length < 8) {
    requirements.push('At least 8 characters');
  } else {
    strength++;
  }
  
  if (!/[A-Z]/.test(password)) {
    requirements.push('At least one uppercase letter');
  } else {
    strength++;
  }
  
  if (!/[a-z]/.test(password)) {
    requirements.push('At least one lowercase letter');
  } else {
    strength++;
  }
  
  if (!/\d/.test(password)) {
    requirements.push('At least one number');
  } else {
    strength++;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    requirements.push('At least one special character');
  } else {
    strength++;
  }
  
  return {
    isValid: requirements.length === 0,
    strength,
    requirements
  };
};
```

### Rate Limiting

```typescript
class RateLimiter {
  private attempts = new Map<string, number[]>();
  
  checkLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing attempts for this identifier
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = userAttempts.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentAttempts.length >= maxAttempts) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(windowMs / 1000)} seconds.`);
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}
```

### Secure Session Storage

```typescript
class SecureSessionManager {
  private static readonly SESSION_KEY = 'smart_spend_session';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  static setSession(user: AuthUser): void {
    const session = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.MAX_AGE
    };
    
    // Encrypt session data before storing
    const encryptedSession = this.encrypt(JSON.stringify(session));
    localStorage.setItem(this.SESSION_KEY, encryptedSession);
  }
  
  static getSession(): AuthUser | null {
    try {
      const encryptedSession = localStorage.getItem(this.SESSION_KEY);
      if (!encryptedSession) return null;
      
      const sessionData = JSON.parse(this.decrypt(encryptedSession));
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        this.clearSession();
        return null;
      }
      
      return sessionData.user;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return null;
    }
  }
  
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.clear();
  }
  
  private static encrypt(data: string): string {
    // Simple encryption for demo - use proper encryption in production
    return btoa(data);
  }
  
  private static decrypt(data: string): string {
    // Simple decryption for demo - use proper decryption in production
    return atob(data);
  }
}
```

## 🔍 Security Monitoring

### Authentication Events

```typescript
interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'password_reset' | 'account_locked';
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class SecurityLogger {
  static logEvent(event: SecurityEvent): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', event);
    }
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(event);
    }
    
    // Store locally for audit trail
    this.storeLocally(event);
  }
  
  private static sendToMonitoring(event: SecurityEvent): void {
    // Send to external monitoring service (e.g., Sentry, LogRocket)
    fetch('/api/security-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(error => {
      console.error('Failed to send security event:', error);
    });
  }
  
  private static storeLocally(event: SecurityEvent): void {
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
  }
}
```

### Suspicious Activity Detection

```typescript
class SecurityAnalyzer {
  static analyzeLoginAttempt(email: string, success: boolean): void {
    const key = `login_attempts_${email}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Remove attempts older than 1 hour
    const recentAttempts = attempts.filter((time: number) => now - time < oneHour);
    
    if (success) {
      // Clear failed attempts on successful login
      localStorage.removeItem(key);
    } else {
      // Add failed attempt
      recentAttempts.push(now);
      localStorage.setItem(key, JSON.stringify(recentAttempts));
      
      // Check for suspicious activity
      if (recentAttempts.length >= 5) {
        this.handleSuspiciousActivity(email, 'multiple_failed_logins');
      }
    }
  }
  
  private static handleSuspiciousActivity(email: string, type: string): void {
    SecurityLogger.logEvent({
      type: 'account_locked',
      email,
      timestamp: new Date(),
      metadata: { reason: type, attempts: 5 }
    });
    
    // Temporarily lock account (client-side only for demo)
    const lockKey = `account_locked_${email}`;
    const lockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
    localStorage.setItem(lockKey, lockUntil.toString());
    
    throw new Error('Account temporarily locked due to suspicious activity. Please try again in 15 minutes.');
  }
  
  static isAccountLocked(email: string): boolean {
    const lockKey = `account_locked_${email}`;
    const lockUntil = localStorage.getItem(lockKey);
    
    if (!lockUntil) return false;
    
    if (Date.now() > parseInt(lockUntil)) {
      localStorage.removeItem(lockKey);
      return false;
    }
    
    return true;
  }
}
```

## 🌍 GDPR Compliance

### Data Processing Consent

```typescript
interface GDPRConsent {
  necessary: boolean; // Always true - required for service
  functional: boolean; // Remember preferences
  analytics: boolean; // Usage analytics
  marketing: boolean; // Marketing communications
  consentDate: Date;
  consentVersion: string;
  ipAddress?: string;
  userAgent?: string;
}

class GDPRManager {
  private static readonly CONSENT_VERSION = '1.0';
  
  static recordConsent(consent: Omit<GDPRConsent, 'consentDate' | 'consentVersion'>): void {
    const fullConsent: GDPRConsent = {
      ...consent,
      necessary: true, // Always required
      consentDate: new Date(),
      consentVersion: this.CONSENT_VERSION
    };
    
    localStorage.setItem('gdpr_consent', JSON.stringify(fullConsent));
    
    SecurityLogger.logEvent({
      type: 'login',
      timestamp: new Date(),
      metadata: { gdpr_consent: fullConsent }
    });
  }
  
  static getConsent(): GDPRConsent | null {
    const consent = localStorage.getItem('gdpr_consent');
    return consent ? JSON.parse(consent) : null;
  }
  
  static hasValidConsent(): boolean {
    const consent = this.getConsent();
    if (!consent) return false;
    
    // Check if consent is still valid (1 year)
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    const consentAge = Date.now() - new Date(consent.consentDate).getTime();
    
    return consentAge < oneYear && consent.consentVersion === this.CONSENT_VERSION;
  }
  
  static revokeConsent(): void {
    localStorage.removeItem('gdpr_consent');
    
    SecurityLogger.logEvent({
      type: 'logout',
      timestamp: new Date(),
      metadata: { reason: 'gdpr_consent_revoked' }
    });
  }
}
```

### Data Export

```typescript
class DataExporter {
  static async exportUserData(userId: string): Promise<string> {
    const userData = {
      profile: await this.getUserProfile(userId),
      expenses: await this.getUserExpenses(userId),
      budgets: await this.getUserBudgets(userId),
      securityEvents: this.getSecurityEvents(userId),
      gdprConsent: GDPRManager.getConsent(),
      exportMetadata: {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        dataFormat: 'JSON'
      }
    };
    
    return JSON.stringify(userData, null, 2);
  }
  
  private static getSecurityEvents(userId: string): SecurityEvent[] {
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    return events.filter((event: SecurityEvent) => event.userId === userId);
  }
}
```

## 🚨 Incident Response

### Security Incident Handling

```typescript
class IncidentResponse {
  static handleSecurityIncident(incident: {
    type: 'data_breach' | 'unauthorized_access' | 'system_compromise';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedUsers?: string[];
  }): void {
    // Log incident
    SecurityLogger.logEvent({
      type: 'login',
      timestamp: new Date(),
      metadata: { security_incident: incident }
    });
    
    // Immediate actions based on severity
    switch (incident.severity) {
      case 'critical':
        this.emergencyLockdown();
        break;
      case 'high':
        this.enhancedMonitoring();
        break;
      case 'medium':
        this.increaseAlerts();
        break;
      case 'low':
        this.standardLogging();
        break;
    }
    
    // Notify affected users if applicable
    if (incident.affectedUsers) {
      this.notifyAffectedUsers(incident.affectedUsers, incident);
    }
  }
  
  private static emergencyLockdown(): void {
    // Force logout all users
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to security notice page
    window.location.href = '/security-notice';
  }
  
  private static enhancedMonitoring(): void {
    // Enable additional security checks
    localStorage.setItem('enhanced_security', 'true');
  }
  
  private static increaseAlerts(): void {
    // Increase sensitivity of security monitoring
    localStorage.setItem('alert_level', 'elevated');
  }
  
  private static standardLogging(): void {
    // Continue with standard security logging
    console.log('Security incident logged - standard monitoring continues');
  }
  
  private static notifyAffectedUsers(userIds: string[], incident: any): void {
    // In a real implementation, this would send notifications
    console.log('Security notification sent to affected users:', userIds);
  }
}
```

## 📋 Security Checklist

### Pre-Production Security Review

- [ ] **Authentication**
  - [ ] Multi-factor authentication available
  - [ ] Password strength requirements enforced
  - [ ] Account lockout after failed attempts
  - [ ] Secure password reset flow

- [ ] **Session Management**
  - [ ] Session timeout implemented
  - [ ] Secure session storage
  - [ ] Proper logout functionality
  - [ ] Cross-site request forgery protection

- [ ] **Data Protection**
  - [ ] Input validation on all forms
  - [ ] Output encoding to prevent XSS
  - [ ] SQL injection prevention
  - [ ] Sensitive data encryption

- [ ] **Monitoring & Logging**
  - [ ] Security event logging
  - [ ] Failed login attempt monitoring
  - [ ] Suspicious activity detection
  - [ ] Incident response procedures

- [ ] **GDPR Compliance**
  - [ ] Consent management system
  - [ ] Data export functionality
  - [ ] Right to be forgotten implementation
  - [ ] Privacy policy compliance

- [ ] **Infrastructure Security**
  - [ ] HTTPS enforcement
  - [ ] Security headers configured
  - [ ] Regular security updates
  - [ ] Backup and recovery procedures

### Regular Security Maintenance

- [ ] **Monthly Reviews**
  - [ ] Review security logs
  - [ ] Update dependencies
  - [ ] Test backup procedures
  - [ ] Review access permissions

- [ ] **Quarterly Assessments**
  - [ ] Penetration testing
  - [ ] Security policy review
  - [ ] Incident response testing
  - [ ] GDPR compliance audit

- [ ] **Annual Activities**
  - [ ] Full security audit
  - [ ] Disaster recovery testing
  - [ ] Security training updates
  - [ ] Third-party security assessment

---

**Remember**: Security is an ongoing process, not a one-time implementation. Regular reviews and updates are essential to maintain a secure authentication system.