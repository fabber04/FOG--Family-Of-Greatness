# Deployment Guide for FOG Platform

## Current Issue

The uploaded content (podcasts, files) is not showing on GitHub Pages because:

1. **GitHub Pages only serves static files** - It cannot run your Python FastAPI backend
2. **Backend API is not accessible** - The frontend tries to connect to `http://localhost:8000` which doesn't exist on GitHub Pages
3. **Uploaded files are not in repository** - Files in `storage/` directory are gitignored and not committed

## Solution Options

### Option 1: Deploy Backend to Cloud Service (Recommended)

Deploy your FastAPI backend to a cloud service that supports Python:

#### A. Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add a new service → Deploy from GitHub repo
5. Select the `backend/` directory
6. Set environment variables:
   - `SECRET_KEY` (generate a random string)
   - `CORS_ORIGINS` (add `https://fabber04.github.io`)
   - `STORAGE_MODE=local` (or `firebase` if using Firebase Storage)
7. Railway will automatically detect Python and install dependencies
8. Get your backend URL (e.g., `https://your-app.railway.app`)

#### B. Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. Add environment variables (same as Railway)
6. Get your backend URL

#### C. Heroku
1. Install Heroku CLI
2. Create `Procfile` in `backend/`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Create `runtime.txt` in `backend/`:
   ```
   python-3.11.0
   ```
4. Deploy:
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set CORS_ORIGINS=https://fabber04.github.io
   git push heroku main
   ```

### Option 2: Update Frontend Configuration

After deploying the backend, update your frontend to use the production API URL:

1. **Create `.env.production` file** in the root directory:
   ```env
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

2. **Or set it in GitHub Pages** (if using GitHub Actions):
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add `REACT_APP_API_URL` as a secret

3. **Rebuild and redeploy**:
   ```bash
   npm run build
   npm run deploy
   ```

### Option 3: Handle File Storage

You have two options for uploaded files:

#### A. Use Firebase Storage (Recommended for production)
1. Set `STORAGE_MODE=firebase` in backend environment
2. Configure Firebase Storage in your backend
3. Files will be stored in Firebase Storage and accessible via URLs

#### B. Commit files to repository (Not recommended for large files)
1. Remove `storage/files/**/*` from `.gitignore`
2. Commit the uploaded files
3. Files will be served from GitHub Pages (but this increases repo size)

## Step-by-Step Deployment

### 1. Deploy Backend

Choose one of the cloud services above and deploy your backend. Note the URL.

### 2. Update Frontend Environment

Create `.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Update CORS in Backend

Make sure your backend `main.py` includes GitHub Pages in CORS origins:
```python
allow_origins=[
    "http://localhost:3000",
    "https://fabber04.github.io"
]
```

### 4. Build and Deploy Frontend

```bash
npm run build
npm run deploy
```

### 5. Verify

1. Visit https://fabber04.github.io/FOG--Family-Of-Greatness/
2. Open browser console (F12)
3. Check Network tab - API calls should go to your deployed backend
4. Check for CORS errors

## Quick Fix for Testing

If you want to test locally with production build:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve the build folder:
   ```bash
   npx serve -s build
   ```

3. The frontend will still try to connect to `http://localhost:8000` unless you set `REACT_APP_API_URL`

## Troubleshooting

### CORS Errors
- Make sure your backend CORS includes `https://fabber04.github.io`
- Check that `allow_credentials=True` is set

### API Connection Failed
- Verify your backend URL is correct
- Check that backend is running and accessible
- Test backend directly: `curl https://your-backend-url.railway.app/api/health`

### Files Not Loading
- If using local storage, files need to be on the backend server
- Consider switching to Firebase Storage for better file management
- Check file URLs in database - they should point to your backend or Firebase Storage

## Next Steps

1. Deploy backend to Railway/Render/Heroku
2. Update `.env.production` with backend URL
3. Rebuild and redeploy frontend
4. Test the deployed site
5. Consider migrating to Firebase Storage for better file management

