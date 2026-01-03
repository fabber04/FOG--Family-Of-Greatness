# Quick Deploy Guide - Keep It Live

## ✅ Your App is Now Live!

- **Frontend**: https://fabber04.github.io/FOG--Family-Of-Greatness
- **Backend**: https://fog-family-of-greatness-production.up.railway.app

## 🚀 Deploy Frontend Changes (2 commands)

```bash
npm run build
npx gh-pages -d build --no-history
```

**That's it!** Wait 1-2 minutes, then visit your site.

## 🔧 Deploy Backend Changes

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Railway auto-deploys when you push to GitHub.

## 📝 Workflow: Make Changes While Live

### 1. Test Locally First
```bash
# Frontend
npm start
# Visit http://localhost:3000

# Backend
cd backend
uvicorn main:app --reload
# Test at http://localhost:8000
```

### 2. When Ready, Deploy
```bash
# Frontend
npm run build && npx gh-pages -d build --no-history

# Backend (auto-deploys on git push)
git push origin main
```

### 3. Clear Browser Cache
Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to see changes immediately.

## ⚙️ Configuration Files

### `.env.production` (Frontend)
```
REACT_APP_API_URL=https://fog-family-of-greatness-production.up.railway.app
```

### Railway Environment Variables (Backend)
- `DATABASE_URL` - Auto-set by Railway
- `CORS_ORIGINS` - `https://fabber04.github.io,http://localhost:3000`
- `ENVIRONMENT` - `production`
- `SECRET_KEY` - Your secret key
- `STORAGE_MODE` - `local` or `firebase`

## 🐛 Troubleshooting

### Frontend not updating?
1. Hard refresh: `Ctrl+Shift+R`
2. Check browser console (F12)
3. Verify API calls go to Railway (not localhost)
4. Wait 1-2 minutes for GitHub Pages to update

### Backend not working?
1. Check Railway dashboard → Deployments
2. Check Railway logs
3. Test: `curl https://fog-family-of-greatness-production.up.railway.app/api/health`

### Podcasts not loading?
1. Check backend is running: `curl https://fog-family-of-greatness-production.up.railway.app/api/podcasts/`
2. Check browser console for errors
3. Verify CORS settings in Railway

## 📊 Quick Status Check

```bash
# Backend health
curl https://fog-family-of-greatness-production.up.railway.app/api/health

# Check podcasts
curl https://fog-family-of-greatness-production.up.railway.app/api/podcasts/ | head -c 200
```

## 💡 Tips

- ✅ Always test locally before deploying
- ✅ Database persists (PostgreSQL on Railway)
- ✅ File uploads stored on Railway
- ✅ GitHub Pages takes 1-2 minutes to update
- ✅ Railway auto-deploys on git push





