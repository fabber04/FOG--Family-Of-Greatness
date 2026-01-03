# Railway Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free tier available)

### Step 2: Create Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `FOG--Family-Of-Greatness`

### Step 3: Configure Service
1. Railway auto-detects Python
2. Go to **Settings** → Set **Root Directory** to: `backend`
3. Railway will use the `Procfile` automatically

### Step 4: Add Environment Variables
Go to **Variables** tab and add:

```env
SECRET_KEY=<generate-random-string>
CORS_ORIGINS=https://fabber04.github.io,http://localhost:3000
STORAGE_MODE=local
ENVIRONMENT=production
```

**Generate Secret Key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Deploy
1. Railway auto-deploys when you connect the repo
2. Wait 2-3 minutes for deployment
3. Get your URL from **Settings** → **Domains**

### Step 6: Update Frontend
Create `.env.production`:
```env
REACT_APP_API_URL=https://your-app-name.up.railway.app
```

Then rebuild:
```bash
npm run build
npm run deploy
```

## ✅ Done!

Your backend is now live and clients can see changes in real-time!

## 📝 Important Notes

- **Database**: Railway's file system is ephemeral. SQLite will reset on redeploy.
  - **Solution**: Add Railway PostgreSQL database (free tier available)
  
- **File Storage**: Uploaded files will be lost on redeploy.
  - **Solution**: Use Railway Volume or Firebase Storage

## 🔧 Add PostgreSQL (Recommended)

1. In Railway, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically sets `DATABASE_URL`
3. Your backend will automatically use PostgreSQL!

## 📚 Full Guide

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

