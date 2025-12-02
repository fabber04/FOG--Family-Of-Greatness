# Backend API Integration Guide

## Current Setup

The Members page is now connected to the backend API. However, there's an important consideration:

### Authentication Mismatch

- **Frontend**: Uses Firebase Authentication (Firebase ID tokens)
- **Backend**: Uses its own JWT authentication system

### Solution Options

#### Option 1: Update Backend to Accept Firebase Tokens (Recommended)
Modify the backend to verify Firebase ID tokens instead of its own JWT tokens.

#### Option 2: Create User Sync Mechanism
When a user registers with Firebase, also create a corresponding user in the backend database.

#### Option 3: Use Backend Auth for Member Management
Use the backend's own authentication system for admin operations while keeping Firebase for regular users.

## Current Implementation

The Members page will:
1. Try to load members from the backend API
2. Use Firebase ID tokens for authentication
3. Show error messages if the backend is unavailable or authentication fails
4. Fall back gracefully if the API is not accessible

## Testing the Integration

1. **Start the backend server:**
   ```bash
   cd backend
   python3 main.py
   ```

2. **Check if backend is running:**
   - Visit: `http://localhost:8000`
   - Should see: `{"message": "Welcome to FOG API", ...}`

3. **Test API endpoints:**
   - API Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/api/health`

## Next Steps

To fully integrate Firebase with the backend:

1. **Update backend to accept Firebase tokens:**
   - Install `firebase-admin` in backend
   - Create a middleware to verify Firebase ID tokens
   - Map Firebase users to backend users

2. **Or create a sync endpoint:**
   - Create `/api/auth/sync-firebase-user` endpoint
   - When user registers in Firebase, call this to create backend user
   - Store the mapping between Firebase UID and backend user ID

3. **Update API service:**
   - Add function to sync Firebase user to backend
   - Store backend user ID in user context
   - Use backend user ID for member management operations

## Current Status

✅ Members page connected to API
✅ API service created with error handling
✅ Loading states and error messages implemented
⚠️ Backend authentication needs configuration for Firebase tokens

