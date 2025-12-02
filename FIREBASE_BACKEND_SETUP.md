# Firebase + Backend Integration Setup Guide

## Overview

The system now supports Firebase Authentication with automatic user synchronization to the backend database. When users register via Firebase, they are automatically synced to the backend.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `firebase-admin` - For Firebase token verification (recommended for production)
- `requests` - For Firebase REST API token verification (fallback)

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./fog_platform.db

# JWT Secret Key (CHANGE THIS IN PRODUCTION!)
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_API_KEY=your-firebase-api-key

# Firebase Admin SDK (Optional - for production)
# Download service account JSON from Firebase Console
# Project Settings > Service Accounts > Generate New Private Key
FIREBASE_CREDENTIALS=path/to/firebase-service-account.json
```

### 3. Get Firebase Credentials

#### Option A: Firebase API Key (Simple, for development)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Copy the "Web API Key" to `FIREBASE_API_KEY`
5. Copy the "Project ID" to `FIREBASE_PROJECT_ID`

#### Option B: Service Account (Recommended for production)
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Set `FIREBASE_CREDENTIALS` to the path of this file

### 4. Run Database Migration

If you have an existing database, run the migration script:

```bash
cd backend
python migrate_add_firebase_fields.py
```

This adds the following fields to the `users` table:
- `firebase_uid` - Links Firebase users to backend users
- `phone` - User phone number
- `location` - User location
- `role` - User role (Member, Admin, Pastor, etc.)

### 5. Initialize Database

```bash
cd backend
python init_db.py
```

### 6. Start Backend Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Configure Firebase

Create a `.env` file in the root directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend API URL
REACT_APP_API_URL=http://localhost:8000
```

### 2. Enable Firebase Authentication

1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. (Optional) Enable other providers as needed

## How It Works

### User Registration Flow

1. **User registers via Firebase** (`/register` page)
   - User account created in Firebase Authentication
   - User document created in Firestore

2. **Automatic Backend Sync**
   - Frontend calls `/api/auth/sync-firebase-user-with-token`
   - Backend verifies Firebase token
   - Backend creates/updates user in database
   - Links Firebase UID to backend user ID

3. **User Login**
   - User logs in via Firebase
   - Frontend gets Firebase ID token
   - If user not synced, automatic sync happens
   - Token used for all backend API requests

### Authentication Flow

1. **Frontend sends request** with Firebase ID token in `Authorization: Bearer <token>` header
2. **Backend verifies token** using Firebase Admin SDK or REST API
3. **Backend finds user** by `firebase_uid` in database
4. **Request proceeds** with authenticated user context

## API Endpoints

### Authentication

- `POST /api/auth/sync-firebase-user-with-token` - Sync Firebase user to backend (uses token from header)
- `POST /api/auth/sync-firebase-user` - Sync Firebase user with explicit data
- `POST /api/auth/register` - Register user (backend JWT auth - for admin use)
- `POST /api/auth/login` - Login (backend JWT auth - for admin use)

### User Management

- `GET /api/users/` - Get all users (requires admin, supports Firebase tokens)
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

## Testing

### Test User Registration

1. Start backend: `cd backend && python main.py`
2. Start frontend: `npm start`
3. Navigate to `/register`
4. Create a new account
5. Check backend logs - should see sync request
6. Check database - user should be created with `firebase_uid`

### Test API with Firebase Token

1. Login via Firebase
2. Open browser console
3. Get Firebase token:
   ```javascript
   const user = firebase.auth().currentUser;
   const token = await user.getIdToken();
   console.log(token);
   ```
4. Test API:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8000/api/users/
   ```

## Troubleshooting

### "User not found in backend. Please sync your account."

- User exists in Firebase but not in backend
- Solution: User will be auto-synced on next login, or call sync endpoint manually

### "Invalid Firebase token"

- Token expired or invalid
- Solution: Frontend should refresh token automatically

### "Cannot connect to backend API"

- Backend not running or wrong URL
- Solution: Check `REACT_APP_API_URL` and ensure backend is running

### Migration Errors

- If migration fails, database might be in inconsistent state
- Solution: Backup database, recreate tables, or manually add columns

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Change SECRET_KEY** in production
3. **Use Firebase Admin SDK** in production (more secure than REST API)
4. **Enable CORS properly** - Only allow your frontend domains
5. **Use HTTPS** in production for all API calls

## Next Steps

- [ ] Set up Firebase project
- [ ] Configure environment variables
- [ ] Run database migration
- [ ] Test user registration
- [ ] Test API authentication
- [ ] Deploy backend with proper security settings

