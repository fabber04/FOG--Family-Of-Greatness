# Firebase Setup Quick Start Guide

## Fix: "api-key-not-valid" Error

This error means Firebase is not properly configured. Follow these steps:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app, click "Add app" and select the web icon `</>`
5. Register your app (give it a nickname like "FOG Web App")
6. Copy the configuration values that look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 3: Create .env File

1. In the project root directory, create a file named `.env` (not `.env.example`)
2. Copy the template from `env.example`:

```bash
cp env.example .env
```

3. Open `.env` and replace the placeholder values with your actual Firebase config:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Backend API URL
REACT_APP_API_URL=http://localhost:8000
```

**Important:**
- Remove any quotes around the values
- Don't include `const firebaseConfig = {` or `};`
- Just the values after the colons

### Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left menu
2. Click "Get started"
3. Click on "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" (toggle it ON)
6. Click "Save"

### Step 5: Restart Development Server

**IMPORTANT:** After creating/updating `.env`, you MUST restart the development server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm start
   ```

React doesn't automatically reload environment variables - you need to restart!

### Step 6: Verify Setup

1. Open browser console (F12)
2. Look for: `✅ Firebase initialized successfully`
3. If you see errors, check:
   - `.env` file exists in project root (not in `src/` or `backend/`)
   - All values are correct (no typos)
   - No quotes around values
   - Server was restarted after creating `.env`

## Troubleshooting

### Error: "api-key-not-valid"

**Causes:**
- `.env` file doesn't exist
- API key is incorrect or has typos
- Server wasn't restarted after creating `.env`
- API key is from a different Firebase project

**Solutions:**
1. Verify `.env` file exists in project root
2. Double-check API key in Firebase Console
3. Restart development server
4. Check browser console for detailed error messages

### Error: "auth/operation-not-allowed"

**Cause:** Email/Password authentication is not enabled

**Solution:**
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password"
3. Save changes

### App Still Shows Demo Mode

**Causes:**
- Environment variables not loaded
- Server not restarted
- `.env` file in wrong location

**Solutions:**
1. Ensure `.env` is in project root (same level as `package.json`)
2. Restart development server completely
3. Check browser console for Firebase config status

## Quick Checklist

- [ ] Firebase project created
- [ ] Web app added to Firebase project
- [ ] Configuration values copied
- [ ] `.env` file created in project root
- [ ] All Firebase values added to `.env`
- [ ] Email/Password authentication enabled
- [ ] Development server restarted
- [ ] Browser console shows "Firebase initialized successfully"

## Need Help?

1. Check browser console for specific error messages
2. Verify `.env` file format matches `env.example`
3. Ensure no extra spaces or quotes in `.env` values
4. Try creating a new Firebase project if issues persist

## Demo Mode

If you can't set up Firebase right now, the app will run in demo mode:
- Uses localStorage for user data
- Mock authentication (admin@fog.com / admin123)
- All features work but data is not persisted to Firebase

To use demo mode, just don't create a `.env` file or use placeholder values.

