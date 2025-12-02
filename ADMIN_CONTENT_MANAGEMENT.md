# Admin Content Management Guide

## Overview

The FOG platform includes a comprehensive admin dashboard that allows administrators to manage all content types through a user-friendly interface. All admin features are protected and require admin authentication.

## Accessing the Admin Dashboard

1. **Login as Admin**: Ensure you're logged in with an admin account
2. **Navigate to Admin**: Click on "Admin" in the sidebar navigation (visible only to admins)
3. **Admin Dashboard**: You'll see an overview with statistics and quick access to all content management sections

## Available Content Management Sections

### 1. Events Management (`/admin/events`)

**What you can do:**
- Create new events (prayer sessions, services, devotionals, etc.)
- Edit existing events
- Delete events
- Upload event images
- Mark events as featured
- Set event details (date, time, location, max attendees)

**Fields:**
- Title
- Description
- Category (prayer, service, devotional, empowerment, social, wisdom)
- Date & Time
- Location
- Max Attendees
- Featured (boolean)
- Event Image

**API Endpoints:**
- `GET /api/events/` - List all events
- `POST /api/events/` - Create event (admin only)
- `PUT /api/events/{id}` - Update event (admin only)
- `DELETE /api/events/{id}` - Delete event (admin only)
- `POST /api/events/upload-image` - Upload event image (admin only)

### 2. Podcasts Management (`/admin/podcasts`)

**What you can do:**
- Create new podcast episodes
- Edit podcast details
- Delete podcasts
- Upload cover images
- Set podcast type (episode, live, series)
- Manage categories and tags

**Fields:**
- Title
- Host
- Type (episode, live, series)
- Category
- Description
- Duration
- Cover Image
- Audio URL
- Transcript
- Tags
- Is Live (boolean)
- Is Free (boolean)

**API Endpoints:**
- `GET /api/podcasts/` - List all podcasts
- `POST /api/podcasts/` - Create podcast (admin only)
- `PUT /api/podcasts/{id}` - Update podcast (admin only)
- `DELETE /api/podcasts/{id}` - Delete podcast (admin only)
- `POST /api/podcasts/upload-cover` - Upload cover image (admin only)

### 3. Genius Academy Courses (`/admin/courses`)

**What you can do:**
- Create new courses
- Edit course details
- Delete courses
- Upload course cover images
- Set pricing and enrollment details
- Manage curriculum and features

**Fields:**
- Title
- Instructor
- Category
- Level (beginner, intermediate, advanced)
- Description
- Duration
- Sessions
- Mentorship Hours
- Price
- Original Price
- Start Date
- Tags
- Bonus (e.g., "2 FREE BOOKS!")
- Curriculum (text)
- Features (text)
- WhatsApp Number
- Cover Image

**API Endpoints:**
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course (admin only)
- `PUT /api/courses/{id}` - Update course (admin only)
- `DELETE /api/courses/{id}` - Delete course (admin only)
- `POST /api/courses/upload-cover` - Upload cover image (admin only)

### 4. Devotionals Management (`/admin/devotionals`)

**What you can do:**
- Create daily devotionals
- Edit devotional content
- Delete devotionals
- Mark devotionals as featured
- Set scripture references

**Fields:**
- Title
- Scripture (e.g., "John 3:16")
- Verse (full verse text)
- Author
- Content (full devotional text)
- Read Time (e.g., "5 min read")
- Date
- Featured (boolean)

**API Endpoints:**
- `GET /api/devotionals/` - List all devotionals
- `GET /api/devotionals/latest` - Get latest devotional
- `POST /api/devotionals/` - Create devotional (admin only)
- `PUT /api/devotionals/{id}` - Update devotional (admin only)
- `DELETE /api/devotionals/{id}` - Delete devotional (admin only)

### 5. Announcements Management (`/admin/announcements`)

**What you can do:**
- Create announcements
- Edit announcements
- Delete announcements
- Set priority (high, medium, low)
- Set expiration dates
- Activate/deactivate announcements

**Fields:**
- Title
- Content
- Priority (high, medium, low)
- Expires At (optional)
- Is Active (boolean)

**API Endpoints:**
- `GET /api/announcements/` - List all announcements
- `GET /api/announcements/active` - Get active announcements
- `POST /api/announcements/` - Create announcement (admin only)
- `PUT /api/announcements/{id}` - Update announcement (admin only)
- `DELETE /api/announcements/{id}` - Delete announcement (admin only)

### 6. Library Management (`/admin/library`)

**What you can do:**
- Create library items (books, blogs, quotes)
- Edit library items
- Delete library items
- Upload cover images
- Set pricing and access codes

**Fields:**
- Title
- Author
- Type (book, blog, quotes)
- Category
- Description
- Cover Image
- Is Free (boolean)
- Price
- Access Code
- Preview Content
- Full Content
- Tags

**API Endpoints:**
- `GET /api/library/` - List all library items
- `POST /api/library/` - Create library item (admin only)
- `PUT /api/library/{id}` - Update library item (admin only)
- `DELETE /api/library/{id}` - Delete library item (admin only)
- `POST /api/library/upload-cover` - Upload cover image (admin only)

### 7. Members Management (`/members`)

**What you can do:**
- View all members
- Add new members
- Edit member details
- Delete members
- Export to Excel
- Search and filter members

**Note:** This is already fully implemented in the Members page.

## How to Use the Admin Dashboard

### Step-by-Step: Creating New Content

1. **Navigate to Admin Dashboard**
   - Click "Admin" in the sidebar
   - You'll see an overview with statistics

2. **Choose Content Type**
   - Click on the card for the content type you want to manage
   - Or use the "Quick Actions" section

3. **Create New Item**
   - Click the "Add [Content Type]" button
   - Fill in the form fields
   - Upload images if needed
   - Click "Create" or "Save"

4. **Edit Existing Item**
   - Find the item in the list
   - Click "Edit"
   - Make your changes
   - Click "Update" or "Save"

5. **Delete Item**
   - Find the item in the list
   - Click "Delete"
   - Confirm the deletion

## File Uploads

All content types that support images use the following upload directories:
- Events: `uploads/events/`
- Podcasts: `uploads/podcasts/`
- Courses: `uploads/courses/`
- Library: `uploads/` (root)

**Supported Image Formats:**
- JPG, JPEG, PNG, GIF

**File Naming:**
- Files are automatically renamed with timestamps to prevent conflicts
- Format: `{type}_{timestamp}.{extension}`

## Authentication & Security

- All admin endpoints require authentication
- Admin status is checked via `is_admin` field in user model
- Frontend uses `requireAdmin={true}` in ProtectedRoute
- Backend uses `get_current_admin_user` dependency

## Database Models

All content types have corresponding database models:
- `Event` - Events table
- `Podcast` - Podcasts table
- `GeniusAcademyCourse` - Courses table
- `Devotional` - Devotionals table
- `Announcement` - Announcements table
- `LibraryItem` - Library items table

## API Base URL

Default: `http://localhost:8000`

Can be configured via environment variable:
- Frontend: `REACT_APP_API_URL`
- Backend: Configured in `backend/main.py`

## Troubleshooting

### Can't Access Admin Dashboard
- Ensure you're logged in with an admin account
- Check that `is_admin` is `true` in your user record
- Verify Firebase authentication is working

### Images Not Uploading
- Check backend server is running
- Verify upload directories exist
- Check file size limits
- Ensure proper file format (JPG, PNG, etc.)

### API Errors
- Verify backend server is running on port 8000
- Check CORS settings in `backend/main.py`
- Ensure authentication token is valid
- Check browser console for detailed error messages

## Future Enhancements

Planned features:
- Bulk import/export
- Content scheduling
- Draft/publish workflow
- Content versioning
- Analytics dashboard
- Media library management

## Support

For issues or questions:
1. Check backend logs: `backend/main.py` console output
2. Check frontend console: Browser developer tools
3. Verify database: Check SQLite database file
4. Review API documentation: `http://localhost:8000/docs`

---

**Last Updated:** January 2025
