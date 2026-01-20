# Fix Render Deployment Failure

## Issue
Deployment failed for commit `9f8bc56: Fix audio playback: improve MIME type detection, use FileResponse for local files, add better error handling and category debugging`

## Common Causes & Solutions

### 1. Check Render Dashboard Logs

**First, check the deployment logs:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service (`fog-backend`)
3. Click **"Logs"** tab
4. Scroll to the failed deployment
5. Look for error messages

**Common errors you might see:**
- `ModuleNotFoundError` - Missing dependency
- `ImportError` - Import issue
- `Database connection failed` - DATABASE_URL issue
- `Port already in use` - Port conflict
- `Build failed` - Build command issue

---

### 2. Verify Root Directory

**Make sure Root Directory is set to `backend`:**
1. Render Dashboard → Your service → **"Settings"** tab
2. Scroll to **"Build & Deploy"**
3. Check **"Root Directory"** - should be: `backend`
4. If it's empty or wrong, set it to: `backend`
5. Click **"Save Changes"**
6. Trigger a new deployment

---

### 3. Check Build Command

**Verify Build Command:**
1. Render Dashboard → Your service → **"Settings"** → **"Build & Deploy"**
2. **Build Command** should be: `pip install -r requirements.txt`
3. **Start Command** should be: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

### 4. Verify Environment Variables

**Check all required environment variables are set:**
1. Render Dashboard → Your service → **"Environment"** tab
2. Verify these are set:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SECRET_KEY` - JWT secret key
   - `CORS_ORIGINS` - Allowed origins (comma-separated)
   - `ENVIRONMENT` - Should be `production`
   - `STORAGE_MODE` - Should be `local`

**If any are missing, add them:**
- Click **"Add Environment Variable"**
- Enter key and value
- Click **"Save Changes"**
- Render will auto-redeploy

---

### 5. Check Python Version

**Verify Python version:**
1. Render Dashboard → Your service → **"Settings"** → **"Build & Deploy"**
2. Check **"Python Version"** - should be `3.11` or `3.12`
3. If wrong, change it and save

---

### 6. Test Locally First

**Before deploying, test locally:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**If it fails locally, fix the issue before deploying.**

---

### 7. Common Fixes

#### Fix 1: Missing Dependencies
If you see `ModuleNotFoundError`, add missing package to `requirements.txt`:
```bash
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements.txt"
git push origin main
```

#### Fix 2: Import Errors
If you see `ImportError`, check:
- All imports are correct
- All files exist
- No circular imports

#### Fix 3: Database Connection
If you see database errors:
- Verify `DATABASE_URL` is correct (Internal Database URL)
- Check database is running in Render Dashboard
- Test connection: `psql $DATABASE_URL`

#### Fix 4: Port Issues
If you see port errors:
- Make sure Start Command uses `$PORT` (not hardcoded)
- Render sets `$PORT` automatically

---

### 8. Manual Redeploy

**If auto-deploy failed, trigger manual deploy:**
1. Render Dashboard → Your service
2. Click **"Manual Deploy"** button
3. Select **"Deploy latest commit"**
4. Click **"Deploy"**
5. Watch the logs for errors

---

### 9. Check Git Push

**Make sure changes are pushed:**
```bash
git status
git log --oneline -5
git push origin main
```

**Verify on GitHub:**
- Go to your GitHub repo
- Check if commit `9f8bc56` exists
- Check if all files are there

---

### 10. Rollback if Needed

**If deployment keeps failing, rollback:**
1. Render Dashboard → Your service → **"Events"** tab
2. Find the last successful deployment
3. Click **"..."** → **"Redeploy"**
4. This will redeploy the working version

---

## Quick Checklist

- [ ] Checked Render logs for specific error
- [ ] Verified Root Directory is `backend`
- [ ] Verified Build Command: `pip install -r requirements.txt`
- [ ] Verified Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Verified all environment variables are set
- [ ] Tested locally - works without errors
- [ ] Verified Python version in Render
- [ ] Verified changes are pushed to GitHub
- [ ] Tried manual redeploy

---

## Get Specific Error Message

**To get the exact error:**
1. Render Dashboard → Your service → **"Logs"** tab
2. Scroll to the failed deployment
3. Copy the error message
4. Share it for more specific help

---

## After Fixing

Once deployment succeeds:
1. Test backend health: `curl https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"healthy","message":"FOG API is running"}`
3. Then deploy frontend with updated API URL

