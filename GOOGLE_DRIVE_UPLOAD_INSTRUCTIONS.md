# Uploading Podcasts from Google Drive

## Quick Steps

### Option 1: Manual Download (Recommended)

1. **Download from Google Drive**
   - Go to: https://drive.google.com/drive/folders/1WzmdDfCQt-hV9eF0LopaQH9TNs2I6EiA
   - Click the folder "01 WEBSTISE READY PODCASTS" or "01 WEBSTISE READY PODCASTS-20251217T173551Z-1-001"
   - Click the three dots (⋮) → "Download" (or right-click → Download)
   - Wait for the ZIP file to download

2. **Extract the ZIP file**
   ```bash
   cd /home/fab/Documents/Projects/FOG--Family-Of-Greatness
   unzip ~/Downloads/01\ WEBSTISE\ READY\ PODCASTS*.zip -d .
   ```

3. **Update the upload script**
   - Open `upload_podcasts.py`
   - Update `PODCASTS_FOLDER` to point to your extracted folder
   - Update `PODCAST_METADATA` with the podcast information

4. **Run the upload script**
   ```bash
   python3 upload_podcasts.py
   ```

### Option 2: Use the Google Drive Download Script

1. **Make sure the Google Drive folder is publicly accessible**
   - Right-click the folder in Google Drive
   - Select "Share" → "Get link"
   - Set to "Anyone with the link"

2. **Run the download script**
   ```bash
   python3 download_and_upload_from_drive.py 1WzmdDfCQt-hV9eF0LopaQH9TNs2I6EiA
   ```

   Note: This may not work if Google Drive requires authentication. Use Option 1 if it fails.

## Troubleshooting Podcasts Not Showing

If podcasts aren't showing on your website:

1. **Clear browser cache**
   - Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to hard refresh
   - Or clear cache in browser settings

2. **Check browser console**
   - Press `F12` to open Developer Tools
   - Go to "Console" tab
   - Look for errors related to API calls

3. **Verify API is working**
   ```bash
   curl https://fog-backend-iyhz.onrender.com/api/podcasts/ | python3 -m json.tool | head -50
   ```

4. **Redeploy frontend to GitHub Pages**
   - The build folder is ready
   - Push to GitHub to trigger automatic deployment
   - Or manually deploy the `build/` folder contents

5. **Check CORS settings**
   - Make sure your domain is in the backend CORS_ORIGINS
   - Current allowed origins:
     - https://familyofgreatness.com
     - https://www.familyofgreatness.com
     - https://fabber04.github.io

## Current Status

- ✅ Backend API: Working (21 podcasts uploaded)
- ✅ Database: Connected
- ✅ File Storage: Working
- ✅ CORS: Configured correctly
- ⚠️ Frontend: Needs to be deployed/redeployed to GitHub Pages

