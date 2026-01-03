# Railway Deployment - Next Steps

## ✅ Your Backend is Live!

Your Railway deployment is successful! The server is running on port 8080.

## Step 1: Get Your Railway URL

1. Go to your Railway dashboard
2. Click on your service
3. Go to **Settings** tab
4. Scroll to **Domains** section
5. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)

## Step 2: Test Your Backend

Test the health endpoint:
```bash
curl https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"healthy","message":"FOG API is running"}
```

## Step 3: Update CORS (If Needed)

If you get CORS errors, add your Railway URL to CORS_ORIGINS:

1. In Railway dashboard → Your service → **Variables** tab
2. Update `CORS_ORIGINS`:
   ```
   https://fabber04.github.io,http://localhost:3000,https://your-railway-url.up.railway.app
   ```
3. Railway will auto-redeploy

## Step 4: Update Frontend

1. Create `.env.production` file in project root:
   ```env
   REACT_APP_API_URL=https://your-railway-url.up.railway.app
   ```

2. Rebuild and redeploy frontend:
   ```bash
   npm run build
   npm run deploy
   ```

## Step 5: Test Full Stack

1. Visit your GitHub Pages site: https://fabber04.github.io/FOG--Family-Of-Greatness/
2. Open browser console (F12)
3. Check Network tab - API calls should go to your Railway URL
4. Test podcast loading, user login, etc.

## Important Notes

### Database Persistence
⚠️ **Your SQLite database will reset on each deployment!**

**Solution**: Add Railway PostgreSQL:
1. In Railway → Click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically sets `DATABASE_URL`
3. Your backend will automatically use PostgreSQL
4. Database will persist across deployments

### File Storage Persistence
⚠️ **Uploaded files will be lost on redeploy!**

**Solutions**:

**Option A: Railway Volume** (for small files)
1. In Railway → Click **"New"** → **"Volume"**
2. Mount to `/app/storage` or `/app/uploads`
3. Files persist across deployments

**Option B: Firebase Storage** (recommended for production)
1. Set `STORAGE_MODE=firebase` in Railway variables
2. Add Firebase credentials
3. Files stored in Firebase (persistent and scalable)

## Troubleshooting

### CORS Errors
- Make sure Railway URL is in `CORS_ORIGINS`
- Check browser console for specific error
- Verify frontend `.env.production` has correct URL

### 404 Errors
- Verify Railway URL is correct
- Check that service is running (green status)
- Test health endpoint first

### Database Errors
- If using SQLite, data resets on redeploy
- Consider adding PostgreSQL database
- Check Railway logs for database connection errors

## View Logs

1. Railway Dashboard → Your service → **Deployments**
2. Click on latest deployment → View logs
3. Or use Railway CLI: `railway logs`

## Success Checklist

- [ ] Backend deployed to Railway
- [ ] Got Railway URL
- [ ] Tested health endpoint
- [ ] Updated CORS_ORIGINS
- [ ] Created `.env.production` with Railway URL
- [ ] Rebuilt and redeployed frontend
- [ ] Tested full stack on GitHub Pages
- [ ] Added PostgreSQL database (optional but recommended)
- [ ] Set up file storage persistence (optional but recommended)

## Your Backend is Now Live! 🎉

Clients can now see changes in real-time when you push to GitHub!


