# 🔥 Firebase Authentication Setup Guide

## ⚠️ URGENT: Domain Authorization Required

Your Firebase project is properly configured, but **localhost:8080 is not authorized** for OAuth operations. This is causing the "unauthorized domain" error you're seeing.

## 🚀 Quick Fix (5 minutes)

### Step 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **smart-spend-b72c5**
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add:
   - `localhost`
   - `localhost:8080`
5. Click **Save**

### Step 2: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project: **smart-spend-b72c5**
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and click **Edit** (pencil icon)
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8080`
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:8080/__/auth/handler`
7. Click **Save**

### Step 3: Restart Development Server
After making these changes:
1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev`
3. Test authentication

## 🧪 Test Authentication

After completing the setup:

### Email/Password Test:
1. Try creating a new account with email/password
2. Try signing in with existing credentials

### Google OAuth Test:
1. Click "Continue with Google"
2. Verify the popup opens without errors
3. Complete the sign-in process

## 🔧 Current Configuration Status

✅ **Firebase Project**: smart-spend-b72c5  
✅ **API Key**: Valid and configured  
✅ **Environment Variables**: Properly set  
❌ **Domain Authorization**: **NEEDS SETUP** ← This is the issue  

## 🆘 Still Having Issues?

### Common Problems:

1. **"Unauthorized domain" error persists**
   - Clear browser cache and cookies
   - Wait 5-10 minutes for changes to propagate
   - Verify you added the exact domains: `localhost` and `localhost:8080`

2. **Google OAuth popup doesn't open**
   - Check if popups are blocked in your browser
   - Try in an incognito/private window
   - Verify JavaScript origins are set correctly

3. **"Invalid credential" for email/password**
   - Make sure you're using the correct email/password
   - Try creating a new account first
   - Check if the user exists in Firebase Authentication console

### Debug Information:
- **Project ID**: smart-spend-b72c5
- **Auth Domain**: smart-spend-b72c5.firebaseapp.com
- **Current URL**: http://localhost:8080
- **Error**: Domain not authorized for OAuth operations

## ✅ Verification Checklist

Complete these steps in order:

- [ ] Added `localhost` to Firebase authorized domains
- [ ] Added `localhost:8080` to Firebase authorized domains
- [ ] Added `http://localhost:8080` to Google Cloud OAuth origins
- [ ] Added `http://localhost:8080/__/auth/handler` to Google Cloud redirect URIs
- [ ] Restarted development server
- [ ] Tested email/password authentication
- [ ] Tested Google OAuth authentication

## 🎯 Expected Result

Once you complete these steps:
- ✅ Email/password sign-in will work
- ✅ Google OAuth sign-in will work
- ✅ No more "unauthorized domain" errors
- ✅ Users can create accounts and sign in seamlessly

**Time to fix**: ~5 minutes  
**Difficulty**: Easy (just configuration changes)

---

**Need help?** The error messages in the app now provide more specific guidance, and this setup only needs to be done once for your development environment.