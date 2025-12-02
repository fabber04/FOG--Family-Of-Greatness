# Account Management Setup Guide

## Hybrid Approach: Firebase Auth + Backend API

This project uses a hybrid approach for account management:
- **Firebase Authentication**: Handles user authentication (login, registration, password management)
- **Backend API (Python FastAPI)**: Manages member data, library items, prayer requests, and other business logic

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Get your Firebase config:
   - Go to Project Settings > General > Your apps
   - Copy the configuration values

5. Create a `.env` file in the root directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend API URL (optional - defaults to http://localhost:8000)
REACT_APP_API_URL=http://localhost:8000
```

### 2. Backend API Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
python init_db.py
```

4. Start the backend server:
```bash
python main.py
# Or use: uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### 3. Firestore Database Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Add other collections as needed
  }
}
```

## Features

### Authentication (Firebase)
- ✅ User Registration
- ✅ User Login
- ✅ Session Management
- ✅ Auto-login on page refresh
- ✅ Secure password handling
- ✅ Demo mode fallback (for development without Firebase)

### Member Management (Backend API)
- ✅ View all members
- ✅ Add/Edit/Delete members (admin only)
- ✅ Search and filter members
- ✅ Export to Excel
- ✅ Member details view

### User Profile
- ✅ Profile picture upload
- ✅ Profile information management
- ✅ Settings and preferences
- ✅ Local storage for offline access

## User Roles

### Admin
- Full access to all features
- Member management
- Content management
- Settings access

### Regular User
- Profile management
- Devotionals access
- Prayer requests
- Library access

## API Endpoints

### Authentication (Firebase)
- Registration: Handled by Firebase Auth
- Login: Handled by Firebase Auth
- Logout: Handled by Firebase Auth

### Backend API Endpoints

#### Members
- `GET /api/users/` - Get all members
- `GET /api/users/{user_id}` - Get specific member
- `POST /api/users/` - Create member (admin only)
- `PUT /api/users/{user_id}` - Update member (admin only)
- `DELETE /api/users/{user_id}` - Delete member (admin only)

#### Library
- `GET /api/library/` - Get library items
- `GET /api/library/{item_id}` - Get specific item
- `POST /api/library/` - Create item (admin only)
- `PUT /api/library/{item_id}` - Update item (admin only)
- `DELETE /api/library/{item_id}` - Delete item (admin only)

#### Prayer Requests
- `GET /api/prayer/` - Get prayer requests
- `POST /api/prayer/` - Create prayer request
- `PUT /api/prayer/{request_id}` - Update prayer request
- `DELETE /api/prayer/{request_id}` - Delete prayer request

## Demo Mode

If Firebase is not configured, the app will automatically fall back to demo mode:
- Uses localStorage for user data
- Mock authentication with demo accounts
- All features work but data is not persisted to Firebase

Demo Accounts:
- Admin: `admin@fog.com` / `admin123`
- User: `user@fog.com` / `user123`

## Next Steps

1. **Connect Members Page to Backend**: Update Members.js to use the API service
2. **Sync Profile with Backend**: Update Profile.js to sync with backend API
3. **Add Password Reset**: Implement Firebase password reset functionality
4. **Email Verification**: Add email verification flow
5. **Admin Panel**: Enhance admin features for member management

## Troubleshooting

### Firebase Not Working
- Check that all environment variables are set correctly
- Verify Firebase project settings
- Check browser console for errors
- App will fall back to demo mode automatically

### Backend API Not Connecting
- Ensure backend server is running
- Check API URL in `.env` file
- Verify CORS settings in backend
- Check network tab in browser dev tools

### Authentication Issues
- Clear browser localStorage
- Check Firebase Authentication settings
- Verify email/password provider is enabled
- Check browser console for error messages

