# User Registration Flow - Data Capture

## Current Registration Process

### 1. User Registration Form
**Location**: `src/components/Register.js`

**Data Collected**:
- ✅ **Full Name** (required)
- ✅ **Email** (required)
- ✅ **Password** (required, min 6 characters)
- ✅ **Phone Number** (optional)
- ✅ **Grade/Level** (optional): 9th Grade, 10th Grade, 11th Grade, 12th Grade, College, University, Working Professional

### 2. Registration Flow

#### Step 1: Firebase Authentication
- User is created in Firebase Auth
- Email and password are stored securely
- Firebase UID is generated

#### Step 2: Firestore (Firebase Database)
**Location**: `src/contexts/AuthContext.js` (lines 49-65)

**Data Saved to Firestore**:
```javascript
{
  uid: user.uid,
  email: user.email,
  name: fullName,
  role: 'user',
  permissions: ['profile', 'devotionals', 'prayer-requests'],
  phone: additionalData.phone || '',
  grade: additionalData.grade || '',  // ⚠️ Currently only in Firestore
  joinDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
}
```

#### Step 3: Backend API Sync
**Location**: `src/contexts/AuthContext.js` (lines 67-82)
**Endpoint**: `POST /api/auth/sync-firebase-user-with-token`

**Data Sent to Backend**:
```javascript
{
  full_name: fullName,
  phone: additionalData.phone,
  location: additionalData.location,
  role: 'Member',
  is_admin: false
}
```

**⚠️ ISSUE**: `grade` field is NOT being sent to backend!

### 3. Backend Database (PostgreSQL)
**Location**: `backend/models.py`

**User Model Fields**:
- ✅ `id` - Primary key
- ✅ `email` - Unique, required
- ✅ `username` - Unique, auto-generated from email
- ✅ `full_name` - Required
- ✅ `firebase_uid` - Firebase user ID
- ✅ `phone` - Optional
- ✅ `location` - Optional
- ✅ `role` - Optional (default: "Member")
- ✅ `is_admin` - Boolean (default: false)
- ✅ `is_active` - Boolean (default: true)
- ✅ `created_at` - Timestamp
- ✅ `updated_at` - Timestamp
- ❌ **`grade` - MISSING!**

## Issues Found

### 1. Grade Field Not Saved to Backend
- **Problem**: Registration form collects `grade`, but it's only saved to Firestore, not PostgreSQL
- **Impact**: Grade data is not available in backend database for analytics/reporting
- **Fix Needed**: Add `grade` field to backend User model and sync it

### 2. Location Field Not Collected
- **Problem**: Backend has `location` field, but registration form doesn't collect it
- **Impact**: Location data cannot be captured during registration
- **Fix Needed**: Add location field to registration form (optional)

## What Data IS Being Captured

### ✅ Captured in Both Firestore AND Backend:
- Full Name
- Email
- Phone (if provided)
- Role
- Created Date

### ✅ Captured Only in Firestore:
- Grade/Level ⚠️

### ❌ Not Captured:
- Location (backend has field, but form doesn't collect it)

## Recommendations

### Option 1: Add Grade to Backend (Recommended)
1. Add `grade` column to User model in `backend/models.py`
2. Add `grade` to FirebaseSyncRequest schema in `backend/schemas.py`
3. Update sync function in `src/contexts/AuthContext.js` to include grade
4. Run database migration

### Option 2: Add Location Field
1. Add location input to registration form
2. Include location in sync data

### Option 3: Keep Grade in Firestore Only
- If grade is only needed for frontend display
- Backend doesn't need it for core functionality

## Current Registration Endpoints

### Backend API
- `POST /api/auth/register` - Direct backend registration (not used with Firebase)
- `POST /api/auth/sync-firebase-user-with-token` - Sync Firebase user to backend ✅ **Currently Used**

### Frontend
- Registration form: `/register` route
- Uses Firebase Auth + Backend sync

## Testing Registration

### Test User Registration:
1. Visit: https://fabber04.github.io/FOG--Family-Of-Greatness/register
2. Fill out form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +263 77 123 4567
   - Grade: College
   - Password: test123
3. Submit
4. Check:
   - ✅ User created in Firebase Auth
   - ✅ User document in Firestore
   - ✅ User synced to backend PostgreSQL

### Verify Data Capture:
```bash
# Check backend users (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://fog-family-of-greatness-production.up.railway.app/api/users/
```

## Next Steps

1. **Decide**: Do we need `grade` in backend database?
2. **If yes**: Add grade field to backend model and sync
3. **If no**: Document that grade is Firestore-only
4. **Consider**: Adding location field to registration form
5. **Test**: Full registration flow end-to-end





