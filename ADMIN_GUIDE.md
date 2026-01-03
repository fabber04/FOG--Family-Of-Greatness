# FOG Platform - Admin Guide: User Tracking & Content Management

## Current Capabilities

### 1. **User Tracking & Management**

#### Via Web Interface (Members Page)
- **Location**: Navigate to `/members` in the admin dashboard
- **Features**:
  - View all registered users in a table
  - Search users by name, email, or username
  - Filter by status (Active, Inactive, Pending)
  - Export users to Excel (filtered or all)
  - Add new members manually
  - Edit user information
  - Activate/Deactivate users
  - Delete users

#### Via Database Script
- **Location**: `view_database.py` in project root
- **Usage**: 
  ```bash
  cd /home/fab/Documents/Projects/FOG--Family-Of-Greatness
  python3 view_database.py
  ```
- **Features**:
  - View all users in formatted table
  - Search users
  - View user statistics
  - Export users to CSV
  - View content summary

#### Via API Endpoints
- **Get all users**: `GET /api/users/` (requires admin token)
- **Get user stats**: `GET /api/users/stats/overview` (requires admin token)
- **Search users**: `GET /api/users/?search=term` (requires admin token)

### 2. **Content Management**

#### Podcasts
- **Location**: `/admin/podcasts`
- **Features**:
  - View all podcasts
  - Add new podcasts (upload audio or use Google Drive link)
  - Edit podcast details
  - Delete podcasts
  - Upload cover images

#### Events
- **Location**: `/admin/events`
- **Features**:
  - View all events
  - Create new events
  - Edit event details
  - Delete events
  - Upload event images

#### Library
- **Location**: `/admin/library`
- **Features**:
  - View all library items
  - Add new library items (books, blogs, quotes)
  - Edit library items
  - Delete library items
  - Upload cover images

#### Prayer Requests
- **Location**: `/prayer-requests`
- **Features**:
  - View all prayer requests
  - Filter by status (pending, in progress, answered)
  - Update prayer request status
  - View prayer statistics

## Quick Access Methods

### Method 1: Web Interface (Recommended)
1. Log in as admin
2. Use sidebar navigation:
   - **Members** → User management
   - **Events** → Event management
   - **Podcasts** → Podcast management
   - **Library** → Library management
   - **Prayer Requests** → Prayer management

### Method 2: Database Script
Run the `view_database.py` script for direct database access:
```bash
python3 view_database.py
```

### Method 3: API Access
Use API endpoints with your admin token:
```bash
# Get auth token first
python3 get_auth_token.py

# Then query API
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/users/
```

## Database Location
- **SQLite Database**: `backend/fog_platform.db`
- You can also use SQLite browser tools to view the database directly

## Tips for Better Management

1. **Regular Exports**: Export user data weekly/monthly for backup
2. **Search Functionality**: Use search to quickly find specific users
3. **Filter Options**: Use filters to view specific user groups
4. **Statistics**: Check the admin dashboard for quick stats overview
5. **Content Organization**: Use categories and tags for better content organization

## Future Enhancements (Optional)
- User activity logs
- Content analytics
- Automated reports
- Email notifications for new registrations
- Bulk user operations

