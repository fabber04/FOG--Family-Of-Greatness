# Live Deployment Workflow

## Current Setup ✅

- **Frontend**: GitHub Pages at `https://fabber04.github.io/FOG--Family-Of-Greatness`
- **Backend**: Railway at `https://fog-family-of-greatness-production.up.railway.app`
- **Database**: PostgreSQL on Railway

## Quick Deploy Commands

### Deploy Frontend Changes

```bash
# 1. Make your changes to the code
# 2. Build the production version
npm run build

# 3. Deploy to GitHub Pages
npx gh-pages -d build --no-history

# 4. Wait 1-2 minutes for GitHub Pages to update
# 5. Visit: https://fabber04.github.io/FOG--Family-Of-Greatness
```

### Deploy Backend Changes

Backend automatically deploys when you push to GitHub (if connected to Railway).

```bash
# 1. Make your changes to backend code
# 2. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 3. Railway will automatically rebuild and deploy
# 4. Check Railway dashboard for deployment status
```

## Working While Live

### Making Frontend Changes

1. **Test locally first:**
   ```bash
   npm start
   # Visit http://localhost:3000
   ```

2. **When ready to deploy:**
   ```bash
   npm run build
   npx gh-pages -d build --no-history
   ```

3. **Clear browser cache** (Ctrl+Shift+R) to see changes immediately

### Making Backend Changes

1. **Test locally first:**
   ```bash
   cd backend
   uvicorn main:app --reload
   # Test at http://localhost:8000
   ```

2. **Deploy to Railway:**
   ```bash
   git add .
   git commit -m "Backend changes"
   git push origin main
   ```

3. **Railway auto-deploys** - check dashboard for status

## Environment Variables

### Frontend (`.env.production`)
```
REACT_APP_API_URL=https://fog-family-of-greatness-production.up.railway.app
```

### Backend (Railway Dashboard → Variables)
- `DATABASE_URL` - Auto-set by Railway PostgreSQL
- `CORS_ORIGINS` - `https://fabber04.github.io,http://localhost:3000`
- `ENVIRONMENT` - `production`
- `SECRET_KEY` - Your secret key
- `STORAGE_MODE` - `local` or `firebase`

## Troubleshooting

### Frontend not updating?
1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify API calls go to Railway URL (not localhost)
4. Check Network tab in DevTools

### Backend not working?
1. Check Railway dashboard → Deployments
2. Check Railway logs for errors
3. Test backend directly: `curl https://fog-family-of-greatness-production.up.railway.app/api/health`
4. Verify environment variables in Railway

### Database issues?
1. Check Railway PostgreSQL service is running
2. Verify `DATABASE_URL` is set correctly
3. Check backend logs for database connection errors

## Quick Status Check

```bash
# Check backend health
curl https://fog-family-of-greatness-production.up.railway.app/api/health

# Check if podcasts are loading
curl https://fog-family-of-greatness-production.up.railway.app/api/podcasts/ | head -c 200
```

## Important Notes

- ⚠️ **Always test locally before deploying**
- ⚠️ **Database changes persist** (PostgreSQL on Railway)
- ⚠️ **File uploads** stored on Railway (or Firebase if configured)
- ⚠️ **GitHub Pages** may take 1-2 minutes to update
- ⚠️ **Railway** auto-deploys on git push (if connected)





