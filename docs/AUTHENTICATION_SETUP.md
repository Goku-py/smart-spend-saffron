# Smart Spend Authentication System Setup Guide

## 🔐 Overview

This guide provides comprehensive instructions for setting up the secure authentication system in Smart Spend, including Google Sign-In integration, Firebase configuration, and GDPR compliance.

## 📋 Prerequisites

- Firebase project with Authentication enabled
- Google Cloud Console project
- Domain verification for production deployment
- SSL certificate for HTTPS (required for OAuth)

## 🚀 Quick Setup

### 1. Firebase Project Setup

1. **Create Firebase Project**
   ```bash
   # Visit https://console.firebase.google.com
   # Click "Create a project"
   # Follow the setup wizard
   ```

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Enable Google provider
   - Add your domain to authorized domains

3. **Configure Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

### 2. Google OAuth Configuration

1. **Google Cloud Console Setup**
   ```bash
   # Visit https://console.cloud.google.com
   # Select your project
   # Go to APIs & Services > Credentials
   ```

2. **Create OAuth 2.0 Client ID**
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:8080` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:8080/__/auth/handler` (development)
     - `https://yourdomain.com/__/auth/handler` (production)

3. **Configure OAuth Consent Screen**
   - User Type: External (for public apps)
   - App information: Fill in app name, logo, etc.
   - Scopes: Add email and profile scopes
   - Test users: Add test email addresses

### 3. Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Supabase Configuration (Optional Fallback)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Expenses - user-specific access
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Budgets - user-specific access
    match /budgets/{budgetId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Claims (Optional)

For role-based access control:

```javascript
// Cloud Function to set custom claims
const admin = require('firebase-admin');

exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Verify admin privileges
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  await admin.auth().setCustomUserClaims(data.uid, {
    role: data.role,
    permissions: data.permissions
  });
  
  return { success: true };
});
```

### Email Templates

Customize Firebase email templates:

1. Go to Authentication > Templates
2. Customize:
   - Email verification
   - Password reset
   - Email address change

### Security Monitoring

Enable Firebase Security Rules monitoring:

```javascript
// Add to your security rules for logging
allow read, write: if request.auth != null && 
  request.auth.uid == userId &&
  debug(request.auth.uid);
```

## 🛡️ Security Best Practices

### 1. Input Validation

```typescript
// Always validate user inputs
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /\d/.test(password);
};
```

### 2. Rate Limiting

```typescript
// Implement client-side rate limiting
const rateLimiter = new Map();

const checkRateLimit = (action: string, limit: number = 5): boolean => {
  const now = Date.now();
  const key = `${action}_${Math.floor(now / 60000)}`; // Per minute
  
  const count = rateLimiter.get(key) || 0;
  if (count >= limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  rateLimiter.set(key, count + 1);
  return true;
};
```

### 3. Session Management

```typescript
// Secure session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const validateSession = (): boolean => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (!lastActivity) return false;
  
  const timeSinceActivity = Date.now() - parseInt(lastActivity);
  return timeSinceActivity < SESSION_TIMEOUT;
};

// Update activity timestamp
const updateActivity = () => {
  localStorage.setItem('lastActivity', Date.now().toString());
};
```

## 📱 GDPR Compliance

### 1. Consent Management

```typescript
interface GDPRConsent {
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  consentDate: Date;
  ipAddress?: string;
  userAgent?: string;
}

const recordConsent = async (consent: GDPRConsent) => {
  await updateUserProfile(user.uid, {
    gdprConsent: {
      ...consent,
      consentDate: serverTimestamp(),
      ipAddress: await getUserIP(), // Optional
      userAgent: navigator.userAgent
    }
  });
};
```

### 2. Data Export

```typescript
const exportUserData = async (userId: string) => {
  const userData = await getUserProfile(userId);
  const expenses = await getUserExpenses(userId);
  const budgets = await getUserBudgets(userId);
  
  return {
    profile: userData,
    expenses,
    budgets,
    exportDate: new Date().toISOString(),
    format: 'JSON'
  };
};
```

### 3. Right to be Forgotten

```typescript
const deleteUserData = async (userId: string) => {
  // Anonymize instead of delete for audit purposes
  await updateUserProfile(userId, {
    email: '[DELETED]',
    displayName: '[DELETED]',
    photoURL: null,
    deleted: true,
    deletedAt: serverTimestamp()
  });
  
  // Delete authentication account
  await admin.auth().deleteUser(userId);
};
```

## 🧪 Testing

### Unit Tests

```typescript
// Test authentication functions
describe('Authentication', () => {
  test('should validate email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
  
  test('should validate password strength', () => {
    expect(validatePassword('Password123')).toBe(true);
    expect(validatePassword('weak')).toBe(false);
  });
});
```

### Integration Tests

```typescript
// Test authentication flow
describe('Auth Flow', () => {
  test('should sign up user with email', async () => {
    const result = await signUpWithEmail(
      'test@example.com',
      'Password123',
      'Test User',
      { marketing: false, analytics: true }
    );
    
    expect(result.user).toBeDefined();
    expect(result.error).toBeNull();
  });
});
```

## 🚀 Deployment

### Production Checklist

- [ ] Firebase project configured for production
- [ ] Google OAuth configured with production domains
- [ ] Environment variables set in hosting platform
- [ ] Security rules deployed
- [ ] Email templates customized
- [ ] GDPR compliance verified
- [ ] Rate limiting implemented
- [ ] Error monitoring configured
- [ ] Backup strategy in place

### Monitoring

Set up monitoring for:
- Authentication success/failure rates
- Session duration
- Security rule violations
- API usage patterns
- Error rates

## 🆘 Troubleshooting

### Common Issues

1. **Google OAuth not working**
   - Check authorized domains in Google Console
   - Verify OAuth client ID configuration
   - Ensure HTTPS in production

2. **Firebase connection errors**
   - Verify environment variables
   - Check Firebase project settings
   - Confirm API keys are correct

3. **CORS errors**
   - Add domain to Firebase authorized domains
   - Check browser console for specific errors
   - Verify request headers

### Debug Mode

Enable debug logging:

```typescript
// Enable Firebase debug logging
if (process.env.NODE_ENV === 'development') {
  firebase.firestore.setLogLevel('debug');
}
```

## 📞 Support

For additional help:
- Firebase Documentation: https://firebase.google.com/docs
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- GDPR Compliance Guide: https://gdpr.eu/

---

**Security Note:** Always keep your API keys secure and never commit them to version control. Use environment variables and secure key management practices.