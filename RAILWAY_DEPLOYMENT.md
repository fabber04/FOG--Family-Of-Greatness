# Railway Deployment Guide for FOG Backend

This guide will help you deploy your FastAPI backend to Railway so clients can see changes in real-time.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app) (free tier available)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Know what environment variables your backend needs

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account if prompted
5. Select your repository: `FOG--Family-Of-Greatness`

### 2. Configure the Service

1. Railway will detect it's a Python project
2. Click on the service that was created
3. Go to **Settings** tab
4. Set **Root Directory** to: `backend`
5. Railway will automatically detect the `Procfile` and `requirements.txt`

### 3. Set Environment Variables

Go to the **Variables** tab and add these environment variables:

#### Required Variables:

```env
# Secret key for JWT tokens (generate a random string)
SECRET_KEY=your-super-secret-key-here-generate-random-string

# CORS origins (add your Railway URL after deployment)
CORS_ORIGINS=https://fabber04.github.io,http://localhost:3000

# Storage mode (local for Railway, or firebase if using Firebase Storage)
STORAGE_MODE=local

# Environment
ENVIRONMENT=production
```

#### Optional Variables (if using Firebase):

```env
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS=./firebase-service-account.json
```

#### Generate Secret Key:

Run this command locally to generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Deploy

1. Railway will automatically start deploying when you connect the repo
2. Watch the **Deployments** tab for build logs
3. Wait for deployment to complete (usually 2-3 minutes)

### 5. Get Your Backend URL

1. Once deployed, go to the **Settings** tab
2. Under **Domains**, Railway will provide a URL like: `https://your-app-name.up.railway.app`
3. Copy this URL - you'll need it for the frontend

### 6. Update CORS

1. Go back to **Variables** tab
2. Update `CORS_ORIGINS` to include your Railway URL:
   ```
   CORS_ORIGINS=https://fabber04.github.io,http://localhost:3000,https://your-app-name.up.railway.app
   ```
3. Railway will automatically redeploy when you save

### 7. Test Your Backend

Test your backend health endpoint:
```bash
curl https://your-app-name.up.railway.app/api/health
```

Should return:
```json
{"status":"healthy","message":"FOG API is running"}
```

### 8. Update Frontend

1. Create `.env.production` file in your project root:
   ```env
   REACT_APP_API_URL=https://your-app-name.up.railway.app
   ```

2. Rebuild and redeploy frontend:
   ```bash
   npm run build
   npm run deploy
   ```

## Database Considerations

**Important**: Railway's file system is ephemeral. Your SQLite database will be reset on each deployment.

### Option 1: Use Railway PostgreSQL (Recommended)

1. In Railway, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically set `DATABASE_URL` environment variable
3. Update your `database.py` to use PostgreSQL:
   ```python
   DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fog_platform.db")
   ```

### Option 2: Use External Database

Use a managed database service like:
- [Supabase](https://supabase.com) (free tier)
- [Neon](https://neon.tech) (free tier)
- [PlanetScale](https://planetscale.com) (free tier)

## File Storage Considerations

Railway's file system is ephemeral. Files uploaded will be lost on redeployment.

### Option 1: Use Railway Volume (Recommended for small files)

1. In Railway, go to your service
2. Click **"New"** → **"Volume"**
3. Mount it to `/app/storage` or `/app/uploads`
4. Files will persist across deployments

### Option 2: Use Firebase Storage (Recommended for production)

1. Set `STORAGE_MODE=firebase` in environment variables
2. Configure Firebase Storage credentials
3. Files will be stored in Firebase (persistent and scalable)

## Monitoring and Logs

1. **View Logs**: Click on your service → **Deployments** → Click on a deployment → View logs
2. **Real-time Logs**: Use Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   railway logs
   ```

## Automatic Deployments

Railway automatically deploys when you push to your connected branch (usually `main`).

To deploy from a different branch:
1. Go to **Settings** → **Source**
2. Change the branch

## Troubleshooting

### Build Fails

1. Check build logs in Railway dashboard
2. Ensure `requirements.txt` is in the `backend/` directory
3. Verify Python version compatibility

### CORS Errors

1. Make sure your Railway URL is in `CORS_ORIGINS`
2. Check that `allow_credentials=True` is set
3. Verify frontend is using the correct API URL

### Database Errors

1. If using SQLite, remember it resets on each deployment
2. Consider migrating to PostgreSQL
3. Check database file permissions

### File Upload Errors

1. If using local storage, ensure volume is mounted
2. Check file permissions
3. Consider switching to Firebase Storage

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Get Railway URL
3. ✅ Update frontend `.env.production`
4. ✅ Rebuild and redeploy frontend
5. ✅ Test the full stack
6. ✅ Set up database persistence (PostgreSQL or external)
7. ✅ Set up file storage persistence (Volume or Firebase)

## Quick Commands

```bash
# Test backend locally with Railway-like environment
PORT=8000 ENVIRONMENT=production uvicorn main:app --host 0.0.0.0 --port 8000

# Generate secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Check Railway logs (if CLI installed)
railway logs
```

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check deployment logs in Railway dashboard

