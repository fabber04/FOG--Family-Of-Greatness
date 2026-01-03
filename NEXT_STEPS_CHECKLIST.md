# ✅ Next Steps Checklist - Complete Setup

## Step 1: Get Your Railway URL ⚠️ REQUIRED

1. In Railway Dashboard → Click on your **backend service** (not the Postgres service)
2. Go to **Settings** tab
3. Scroll to **Domains** section
4. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)
5. **Write it down** - you'll need it for the next steps!

---

## Step 2: Add Environment Variables to Railway ⚠️ REQUIRED

1. In Railway Dashboard → Click on your **backend service**
2. Go to **Variables** tab (or go to Project Settings → Shared Variables)
3. Click **"Add Variable"** or the `{}` icon
4. Add these two variables:

   **Variable 1:**
   - Key: `CORS_ORIGINS`
   - Value: `https://fabber04.github.io,http://localhost:3000`
   - Click Save

   **Variable 2:**
   - Key: `ENVIRONMENT`
   - Value: `production`
   - Click Save

5. Railway will automatically redeploy your backend

---

## Step 3: Test Your Backend ✅

Open a terminal and test:

```bash
curl https://your-railway-url.up.railway.app/api/health
```

**Expected response:**
```json
{"status":"healthy","message":"FOG API is running"}
```

If you get this, your backend is working! ✅

---

## Step 4: Update Frontend Configuration ⚠️ REQUIRED

1. **Create `.env.production` file** in your project root:

   ```bash
   cd /home/fab/Documents/Projects/FOG--Family-Of-Greatness
   ```

2. **Create the file** (replace `your-railway-url` with your actual Railway URL):

   ```bash
   echo "REACT_APP_API_URL=https://your-railway-url.up.railway.app" > .env.production
   ```

   Or manually create `.env.production` with:
   ```
   REACT_APP_API_URL=https://your-railway-url.up.railway.app
   ```

3. **Rebuild your frontend:**

   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

---

## Step 5: Verify Everything Works ✅

1. **Visit your site:** https://fabber04.github.io/FOG--Family-Of-Greatness/
2. **Open browser console** (F12)
3. **Check Network tab:**
   - API calls should go to your Railway URL
   - No CORS errors
   - No 404 errors

4. **Test features:**
   - Try logging in
   - Check if podcasts load
   - Test other features

---

## Quick Command Reference

```bash
# 1. Test backend health
curl https://your-railway-url.up.railway.app/api/health

# 2. Create production env file (replace URL!)
echo "REACT_APP_API_URL=https://your-railway-url.up.railway.app" > .env.production

# 3. Build frontend
npm run build

# 4. Deploy to GitHub Pages
npm run deploy
```

---

## Troubleshooting

### Backend not responding?
- Check Railway logs: Dashboard → Backend Service → Deployments → View Logs
- Verify service is running (green status)
- Check that `DATABASE_URL` is set (should be auto-set by Railway)

### CORS errors?
- Make sure `CORS_ORIGINS` includes `https://fabber04.github.io`
- Check that variable is saved in Railway
- Redeploy backend after adding variables

### Frontend can't connect?
- Verify `.env.production` has correct Railway URL
- Make sure you ran `npm run build` after creating `.env.production`
- Check browser console for exact error

### Database connection errors?
- Verify PostgreSQL service is running in Railway
- Check that `DATABASE_URL` is set in backend service variables
- Check Railway logs for specific error

---

## Success Indicators ✅

You'll know everything is working when:

- ✅ Backend health endpoint returns success
- ✅ Frontend loads without console errors
- ✅ API calls in Network tab go to Railway URL
- ✅ Content (podcasts, events, etc.) loads correctly
- ✅ Users can log in and interact with the platform

---

## What's Next After Setup?

Once everything is working:

1. **Re-upload content** (podcasts, events, etc.) - database is fresh
2. **Test all features** to ensure they work with the new backend
3. **Monitor Railway logs** for any issues
4. **Set up file storage persistence** (optional but recommended)

---

**You're almost there! Follow these steps and your platform will be live! 🚀**

