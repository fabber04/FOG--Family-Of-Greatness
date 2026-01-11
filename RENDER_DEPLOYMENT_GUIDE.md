# Render Deployment Guide - Alternative to Railway

Render is a more stable alternative to Railway with a generous free tier and better reliability.

## Why Render?

✅ **More Stable**: Better uptime and fewer crashes than Railway  
✅ **Free Tier**: 750 hours/month free (enough for 24/7 hosting)  
✅ **PostgreSQL**: Free PostgreSQL database included  
✅ **Auto-Deploy**: Deploys automatically from GitHub  
✅ **Better Logs**: More detailed logging and debugging  
✅ **Custom Domains**: Easy custom domain setup  

## Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free)
3. Authorize Render to access your repositories

## Step 2: Create PostgreSQL Database

1. In Render Dashboard → Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `fog-database`
   - **Database**: `fog_platform`
   - **User**: `fog_user` (or auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid if needed)
3. Click **"Create Database"**
4. **Copy the Internal Database URL** - you'll need this!

## Step 3: Deploy Backend Service

1. In Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `FOG--Family-Of-Greatness`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `fog-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Click **"Advanced"** and add environment variables:

   ```env
   # Database (use the Internal Database URL from Step 2)
   DATABASE_URL=postgresql://user:password@host:port/dbname
   
   # Or use DATABASE_PUBLIC_URL if Internal doesn't work
   # DATABASE_PUBLIC_URL=postgresql://user:password@host:port/dbname
   
   # Secret Key (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
   SECRET_KEY=your-generated-secret-key-here
   
   # CORS Origins
   CORS_ORIGINS=https://familyofgreatness.com,https://www.familyofgreatness.com,https://fabber04.github.io,http://localhost:3000
   
   # Environment
   ENVIRONMENT=production
   
   # Storage Mode
   STORAGE_MODE=local
   ```

5. Click **"Create Web Service"**

## Step 4: Link Database to Backend

1. In your backend service → **"Environment"** tab
2. Scroll to **"Add Environment Variable"**
3. Click **"Link Database"** 
4. Select your PostgreSQL database
5. Render will automatically add `DATABASE_URL`

## Step 5: Get Your Backend URL

1. Once deployed, Render provides a URL like:
   ```
   https://fog-backend.onrender.com
   ```
2. Copy this URL

## Step 6: Update Frontend

1. Update `.env.production`:
   ```bash
   REACT_APP_API_URL=https://fog-backend.onrender.com
   ```

2. Rebuild and redeploy:
   ```bash
   npm run build
   npx gh-pages -d build --no-history
   ```

## Step 7: Configure Custom Domain (Optional)

1. In Render Dashboard → Your backend service → **"Settings"**
2. Scroll to **"Custom Domains"**
3. Add your domain: `api.familyofgreatness.com`
4. Render will provide DNS records to add
5. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: [Render-provided-value]
   ```

## Step 8: Update CORS for Custom Domain

1. In Render → Backend service → **"Environment"** tab
2. Update `CORS_ORIGINS`:
   ```
   https://familyofgreatness.com,https://www.familyofgreatness.com,https://api.familyofgreatness.com,https://fabber04.github.io,http://localhost:3000
   ```
3. Render will auto-redeploy

## Troubleshooting

### Service Keeps Crashing

1. Check **"Logs"** tab in Render
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection errors
   - Port configuration issues

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Use Internal Database URL (not Public URL) for better performance
3. Check database is running (Render Dashboard → Database service)

### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan for always-on service ($7/month)

## Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | 750 hrs/month | Limited |
| Stability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| PostgreSQL | Free included | Free included |
| Custom Domains | Easy | Easy |
| Logs | Excellent | Good |
| Auto-Deploy | Yes | Yes |

## Migration Checklist

- [ ] Sign up for Render
- [ ] Create PostgreSQL database
- [ ] Deploy backend service
- [ ] Link database to backend
- [ ] Test backend health endpoint
- [ ] Update frontend `.env.production`
- [ ] Rebuild and redeploy frontend
- [ ] Test frontend → backend connection
- [ ] Configure custom domain (optional)
- [ ] Update CORS origins
- [ ] Verify everything works

## Cost

**Free Tier:**
- Web Service: Free (spins down after inactivity)
- PostgreSQL: Free (90 days, then $7/month)
- Total: $0-7/month

**Paid Tier (Always On):**
- Web Service: $7/month
- PostgreSQL: $7/month
- Total: $14/month

---

**Render is generally more stable and reliable than Railway. The free tier is perfect for getting started!**


