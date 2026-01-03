# Keeping Your Backend Server Running 24/7

## ✅ Your Current Setup (Railway)

**Good news!** Railway automatically keeps your server running. Here's how it works:

### Railway Auto-Management

1. **Automatic Restart on Failure**
   - Your `railway.json` has: `"restartPolicyType": "ON_FAILURE"`
   - Railway automatically restarts your server if it crashes
   - Maximum 10 retries configured

2. **Always-On Service**
   - Railway keeps your service running 24/7
   - No manual intervention needed
   - Server restarts automatically after deployments

3. **Health Monitoring**
   - Railway monitors your service
   - Automatically detects if the server stops responding
   - Restarts if needed

---

## Current Configuration

### `backend/railway.json`
```json
{
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**This means:**
- ✅ Server starts automatically when deployed
- ✅ Restarts automatically if it crashes (up to 10 times)
- ✅ Runs continuously without manual intervention

---

## Best Practices for Maximum Uptime

### 1. Error Handling in Code

Your backend should handle errors gracefully:

```python
# Example: Add to main.py
import logging
from fastapi import Request
from fastapi.responses import JSONResponse

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

### 2. Health Check Endpoint

You already have this! ✅
```python
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "FOG API is running"}
```

Railway can use this to monitor your service.

### 3. Database Connection Resilience

Ensure your database connections handle failures:

```python
# In database.py - add connection retry logic
from sqlalchemy import event
from sqlalchemy.pool import QueuePool

# Add connection pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,    # Recycle connections after 1 hour
    pool_size=10,
    max_overflow=20
)
```

### 4. Graceful Shutdown

Handle shutdown signals properly:

```python
import signal
import sys

def signal_handler(sig, frame):
    print('Shutting down gracefully...')
    # Close database connections
    # Save any pending data
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)
```

---

## Monitoring Your Server

### Railway Dashboard

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Click on your backend service

2. **Check Service Status**
   - Green indicator = Running
   - Yellow/Red = Issues detected

3. **View Logs**
   - Click "Deployments" tab
   - Click on latest deployment
   - View real-time logs

4. **Set Up Alerts** (Railway Pro)
   - Get notified if service goes down
   - Email/Slack notifications

### External Monitoring (Free Options)

#### Option 1: UptimeRobot (Free - 50 monitors)
1. Sign up at https://uptimerobot.com
2. Add a new monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://fog-family-of-greatness-production.up.railway.app/api/health`
   - **Interval**: 5 minutes
   - **Alert Contacts**: Your email

#### Option 2: Pingdom (Free trial)
- Similar to UptimeRobot
- More advanced features

#### Option 3: StatusCake (Free tier)
- Website monitoring
- Alert notifications

---

## Railway Free Tier Limitations

### What's Included:
- ✅ Always-on service
- ✅ Automatic restarts
- ✅ 500 hours/month free
- ✅ Basic monitoring

### Potential Issues:
1. **Sleep After Inactivity** (Some free tiers)
   - Railway free tier may sleep after inactivity
   - First request after sleep takes longer
   - **Solution**: Upgrade to Railway Pro ($5/month) for always-on

2. **Resource Limits**
   - Free tier has CPU/RAM limits
   - May restart if exceeded
   - **Solution**: Monitor usage in dashboard

---

## Ensuring Maximum Uptime

### 1. Railway Settings

**Check Railway Dashboard:**
- Go to your service → Settings
- Ensure "Auto Deploy" is enabled
- Check "Restart Policy" is set to "ON_FAILURE"

### 2. Environment Variables

Ensure these are set in Railway:
```env
ENVIRONMENT=production
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000
DATABASE_URL=<auto-set by Railway>
```

### 3. Keep Code Updated

- Fix bugs that could cause crashes
- Handle errors gracefully
- Test before deploying

### 4. Database Persistence

Your PostgreSQL on Railway persists data automatically ✅
- No data loss on restarts
- Automatic backups (Railway Pro)

---

## Alternative Hosting Options

If you want more control, consider:

### Option 1: Railway Pro ($5/month)
- ✅ Always-on (no sleep)
- ✅ Better performance
- ✅ More resources
- ✅ Priority support

### Option 2: Render (Free tier available)
- Similar to Railway
- Free tier may sleep after inactivity
- Pro: $7/month for always-on

### Option 3: DigitalOcean App Platform
- $5/month minimum
- Always-on
- More control

### Option 4: VPS (DigitalOcean, Linode, etc.)
- $5-10/month
- Full control
- Need to set up:
  - Systemd service
  - Auto-restart on failure
  - Monitoring

---

## Setting Up Auto-Restart on VPS (If Needed)

If you move to a VPS, use systemd:

### Create Service File: `/etc/systemd/system/fog-backend.service`

```ini
[Unit]
Description=FOG Platform Backend API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/FOG--Family-Of-Greatness/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=fog-backend

[Install]
WantedBy=multi-user.target
```

### Enable and Start:
```bash
sudo systemctl enable fog-backend
sudo systemctl start fog-backend
sudo systemctl status fog-backend
```

---

## Quick Checklist for Production

- [ ] Railway service is deployed and running
- [ ] Health check endpoint works: `/api/health`
- [ ] Database is connected and persistent
- [ ] Environment variables are set correctly
- [ ] CORS is configured for your frontend domain
- [ ] Error handling is in place
- [ ] Monitoring is set up (UptimeRobot or similar)
- [ ] Logs are accessible in Railway dashboard
- [ ] Auto-restart policy is enabled
- [ ] Test server restart (Railway dashboard → Restart)

---

## Testing Server Resilience

### Test 1: Manual Restart
1. Go to Railway dashboard
2. Click "Restart" on your service
3. Verify it comes back online within 30 seconds

### Test 2: Simulate Crash
1. Temporarily add code that crashes
2. Deploy to Railway
3. Verify Railway restarts it automatically

### Test 3: Health Check
```bash
# Test from command line
curl https://fog-family-of-greatness-production.up.railway.app/api/health

# Should return:
# {"status":"healthy","message":"FOG API is running"}
```

---

## Troubleshooting

### Server Not Starting
1. Check Railway logs
2. Verify environment variables
3. Check database connection
4. Verify `railway.json` configuration

### Server Keeps Restarting
1. Check logs for error patterns
2. Verify database is accessible
3. Check resource limits
4. Review error handling code

### Server Goes Down
1. Check Railway dashboard status
2. Review recent deployments
3. Check external monitoring alerts
4. Verify Railway service is active (not paused)

---

## Summary

**With Railway (Your Current Setup):**
- ✅ Server runs 24/7 automatically
- ✅ Auto-restarts on failure
- ✅ No manual intervention needed
- ✅ Free tier works, but may sleep after inactivity
- 💡 Consider Railway Pro ($5/month) for guaranteed always-on

**What You Need to Do:**
1. ✅ Nothing! Railway handles it automatically
2. Monitor Railway dashboard occasionally
3. Set up external monitoring (UptimeRobot - free)
4. Consider Railway Pro if you need guaranteed uptime

**Your server will stay running as long as:**
- Railway service is active (not paused)
- You have Railway credits/hours remaining
- No critical errors that prevent startup
- Database is accessible

---

**Last Updated**: Based on current Railway deployment configuration

