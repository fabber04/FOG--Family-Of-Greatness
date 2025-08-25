# FOG Backend

A FastAPI-based backend for the FOG (Family of Greatness) Platform, providing authentication, user management, library management, and prayer request functionality.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: User registration, login, profile management, and admin controls
- **Library Management**: CRUD operations for books, blogs, and quotes with file upload support
- **Prayer Requests**: Private prayer request system with admin oversight
- **Database**: SQLite database with SQLAlchemy ORM
- **File Uploads**: Support for cover images and documents
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Handling**: FastAPI file uploads with validation
- **Validation**: Pydantic schemas
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Database Setup

1. **Initialize the database**:
   ```bash
   python init_db.py
   ```

   This will:
   - Create all necessary database tables
   - Create an admin user (username: `admin`, password: `admin123`)
   - Create a regular user (username: `user`, password: `user123`)
   - Add sample library items

## Running the Backend

1. **Start the FastAPI server**:
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access the API**:
   - API Base URL: `http://localhost:8000`
   - Interactive API Docs: `http://localhost:8000/docs`
   - Alternative API Docs: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/login-form` - OAuth2 form login

### Users
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update current user
- `GET /api/users/` - Get all users (admin only)
- `GET /api/users/{user_id}` - Get specific user (admin only)
- `PUT /api/users/{user_id}` - Update user (admin only)
- `DELETE /api/users/{user_id}` - Delete user (admin only)

### Library
- `GET /api/library/` - Get library items with filtering
- `GET /api/library/{item_id}` - Get specific item
- `POST /api/library/` - Create new item (admin only)
- `PUT /api/library/{item_id}` - Update item (admin only)
- `DELETE /api/library/{item_id}` - Delete item (admin only)
- `POST /api/library/upload-cover` - Upload cover image (admin only)
- `GET /api/library/categories` - Get available categories
- `GET /api/library/types` - Get available types

### Prayer Requests
- `POST /api/prayer/` - Create prayer request
- `GET /api/prayer/` - Get prayer requests (filtered by role)
- `GET /api/prayer/{prayer_id}` - Get specific prayer request
- `PUT /api/prayer/{prayer_id}` - Update prayer request
- `DELETE /api/prayer/{prayer_id}` - Delete prayer request
- `POST /api/prayer/{prayer_id}/status` - Update status (admin only)

## Default Users

After running `init_db.py`, you'll have these default accounts:

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@fog.com`
- **Role**: Administrator (full access)

### Regular User
- **Username**: `user`
- **Password**: `user123`
- **Email**: `user@fog.com`
- **Role**: Regular user (limited access)

## File Uploads

The backend supports file uploads for library item covers:
- **Supported formats**: JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, TXT
- **Upload directory**: `uploads/` (created automatically)
- **File naming**: `cover_{timestamp}{extension}`

## Environment Variables

Create a `.env` file in the backend directory for production settings:

```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./fog_platform.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Development

### Project Structure
```
backend/
├── main.py              # FastAPI application entry point
├── database.py          # Database configuration and session management
├── models.py            # SQLAlchemy database models
├── schemas.py           # Pydantic schemas for request/response validation
├── utils/
│   └── auth.py         # Authentication utilities
├── routes/
│   ├── auth.py         # Authentication routes
│   ├── users.py        # User management routes
│   ├── library.py      # Library management routes
│   └── prayer.py       # Prayer request routes
├── requirements.txt     # Python dependencies
├── init_db.py          # Database initialization script
└── README.md           # This file
```

### Adding New Features

1. **Create models** in `models.py`
2. **Define schemas** in `schemas.py`
3. **Implement routes** in the appropriate route file
4. **Update main.py** to include new routers
5. **Test endpoints** using the interactive API docs

## Security Notes

- **Change the SECRET_KEY** in production
- **Use HTTPS** in production
- **Implement rate limiting** for production use
- **Add input validation** for all user inputs
- **Consider using environment variables** for sensitive configuration

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure you're in the backend directory and virtual environment is activated
2. **Database errors**: Run `python init_db.py` to initialize the database
3. **Port conflicts**: Change the port in `main.py` or use a different port with uvicorn
4. **CORS issues**: Check that your frontend URL is in the CORS origins list

### Logs

The FastAPI server provides detailed logs. Check the console output for:
- Request/response information
- Database connection status
- Error details

## Production Deployment

For production deployment, consider:

1. **Database**: Use PostgreSQL or MySQL instead of SQLite
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
3. **Authentication**: Implement refresh tokens and proper session management
4. **Security**: Add rate limiting, input sanitization, and security headers
5. **Monitoring**: Add logging, metrics, and health checks
6. **Deployment**: Use Docker, Kubernetes, or cloud platforms

## Support

For issues or questions:
1. Check the FastAPI documentation: https://fastapi.tiangolo.com/
2. Review the API documentation at `/docs` when the server is running
3. Check the console logs for error details
