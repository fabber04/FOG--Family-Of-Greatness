# Quick Fix: Make Uploaded Content Work on GitHub Pages

## The Problem

Your uploaded podcasts and files are stored locally in `storage/` directory, but:
- GitHub Pages only serves static files (no backend server)
- The frontend tries to connect to `http://localhost:8000` which doesn't exist on GitHub Pages
- Uploaded files are gitignored, so they're not in the repository

## Immediate Solution: Deploy Backend

You need to deploy your FastAPI backend to a cloud service. Here are the easiest options:

### Option 1: Railway (Recommended - Easiest)

1. **Sign up at [railway.app](https://railway.app)** (free tier available)

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add a new service**:
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Railway will auto-detect it's Python

4. **Configure the service**:
   - **Root Directory**: Set to `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Railway will auto-install dependencies from `requirements.txt`

5. **Set Environment Variables**:
   - Click on your service → Variables tab
   - Add these:
     ```
     SECRET_KEY=your-random-secret-key-here
     CORS_ORIGINS=https://fabber04.github.io,http://localhost:3000
     STORAGE_MODE=local
     ```
   - Generate a secret key: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

6. **Get your backend URL**:
   - Railway will give you a URL like: `https://your-app.railway.app`
   - Copy this URL

7. **Update frontend**:
   - Create `.env.production` file in root:
     ```env
     REACT_APP_API_URL=https://your-app.railway.app
     ```

8. **Rebuild and redeploy**:
   ```bash
   npm run build
   npm run deploy
   ```

### Option 2: Render (Alternative)

1. Go to [render.com](https://render.com) and sign up
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `fog-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Deploy and get your URL

## After Deployment

1. **Test your backend**:
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"healthy","message":"FOG API is running"}`

2. **Upload files to backend**:
   - Your uploaded files are currently on your local machine
   - You need to either:
     - **Option A**: Re-upload them through the admin panel (after backend is deployed)
     - **Option B**: Copy `storage/` folder to your deployed backend (if using Railway, you can use their volume feature)

3. **Update frontend and redeploy**:
   ```bash
   # Create .env.production with your backend URL
   echo "REACT_APP_API_URL=https://your-backend-url.railway.app" > .env.production
   
   # Build and deploy
   npm run build
   npm run deploy
   ```

## File Storage Options

### Current: Local Storage (Works but requires file management)
- Files stored on backend server
- Need to ensure files persist on cloud service
- Railway/Render may require volumes for persistent storage

### Better: Firebase Storage (Recommended)
1. Set `STORAGE_MODE=firebase` in backend environment
2. Configure Firebase Storage credentials
3. Files stored in Firebase (accessible from anywhere)
4. No need to manage file persistence on backend server

## Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Backend health check works: `curl https://your-backend-url/api/health`
- [ ] CORS configured to allow `https://fabber04.github.io`
- [ ] `.env.production` created with `REACT_APP_API_URL`
- [ ] Frontend rebuilt with `npm run build`
- [ ] Frontend redeployed with `npm run deploy`
- [ ] Test on GitHub Pages - check browser console for errors
- [ ] Uploaded files accessible (either re-uploaded or copied to backend)

## Troubleshooting

### "Failed to fetch" errors
- Check that backend URL is correct in `.env.production`
- Verify backend is running and accessible
- Check CORS settings in backend

### CORS errors
- Make sure `https://fabber04.github.io` is in backend CORS origins
- Check `allow_credentials=True` is set

### Files not loading
- Verify files exist on backend server
- Check file URLs in database point to correct backend URL
- Consider switching to Firebase Storage for better file management

## Next Steps After Fix

1. **Migrate to Firebase Storage** (better for production):
   - Set `STORAGE_MODE=firebase` in backend
   - Configure Firebase Storage
   - Re-upload files (they'll be stored in Firebase)

2. **Set up automated deployments**:
   - Backend: Railway/Render auto-deploys on git push
   - Frontend: GitHub Pages auto-deploys on git push

3. **Monitor and maintain**:
   - Check backend logs regularly
   - Monitor API usage
   - Set up error tracking

