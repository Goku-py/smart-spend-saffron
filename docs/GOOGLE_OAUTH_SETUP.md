# Google OAuth Setup Guide for Smart Spend

## 🔧 Complete Google OAuth Configuration

This guide provides step-by-step instructions to properly configure Google OAuth for Smart Spend authentication.

## 📋 Prerequisites

- Firebase project created
- Google Cloud Console access
- Domain access for production deployment

## 🚀 Step-by-Step Setup

### 1. Firebase Console Configuration

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your Smart Spend project

2. **Enable Google Authentication**
   - Navigate to: Authentication > Sign-in method
   - Click on "Google" provider
   - Toggle "Enable" to ON
   - Add your Web SDK configuration (if not already done)

3. **Configure Authorized Domains**
   - In the same Google provider settings
   - Add your domains to "Authorized domains":
     - `localhost` (for development)
     - `yourdomain.com` (for production)
     - Any other domains you'll use

### 2. Google Cloud Console Setup

1. **Access Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select the same project as your Firebase project
   - If you don't see your Firebase project, make sure you're using the same Google account

2. **Enable Required APIs**
   - Go to: APIs & Services > Library
   - Search and enable:
     - Google+ API (if available)
     - Google Identity API
     - Firebase Authentication API

3. **Create OAuth 2.0 Credentials**
   - Go to: APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - If prompted,  configure the OAuth consent screen first:
     - User Type: External
     - App name: Smart Spend
     - User support email: your-email@example.com
     - Developer contact information: your-email@example.com
     - Authorized domains: Add your domains
   - For Web application:
     - Name: "Smart Spend Web Client"
     - Authorized JavaScript origins:
       - `http://localhost:8080` (development)
       - `https://yourdomain.com` (production)
     - Authorized redirect URIs:
       - `http://localhost:8080/__/auth/handler` (development)
       - `https://yourdomain.com/__/auth/handler` (production)

4. **Get Client ID and Secret**
   - After creating, note your Client ID and Client Secret
   - You'll need these for your Firebase configuration

### 3. Update Firebase Configuration

1. **Update Web SDK Configuration**
   - Go to: Project Settings > Your Apps
   - Select your web app
   - Copy the Firebase configuration object

2. **Update Environment Variables**
   - Open your `.env` file
   - Update the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 4. Verify Configuration

1. **Check Firebase Authentication Settings**
   - Ensure Google provider is enabled
   - Verify authorized domains are correct

2. **Check Google Cloud Console**
   - Verify OAuth 2.0 client ID is created
   - Ensure APIs are enabled
   - Check redirect URIs are correctly set

3. **Test in Development Environment**
   - Run your app locally
   - Try signing in with Google
   - Check browser console for any errors
   - Verify user is created in Firebase Authentication

## 🔍 Troubleshooting Common Issues

### 1. "Popup Closed By User" Error
- **Cause**: User closed the popup or popup was blocked
- **Solution**: 
  - Check if popup blockers are enabled
  - Ensure popup is triggered by a user action (click)
  - Try using a different browser

### 2. "Unauthorized Domain" Error
- **Cause**: Domain not authorized in Firebase
- **Solution**:
  - Add your domain to Firebase authorized domains
  - Check for typos in domain names
  - Ensure you're using the correct Firebase project

### 3. "Configuration Error" or "Invalid Client ID"
- **Cause**: Incorrect OAuth configuration
- **Solution**:
  - Verify Client ID and Secret
  - Check if the correct project is selected
  - Ensure environment variables are correctly set

### 4. "Network Error" During Sign-In
- **Cause**: Network connectivity issues
- **Solution**:
  - Check internet connection
  - Verify firewall settings
  - Try on a different network

### 5. "Popup Blocked" Error
- **Cause**: Browser blocking popups
- **Solution**:
  - Allow popups for your domain
  - Use a different authentication method
  - Update browser settings

## 🔒 Security Best Practices

1. **Restrict API Key Usage**
   - In Google Cloud Console, restrict your API key to only necessary APIs
   - Set HTTP referrer restrictions to your domains

2. **Implement Proper Scopes**
   - Only request necessary scopes (email, profile)
   - Avoid requesting excessive permissions

3. **Regular Auditing**
   - Regularly review authorized applications
   - Monitor authentication activity
   - Check for suspicious login attempts

4. **HTTPS Everywhere**
   - Always use HTTPS for production
   - Redirect HTTP to HTTPS
   - Set secure and httpOnly cookies

5. **Implement Rate Limiting**
   - Limit authentication attempts
   - Implement exponential backoff for failed attempts
   - Monitor for brute force attacks

## 📱 Testing Your Configuration

### Development Environment Test
```javascript
// Add this to your code to debug Google Sign-In
const testGoogleSignIn = async () => {
  try {
    console.log('Testing Google Sign-In...');
    const result = await signInWithGoogle();
    console.log('Sign-in successful:', result);
    return result;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
};
```

### Production Checklist
- [ ] Firebase project in production mode
- [ ] Google OAuth consent screen verified
- [ ] All domains added to authorized domains
- [ ] HTTPS enforced on all domains
- [ ] Rate limiting implemented
- [ ] Error handling and logging in place
- [ ] User feedback for authentication errors

## 🆘 Need Help?

If you're still experiencing issues after following this guide:

1. **Check Firebase Documentation**
   - https://firebase.google.com/docs/auth/web/google-signin

2. **Google OAuth Documentation**
   - https://developers.google.com/identity/sign-in/web/sign-in

3. **Common Issues**
   - https://firebase.google.com/docs/auth/web/auth-state-persistence
   - https://firebase.google.com/docs/auth/web/errors

4. **Contact Support**
   - Firebase Support: https://firebase.google.com/support
   - Google Cloud Support: https://cloud.google.com/support