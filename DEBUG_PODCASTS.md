# Debugging Podcasts Not Showing

## Quick Checks

### 1. Check Browser Console
Open your site and press `F12` → Console tab. Look for:
- `🔍 Loading podcasts from API...`
- `✅ Podcasts loaded: X items`
- `📂 Categories after grouping:`
- Any `❌` error messages

### 2. Test API Directly
```bash
curl https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool | head -50
```

### 3. Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Refresh the page
4. Look for request to `/api/podcasts/`
5. Check:
   - Status code (should be 200)
   - Response (should show JSON with podcasts)
   - CORS headers (should allow your domain)

### 4. Verify Deployment
- Check GitHub Actions: https://github.com/fabber04/FOG--Family-Of-Greatness/actions
- Make sure the latest workflow completed successfully
- Wait 2-3 minutes after deployment for DNS/CDN to update

### 5. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear cache in browser settings

## Expected Console Output

If everything is working, you should see:
```
🔍 Loading podcasts from API... https://fog-backend-iyhz.onrender.com
✅ Podcasts loaded: 21 items
📊 Sample podcast: {id: 1, title: "...", category: "beyond-dating-game", ...}
✅ Podcasts sorted: 21 items
📁 Categories found: ["beyond-dating-game", "teens"]
📂 Categories after grouping: [
  {id: "beyond-dating-game", name: "Beyond The Dating Game", count: 20},
  {id: "teens", name: "Teens Podcasts", count: 1},
  ...
]
```

## Common Issues

### Issue: "No podcast categories found"
**Cause**: API call failed or returned empty array
**Fix**: Check Network tab for API errors, verify CORS is configured

### Issue: Categories show but have 0 episodes
**Cause**: Category normalization not matching
**Fix**: Check console for category mapping issues

### Issue: "Cannot connect to backend API"
**Cause**: CORS or network issue
**Fix**: Verify backend is running and CORS allows your domain

## Current Status
- ✅ Backend API: Working (21 podcasts)
- ✅ Database: Connected
- ✅ CORS: Configured for familyofgreatness.com
- ⚠️ Frontend: Needs deployment via GitHub Actions

