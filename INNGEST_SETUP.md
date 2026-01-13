# Inngest Background Job Setup

## Overview
This project uses Inngest for background processing of GitHub webhook events. PR analysis is now handled asynchronously to ensure fast webhook responses (<500ms).

## Architecture
- **Webhook Route** (`/api/webhooks/github`): Receives GitHub events and enqueues jobs
- **Inngest Handler** (`/api/inngest`): Processes background jobs
- **Background Function** (`lib/inngest/functions/analyzePullRequest.ts`): Handles PR analysis

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Add to your `.env`:
```bash
INNGEST_EVENT_KEY=your_inngest_event_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Servers
Option A - Run both simultaneously:
```bash
npm run dev:all
```

Option B - Run separately:
```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Inngest dev server
npm run dev:inngest
```

### 4. Test Webhook
The Inngest dev UI will be available at: http://localhost:8288

## Production Deployment (Vercel)

### 1. Environment Variables
Set these in your Vercel dashboard:

**Required:**
- `INNGEST_EVENT_KEY` - Get from Inngest dashboard
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., https://yourapp.vercel.app)
- `DATABASE_URL` - Your Postgres connection string
- `GITHUB_WEBHOOK_SECRET` - Your GitHub App webhook secret

**Existing (keep as-is):**
- All your current AI API keys (OPENROUTER_API_KEY, GEMINI_API_KEY, etc.)
- GitHub App credentials (GITHUB_APP_ID, GITHUB_PRIVATE_KEY)
- Clerk authentication keys

### 2. Inngest Setup
1. Create account at [inngest.com](https://inngest.com)
2. Create a new app
3. Set webhook URL to: `https://your-app.vercel.app/api/inngest`
4. Copy the Event Key to your Vercel environment variables

### 3. Database Schema Update
Push the updated schema to add webhook processing fields:
```bash
npx prisma db push
```

### 4. Deploy
```bash
npm run build  # Test locally first
vercel deploy --prod
```

## Monitoring

### Check Job Status
- **Local:** http://localhost:8288
- **Production:** Inngest dashboard

### Database Queries
```sql
-- Check webhook processing status
SELECT deliveryId, event, processed, error, createdAt, processedAt 
FROM "WebhookLog" 
ORDER BY createdAt DESC;

-- Failed jobs
SELECT * FROM "WebhookLog" 
WHERE processed = false AND error IS NOT NULL;
```

## Troubleshooting

### Webhook not processing
1. Check Vercel function logs
2. Verify INNGEST_EVENT_KEY is set
3. Check Inngest dashboard for job failures

### Jobs failing
1. Check Inngest dashboard error messages
2. Verify AI API keys are still valid
3. Check database connection

### Local development issues
1. Make sure both `npm run dev` and `npm run dev:inngest` are running
2. Check that webhook points to correct ngrok/local URL
3. Verify `.env` file has all required variables

## Performance Benefits
- **Fast webhook response**: Now ~50-100ms instead of 10-30 seconds
- **Better reliability**: Failed jobs automatically retry
- **Scalability**: Jobs process in parallel
- **Monitoring**: Full visibility into job status