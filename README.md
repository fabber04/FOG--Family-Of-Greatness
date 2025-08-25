# FOG - Family of Greatness Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive digital platform designed to support families and communities with tools for prayer, learning, community building, events, and spiritual growth.

## Core Features

### Prayer Request System
- Private prayer requests visible only to admins
- Secure and confidential prayer support
- Admin dashboard for prayer management
- Prayer tracking and follow-up system

### Member Registration & Management
- Member sign-up with comprehensive profiles
- Admin receives member data in Excel format
- Role-based access control (Admin, Member)
- Member directory and search functionality

### Digital Library & Learning
- Free books and resources
- Youth-focused blog platform
- Daily inspirational quotes with pop-up functionality
- Payment integration for premium content
- Content categorization and search

### Podcast & Media System
- Podcast recordings with filtering options
- Live podcast streaming capabilities
- Community comments and discussions
- Media library management
- Audio content organization

### FOG Programs
- Camp interface and management
- Program registration and tracking
- Event scheduling and coordination
- Resource allocation and planning

### Event Management System
- **Daily**: Morning Prayer Sessions (4:00 AM)
- **Weekly**: Sunday Service
- **Thursday**: Relationship Devotional
- **Monthly**: Empowerment Nights
- **Quarterly**: Social Dinner Events
- **Ongoing**: Wisdom Classes

### Genius Academy System
- Academy enrollment and registration
- WhatsApp integration for communication
- Course management and progress tracking
- Student portal and resources

### Counseling Services
- Booking system for counseling sessions
- Counselor profiles and specialties
- Session scheduling and management
- Confidential client portal

### Mentorship Program
- GIS Academy integration
- Wisdom Class components
- Counseling mentorship
- Mentor-mentee matching system
- Progress tracking and support

### Relationship Devotional
- Daily relationship-focused devotionals
- Couples and family resources
- Relationship building tools
- Spiritual guidance for relationships

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fabber04/FOG--Family-Of-Greatness.git
   cd FOG--Family-Of-Greatness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Configure your Firebase credentials in the `.env` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
FOG--Family-Of-Greatness/
├── public/                 # Static assets
│   ├── images/            # Images and media files
│   └── index.html         # Main HTML template
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   │   ├── PrayerRequest.js  # Prayer request system
│   │   ├── MemberRegistration.js # Member sign-up
│   │   ├── Library.js     # Digital library
│   │   ├── Podcasts.js    # Podcast management
│   │   ├── Events.js      # Event management
│   │   ├── GeniusAcademy.js # Genius Academy
│   │   ├── Counseling.js  # Counseling services
│   │   ├── Mentorship.js  # Mentorship program
│   │   └── Devotional.js  # Relationship devotionals
│   ├── pages/             # Main application pages
│   │   ├── Dashboard.js   # Homepage
│   │   ├── Admin.js       # Admin dashboard
│   │   ├── Members.js     # Member management
│   │   ├── Library.js     # Digital library
│   │   ├── Podcasts.js    # Podcast system
│   │   ├── Events.js      # Event management
│   │   ├── GeniusAcademy.js # Genius Academy
│   │   ├── Counseling.js  # Counseling services
│   │   ├── Mentorship.js  # Mentorship program
│   │   └── Devotional.js  # Relationship devotionals
│   ├── services/          # Business logic and API calls
│   │   ├── firebaseService.js    # Firebase operations
│   │   ├── prayerService.js      # Prayer request logic
│   │   ├── memberService.js      # Member management
│   │   └── eventService.js       # Event management
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── firebase.js        # Firebase configuration
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
└── package.json           # Dependencies and scripts
```

## Available Scripts

- **`npm start`** - Start development server
- **`npm run dev`** - Start development server (alias)
- **`npm run build`** - Build for production
- **`npm test`** - Run test suite
- **`npm run eject`** - Eject from Create React App

##  Technology Stack

- **Frontend**: React.js with modern hooks
- **Styling**: Tailwind CSS with Blue/Orange theme
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context and hooks
- **Routing**: React Router for navigation
- **UI Components**: Custom components with Tailwind CSS

##  Firebase Services

- **Firestore**: Real-time database for user data, events, and content
- **Authentication**: User login and registration with role-based access
- **Storage**: File uploads for images, documents, and media
- **Hosting**: Web application deployment
- **Security Rules**: Data access control and validation

##  Design System

### Color Palette
- **Primary (Blue)**: `#3b82f6` - Main brand color
- **Secondary (Orange)**: `#f97316` - Accent and call-to-action color
- **Faith (Blue)**: `#2563eb` - Spiritual elements
- **Energy (Orange)**: `#ea580c` - Dynamic elements

### Typography
- **Sans**: Inter - Modern, clean interface
- **Serif**: Merriweather - Spiritual content

##  Deployment

### Firebase Hosting
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Environment Configuration
Ensure all environment variables are properly set in your production environment.

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is proprietary and confidential. All rights reserved.

##  Acknowledgments

- Faith organization leaders and volunteers
- React.js and Firebase communities
- Open source contributors
- Spiritual guidance and inspiration

##  Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQs

---

**Built with for Faith Organizations**

*Empowering faith communities through technology and spiritual growth* 