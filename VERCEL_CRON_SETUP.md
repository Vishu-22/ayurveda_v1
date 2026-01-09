# Vercel Cron Jobs Setup - Keep Supabase Active

This guide explains how to use Vercel Cron Jobs to prevent your Supabase database from pausing due to inactivity.

## Problem

Supabase's free tier pauses your database after **7 days of inactivity**. This means:
- Your database becomes unavailable
- Your website stops working
- You need to manually wake it up from the Supabase dashboard

## Solution

Use Vercel Cron Jobs to automatically ping your database daily, keeping it active.

---

## How It Works

1. **Keep-Alive Endpoint**: A simple API route (`/api/keep-alive`) that queries your database
2. **Vercel Cron Job**: Automatically calls this endpoint daily at midnight UTC
3. **Database Stays Active**: The daily query prevents Supabase from pausing

---

## Setup Instructions

### Step 1: Verify Files Are Created

Make sure these files exist in your project:

- ✅ `app/api/keep-alive/route.ts` - The keep-alive endpoint
- ✅ `vercel.json` - Vercel cron configuration

### Step 2: Deploy to Vercel

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add keep-alive endpoint for Supabase"
   git push
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your repository (if not already imported)
   - Vercel will automatically detect `vercel.json` and set up cron jobs

### Step 3: Verify Cron Job is Active

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Cron Jobs**
3. You should see:
   - **Path**: `/api/keep-alive`
   - **Schedule**: `0 0 * * *` (runs daily at midnight UTC)
   - **Status**: Active

### Step 4: Test the Endpoint

Test the keep-alive endpoint manually:

```bash
curl https://yourdomain.com/api/keep-alive
```

Expected response:
```json
{
  "status": "active",
  "message": "Database is active and responsive",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "checked": true
}
```

---

## Cron Schedule Explained

The schedule `0 0 * * *` uses cron syntax:

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

- `0 0 * * *` = Every day at midnight UTC (00:00)

### Other Schedule Options

If you want to run more frequently (to be extra safe):

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 */12 * * *"  // Every 12 hours
    }
  ]
}
```

Or every 6 hours:
```json
{
  "schedule": "0 */6 * * *"  // Every 6 hours
}
```

---

## Monitoring

### Check Cron Job Logs

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Deployments** → Click on a deployment
3. Go to **Functions** tab
4. Look for `/api/keep-alive` function logs

### Verify Database Activity

1. Go to Supabase Dashboard
2. Navigate to **Database** → **Logs**
3. You should see queries from the keep-alive endpoint daily

---

## Troubleshooting

### Cron Job Not Running

**Issue**: Cron job doesn't appear in Vercel dashboard

**Solutions**:
1. Make sure `vercel.json` is in the root of your project
2. Redeploy your project after adding `vercel.json`
3. Check that you're on a Vercel plan that supports cron jobs (Hobby plan and above)

### Database Still Pausing

**Issue**: Database pauses despite cron job

**Solutions**:
1. Check cron job logs in Vercel to ensure it's running
2. Verify the endpoint returns 200 status code
3. Try increasing frequency (every 12 hours instead of 24)
4. Check Supabase dashboard for any errors

### Endpoint Returns 500 Error

**Issue**: Keep-alive endpoint fails

**Solutions**:
1. Check your Supabase environment variables are set correctly
2. Verify database connection in Supabase dashboard
3. Check Vercel function logs for error details
4. Ensure the `products` table exists (or update the query to use a different table)

---

## Alternative: Manual Keep-Alive

If you're not using Vercel, you can use external services:

### Option 1: UptimeRobot (Free)
1. Sign up at [UptimeRobot.com](https://uptimerobot.com)
2. Add a new monitor:
   - Type: HTTP(s)
   - URL: `https://yourdomain.com/api/keep-alive`
   - Interval: 24 hours

### Option 2: cron-job.org (Free)
1. Sign up at [cron-job.org](https://cron-job.org)
2. Create a new cron job:
   - URL: `https://yourdomain.com/api/keep-alive`
   - Schedule: Daily

### Option 3: GitHub Actions (Free)
Create `.github/workflows/keep-alive.yml`:
```yaml
name: Keep Supabase Active

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Keep-Alive Endpoint
        run: |
          curl https://yourdomain.com/api/keep-alive
```

---

## Cost

- **Vercel Cron Jobs**: Free on Hobby plan and above
- **Keep-Alive Endpoint**: Minimal database queries (negligible cost)
- **Total Cost**: $0 (if using Vercel free tier)

---

## Best Practices

1. **Monitor Regularly**: Check Vercel logs monthly to ensure cron jobs are running
2. **Set Up Alerts**: Configure Vercel notifications for failed cron jobs
3. **Test Periodically**: Manually test the endpoint to ensure it's working
4. **Backup Plan**: Consider using UptimeRobot as a backup if Vercel cron fails

---

## Additional Notes

- The keep-alive endpoint uses minimal resources (one simple query per day)
- This solution works for Supabase free tier
- If you upgrade to Supabase Pro ($25/month), pausing is disabled automatically
- The endpoint is publicly accessible but only performs read operations (safe)

---

## Support

If you encounter issues:
1. Check Vercel documentation: [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
2. Check Supabase status: [status.supabase.com](https://status.supabase.com)
3. Review function logs in Vercel dashboard

---

**Last Updated**: January 2024
