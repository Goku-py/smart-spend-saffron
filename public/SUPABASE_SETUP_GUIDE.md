# 🔐 Supabase Authentication Setup Guide

## ⚠️ URGENT: Configuration Required

Your Supabase project is not properly configured yet. This guide will help you set up authentication quickly.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Fill in the required details:
   - **Name**: Smart Spend
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest to your users
4. Click **Create new project**

### Step 2: Get API Credentials
1. Once your project is created, go to **Project Settings** → **API**
2. You'll need two values:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon/public** key (`VITE_SUPABASE_ANON_KEY`)

### Step 3: Set Up Environment Variables
1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following lines:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Replace the placeholder values with your actual Supabase credentials
4. Restart your development server

### Step 4: Enable Authentication Providers
1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Toggle to enable
   - Disable "Confirm email" for development (optional)
3. Enable **Google** provider (optional):
   - Toggle to enable
   - You'll need to set up a Google OAuth application
   - Follow the instructions in the Supabase dashboard

### Step 5: Configure Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Set up your OAuth consent screen if prompted
6. For **Application type**, select **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:8080` (for development)
   - `https://yourdomain.com` (for production)
8. Add authorized redirect URIs:
   - `http://localhost:8080` (for development)
   - `https://yourdomain.com` (for production)
9. Copy the **Client ID** and **Client Secret**
10. Add these to your Supabase Google provider settings

## 🧪 Test Authentication

After completing the setup:

1. Restart your development server
2. Try creating a new account with email/password
3. Try signing in with existing credentials
4. If configured, test Google sign-in

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid API key" or "Invalid URL"**
   - Double-check your environment variables
   - Make sure there are no extra spaces or quotes

2. **Email authentication not working**
   - Check if you've enabled the Email provider in Supabase
   - For development, consider disabling email confirmation

3. **Google authentication not working**
   - Verify your Google OAuth credentials
   - Check that redirect URIs are correctly configured
   - Ensure JavaScript origins include your domain

4. **"Network Error" During Sign-In**
   - Check your internet connection
   - Verify CORS settings in Supabase

## 🔒 Security Best Practices

1. **Restrict API Key Usage**
   - In Supabase dashboard, set appropriate restrictions for your API keys

2. **Implement Proper Scopes**
   - Only request necessary permissions from OAuth providers

3. **Regular Auditing**
   - Regularly review authentication activity
   - Monitor for suspicious login attempts

4. **HTTPS Everywhere**
   - Always use HTTPS for production
   - Set secure and httpOnly cookies

## 🆘 Need Help?

If you're still experiencing issues:

1. **Check Supabase Documentation**
   - [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

2. **Common Auth Issues**
   - [Supabase Auth Troubleshooting](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#troubleshooting)

3. **Contact Support**
   - [Supabase Discord](https://discord.supabase.com)
   - [Supabase GitHub](https://github.com/supabase/supabase)