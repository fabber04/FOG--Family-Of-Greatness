# FOG - Family of Greatness Platform
## Project Documentation

**Version:** 1.0.0  
**Deployment:** https://fabber04.github.io/FOG--Family-Of-Greatness

---

## Technology Stack

**Frontend:** React.js 18.2, React Router, Tailwind CSS  
**Backend:** FastAPI (Python), SQLite, SQLAlchemy  
**Authentication:** Firebase Authentication + Backend API sync  
**Deployment:** GitHub Pages (frontend), Local server (backend)

---

## Completed Features

### Authentication & User Management
- Firebase Authentication integration
- User registration and login
- Role-based access (Admin, Member)
- User profile with picture upload
- Protected routes

### Dashboard
- Welcome section with mentor image
- Vision and Mission statements
- Quick access navigation
- Services & Events overview
- Latest devotional and announcements

### Members Management
- Member directory with search and filters
- Add, edit, delete members (Admin only)
- Export to Excel
- Backend API integration

### Genius Academy
- Three courses with detailed information
- Course images and descriptions
- WhatsApp enrollment integration
- Pricing: $30, $60, $15 with free book bonuses

### Podcasts
- Podcast library with categories
- All podcasts free (no payments)
- Local images from `/images/podcasts/`
- Search and filter functionality

### Events
- Event calendar and listings
- Updated schedules:
  - Prayer Sessions: Mon/Wed/Fri at 0400hrs
  - Weekly Service: Every Wednesday (Online)
  - Relationship Service: Thursday 2000Hrs CAT (YouTube)
  - Empowerment Nights: Twice yearly
  - Social Dinner: Once yearly
  - Wisdom Class: Monthly

### Counseling
- Counseling service information
- Mentor profile section
- Updated messages and mentor title

### Additional Pages
- Library (structure complete)
- Prayer Requests (backend complete)
- Devotionals (structure complete)
- Profile (complete)
- Camp, Merch, Attendance (basic structure)

---

## Backend API

**Base URL:** http://localhost:8000

**Endpoints:**
- `POST /api/auth/sync-firebase-user` - Sync Firebase user
- `GET /api/users/` - Get all members
- `POST /api/users/` - Create member
- `PUT /api/users/{id}` - Update member
- `DELETE /api/users/{id}` - Delete member
- `GET /api/library/` - Library resources
- `GET /api/prayer/` - Prayer requests (Admin)
- `POST /api/prayer/` - Create prayer request

---

## Project Structure

```
src/
├── components/     # Layout, Login, Register, ProtectedRoute
├── contexts/       # AuthContext, LibraryContext
├── pages/          # All page components
├── services/       # API service, Firebase service
└── firebase.js     # Firebase configuration

backend/
├── routes/         # API route handlers
├── utils/          # Auth utilities
├── models.py       # Database models
└── main.py         # FastAPI app
```

---

## Pending Tasks

### High Priority
1. Library content management and upload functionality
2. Prayer requests frontend completion
3. Devotionals content and features
4. Camp page photo gallery and registration
5. Merch page completion

### Medium Priority
6. Attendance system with QR code scanning
7. Backend production deployment
8. Email notifications
9. File upload to Firebase Storage
10. Global search functionality

### Low Priority
11. Analytics integration
12. Mobile app development
13. Social features (comments, forum)
14. Payment integration (if needed)
15. Admin dashboard enhancements

---

## Known Issues

1. Profile pictures stored in localStorage (should use cloud storage)
2. Backend API URL configured for localhost (needs production URL)
3. Image paths use URL encoding (consider renaming files)
4. Demo mode when Firebase unavailable (needs better handling)
5. GitHub Pages uses HashRouter (URLs include #)

---

## Environment Setup

**Required Files:**
- `.env` (copy from `env.example`)
- Firebase credentials in `.env`
- Backend `.env` with Firebase Admin SDK credentials

**Start Commands:**
- Frontend: `npm start`
- Backend: `python main.py` or `./start.sh`
- Deploy: `npm run deploy`

---

## Recent Updates

- Vision and Mission statements updated
- Event descriptions and schedules updated
- Locations removed from events
- Podcast images replaced with local images
- Payment system removed from podcasts
- Genius Academy courses updated with real content
- Counseling messages and mentor title updated
- Dashboard hero section updated with mentor image

---

**Last Updated:** January 2025
