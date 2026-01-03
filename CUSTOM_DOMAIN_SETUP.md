# Custom Domain Setup Guide

This guide will help you configure a custom domain for your FOG platform after acquiring one.

## Current Setup

- **Frontend**: GitHub Pages at `https://fabber04.github.io/FOG--Family-Of-Greatness`
- **Backend**: Railway at `https://fog-family-of-greatness-production.up.railway.app`
- **Database**: PostgreSQL on Railway

## Prerequisites

1. ✅ Domain purchased (e.g., `fogplatform.com` or `familyofgreatness.org`)
2. ✅ Access to domain registrar's DNS settings
3. ✅ GitHub repository access
4. ✅ Railway account access

---

## Step 1: Configure Frontend Domain (GitHub Pages)

### Option A: Root Domain (e.g., `fogplatform.com`)

1. **Go to your GitHub repository**
   - Navigate to: `Settings` → `Pages`

2. **Add custom domain**
   - In the "Custom domain" field, enter your domain: `fogplatform.com`
   - Click `Save`

3. **GitHub will show DNS records needed**
   - You'll see something like:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     Value: 185.199.109.153
     Value: 185.199.110.153
     Value: 185.199.111.153
     ```

4. **Add DNS records at your domain registrar**
   - Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Go to DNS Management
   - Add the A records shown by GitHub
   - **Note**: DNS propagation can take 24-48 hours

5. **Enable HTTPS (automatic)**
   - GitHub will automatically provision SSL certificate
   - Wait for "Certificate provisioned" status (can take a few hours)

### Option B: Subdomain (e.g., `www.fogplatform.com`)

1. **Add CNAME record at your domain registrar**
   ```
   Type: CNAME
   Name: www
   Value: fabber04.github.io
   ```

2. **In GitHub Pages settings**
   - Enter `www.fogplatform.com` in custom domain field
   - Save

3. **GitHub will handle SSL automatically**

---

## Step 2: Configure Backend Domain (Railway)

### Option A: Using Railway's Custom Domain Feature

1. **Go to Railway Dashboard**
   - Navigate to your backend service
   - Click on `Settings` tab
   - Scroll to `Domains` section

2. **Add custom domain**
   - Click `Generate Domain` or `Add Domain`
   - Enter your subdomain: `api.fogplatform.com` (recommended)
   - Railway will provide DNS records

3. **Add DNS records at your domain registrar**
   - Railway will show CNAME or A records
   - Example:
     ```
     Type: CNAME
     Name: api
     Value: your-railway-service.up.railway.app
     ```

4. **Wait for DNS propagation**
   - Can take 1-24 hours
   - Railway will automatically provision SSL certificate

### Option B: Using Cloudflare (Recommended for better performance)

1. **Add your domain to Cloudflare**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers at your registrar

2. **Create DNS records in Cloudflare**
   ```
   Type: CNAME
   Name: api
   Target: fog-family-of-greatness-production.up.railway.app
   Proxy: ON (orange cloud)
   ```

3. **Configure Railway**
   - In Railway, add `api.fogplatform.com` as custom domain
   - Railway will verify DNS

---

## Step 3: Update Environment Variables

### Update Railway Backend Environment Variables

1. **Go to Railway Dashboard**
   - Your backend service → `Variables` tab

2. **Update `CORS_ORIGINS`**
   ```
   https://fogplatform.com,https://www.fogplatform.com,http://localhost:3000
   ```
   Or if using subdomain:
   ```
   https://www.fogplatform.com,http://localhost:3000
   ```

3. **Add new variable (optional)**
   ```
   FRONTEND_URL=https://fogplatform.com
   ```

4. **Railway will auto-redeploy**

### Update Frontend Environment Variables

1. **Update `.env.production` file**
   ```env
   REACT_APP_API_URL=https://api.fogplatform.com
   ```
   Or if using Railway's default domain:
   ```env
   REACT_APP_API_URL=https://fog-family-of-greatness-production.up.railway.app
   ```

2. **Rebuild and redeploy frontend**
   ```bash
   npm run build
   npx gh-pages -d build --no-history
   ```

---

## Step 4: Update Backend Code (Optional - for dynamic CORS)

If you want the backend to automatically allow your custom domain, update `backend/main.py`:

```python
# Add your custom domain to default origins
default_origins = [
    "http://localhost:3000", 
    "http://localhost:3001",
    "http://localhost:3002",
    "https://fabber04.github.io",  # Keep for backward compatibility
    "https://fogplatform.com",     # Your custom domain
    "https://www.fogplatform.com"   # With www
]
```

Then redeploy backend:
```bash
git add backend/main.py
git commit -m "Add custom domain to CORS origins"
git push origin main
```

---

## Step 5: Verify Everything Works

### Test Frontend

1. **Visit your custom domain**
   ```
   https://fogplatform.com
   ```

2. **Check browser console (F12)**
   - No CORS errors
   - API calls go to your backend domain

3. **Test API connection**
   - Open Network tab
   - Verify requests go to `https://api.fogplatform.com` (or your backend URL)

### Test Backend

1. **Test health endpoint**
   ```bash
   curl https://api.fogplatform.com/api/health
   ```
   Should return: `{"status":"healthy","message":"FOG API is running"}`

2. **Test from frontend**
   - Visit your site
   - Open browser console
   - Check for successful API calls

---

## DNS Record Examples

### Complete DNS Setup Example

If your domain is `fogplatform.com`:

**At your domain registrar (or Cloudflare):**

```
Type    Name    Value                                    TTL
A       @       185.199.108.153                         3600
A       @       185.199.109.153                         3600
A       @       185.199.110.153                         3600
A       @       185.199.111.153                         3600
CNAME   www     fabber04.github.io                       3600
CNAME   api     fog-family-of-greatness-production.up.railway.app  3600
```

**Result:**
- `fogplatform.com` → GitHub Pages (frontend)
- `www.fogplatform.com` → GitHub Pages (frontend)
- `api.fogplatform.com` → Railway (backend)

---

## Common Issues & Solutions

### Issue 1: "Not Secure" or SSL Certificate Error

**Solution:**
- Wait 24-48 hours for SSL certificate provisioning
- GitHub and Railway provision SSL automatically
- If using Cloudflare, ensure SSL/TLS mode is set to "Full" or "Full (strict)"

### Issue 2: CORS Errors After Domain Change

**Solution:**
1. Update `CORS_ORIGINS` in Railway with your new domain
2. Wait for Railway to redeploy
3. Clear browser cache (Ctrl+Shift+R)
4. Verify domain is in `allow_origins` list

### Issue 3: DNS Not Propagating

**Solution:**
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Wait up to 48 hours for full propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Issue 4: Frontend Shows Old Content

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Verify GitHub Pages deployment is complete
4. Check GitHub Actions/Pages deployment status

### Issue 5: API Calls Still Going to Old URL

**Solution:**
1. Verify `.env.production` has correct `REACT_APP_API_URL`
2. Rebuild frontend: `npm run build`
3. Redeploy: `npx gh-pages -d build --no-history`
4. Clear browser cache

---

## Recommended Domain Structure

### Option 1: Separate Subdomains (Recommended)
```
fogplatform.com          → Frontend (GitHub Pages)
www.fogplatform.com      → Frontend (GitHub Pages)
api.fogplatform.com      → Backend (Railway)
```

### Option 2: Same Domain with Paths
```
fogplatform.com          → Frontend
fogplatform.com/api       → Backend (requires reverse proxy)
```
**Note**: This requires additional setup (Nginx, Cloudflare Workers, etc.)

---

## Security Considerations

1. **HTTPS Only**
   - Always use HTTPS for production
   - GitHub Pages and Railway provide free SSL certificates

2. **CORS Configuration**
   - Only allow your specific domains
   - Don't use wildcards (`*`) in production

3. **Environment Variables**
   - Never commit `.env.production` to git
   - Use Railway's environment variables for backend secrets

---

## Cost Considerations

### Free Options
- ✅ GitHub Pages (free for public repos)
- ✅ Railway (free tier available)
- ✅ Cloudflare (free tier includes CDN, SSL, DNS)

### Paid Options (if needed)
- Custom domain: $10-15/year (varies by registrar)
- Railway Pro: $20/month (if you exceed free tier)
- Cloudflare Pro: $20/month (optional, free tier is usually enough)

---

## Quick Checklist

- [ ] Domain purchased
- [ ] DNS records added at registrar
- [ ] GitHub Pages custom domain configured
- [ ] Railway custom domain configured (if using)
- [ ] `CORS_ORIGINS` updated in Railway
- [ ] `.env.production` updated with new API URL
- [ ] Frontend rebuilt and redeployed
- [ ] Backend redeployed (auto on Railway)
- [ ] SSL certificates provisioned (wait 24-48 hours)
- [ ] Tested frontend on custom domain
- [ ] Tested API calls from frontend
- [ ] Verified no CORS errors

---

## Support Resources

- **GitHub Pages Docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- **Railway Docs**: https://docs.railway.app/reference/domains
- **Cloudflare Docs**: https://developers.cloudflare.com/dns/

---

## Next Steps After Domain Setup

1. Update all documentation with new URLs
2. Update any hardcoded URLs in code
3. Set up monitoring/analytics
4. Configure email (if needed) with your domain
5. Set up redirects (www to non-www or vice versa)

---

**Last Updated**: Based on current setup with GitHub Pages + Railway



