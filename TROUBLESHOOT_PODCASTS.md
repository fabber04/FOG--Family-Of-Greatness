# Troubleshooting: Podcasts Not Showing on Live Platform

## Quick Diagnosis Steps

### 1. Check if API is Working
```bash
curl https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool | head -30
```

**Expected:** Should return a JSON array with podcast objects.

### 2. Check Browser Console
1. Visit: `https://familyofgreatness.com/#/podcasts`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for:
   - `🔍 Loading podcasts from API...`
   - `✅ Podcasts loaded: X items`
   - Any error messages (red text)

### 3. Check Network Requests
1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for request to `/api/podcasts/`
4. Check:
   - **Status:** Should be `200 OK`
   - **Response:** Should contain podcast data
   - **CORS:** Check if CORS error appears

### 4. Verify Frontend is Deployed
1. Check GitHub Actions: https://github.com/fabber04/FOG--Family-Of-Greatness/actions
2. Look for "Deploy to GitHub Pages" workflow
3. Should show ✅ green checkmark if successful

### 5. Clear Browser Cache
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) for hard refresh
- Or clear cache in browser settings

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptoms:** Console shows "CORS policy" error

**Solution:** 
- Backend CORS is configured, but verify in `backend/main.py`
- Check that `https://familyofgreatness.com` is in `CORS_ORIGINS`

### Issue 2: API Returns Empty Array
**Symptoms:** Console shows `✅ Podcasts loaded: 0 items`

**Solution:**
- Podcasts exist in database (21 podcasts confirmed)
- Check if API URL is correct: `https://fog-backend-iyhz.onrender.com`
- Verify backend is running: `curl https://fog-backend-iyhz.onrender.com/api/health`

### Issue 3: Network Error / Failed to Fetch
**Symptoms:** Console shows "Failed to fetch" or network error

**Solution:**
- Backend might be sleeping (Render free tier)
- First request may take 30-60 seconds to wake up
- Wait and refresh

### Issue 4: Old Frontend Code
**Symptoms:** No console logs, or old behavior

**Solution:**
- Check GitHub Actions deployment status
- Force redeploy by pushing a commit
- Clear browser cache completely

### Issue 5: Categories Not Showing
**Symptoms:** Categories appear but are empty

**Solution:**
- Check console for category filtering logs
- Verify podcasts have correct category IDs
- Check `getCategoryInfo()` function in `Podcasts.js`

---

## Debugging Commands

### Test API Directly
```bash
# Get all podcasts
curl https://fog-backend-iyhz.onrender.com/api/podcasts/

# Get podcasts by category
curl "https://fog-backend-iyhz.onrender.com/api/podcasts/?category=beyond-dating-game"

# Check API health
curl https://fog-backend-iyhz.onrender.com/api/health
```

### Check Frontend Build
```bash
# Build locally
npm run build

# Check build output
ls -la build/static/js/

# Test build locally
npx serve -s build
```

### Check Deployment
```bash
# Check if latest code is pushed
git log --oneline -5

# Check GitHub Actions status
# Visit: https://github.com/fabber04/FOG--Family-Of-Greatness/actions
```

---

## Expected Console Output

When working correctly, you should see:
```
🔍 Loading podcasts from API... https://fog-backend-iyhz.onrender.com
✅ Podcasts loaded: 21 items
📊 Sample podcast: {id: 21, title: "Eps 22 Heal before the relationship", ...}
✅ Podcasts sorted: 21 items
📂 Categories after grouping: [{id: "beyond-dating-game", name: "Beyond The Dating Game", count: 20}, ...]
```

---

## Force Redeploy

If nothing works, force a fresh deployment:

1. **Make a small change:**
   ```bash
   echo "# Redeploy $(date)" >> README.md
   git add README.md
   git commit -m "Force redeploy"
   git push
   ```

2. **Or trigger GitHub Actions manually:**
   - Go to: https://github.com/fabber04/FOG--Family-Of-Greatness/actions
   - Click "Deploy to GitHub Pages"
   - Click "Run workflow"

---

## Still Not Working?

1. **Check Render backend logs:**
   - Visit: https://dashboard.render.com
   - Go to your backend service
   - Check logs for errors

2. **Verify database:**
   ```bash
   curl https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool | wc -l
   ```
   Should show podcast count

3. **Test from different browser/device:**
   - Try incognito/private mode
   - Try different browser
   - Try mobile device

4. **Check DNS propagation:**
   ```bash
   curl -I https://familyofgreatness.com
   ```
   Should return `200 OK`

