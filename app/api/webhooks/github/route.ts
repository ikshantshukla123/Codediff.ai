import { headers } from 'next/headers';
import { verifySignature } from '@/lib/github/utils';
import { rateLimit } from '@/lib/security/rate-limiter';
import { prisma } from '@/lib/prisma';
import { inngest } from '@/lib/inngest/client';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(req as any, 50, 60000); // 50 requests per minute
    if (!rateLimitResult.allowed) {
      return new Response('Rate limit exceeded', {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString()
        }
      });
    }

    const body = await req.text();
    const headersList = await headers(); // Your fix for Next.js 15 is correct ✅

    const signature = headersList.get('x-hub-signature-256');
    const event = headersList.get('x-github-event');
    const deliveryId = headersList.get('x-github-delivery');

    // IDEMPOTENCY CHECK: Prevent duplicate processing::: 
    if (deliveryId) {
      const existingLog = await prisma.webhookLog.findUnique({
        where: { deliveryId }
      });

      if (existingLog) {
        console.log(`🔄 Duplicate webhook delivery ${deliveryId} - returning 200 OK`);
        return new Response('Already processed', { status: 200 });
      }

      // Create log entry BEFORE processing to block future duplicates
      await prisma.webhookLog.create({
        data: {
          deliveryId,
          event: event || 'unknown',
          payload: JSON.parse(body)
        }
      });
    }

    if (!signature || !await verifySignature(process.env.GITHUB_WEBHOOK_SECRET!, body, signature)) {
      console.warn('🚨 Webhook signature verification failed');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = JSON.parse(body);

    // 🔌 1. HANDLE INSTALLATION (Connect Repos to DB)
    // This runs when user clicks "Install" on GitHub
    if (event === 'installation' || event === 'installation_repositories') {
      const action = payload.action;

      // Support both "New Install" and "Adding Repos to existing Install"
      if (action === 'created' || action === 'added') {
        const repositories = payload.repositories || payload.repositories_added;
        const installationId = payload.installation.id;
        const senderGithubId = payload.sender.id; // The GitHub User ID

        console.log(`🔌 Installation ${installationId}: Processing ${repositories.length} repos for GitHub User ${senderGithubId}`);

        // Find the user by GitHub ID (using findFirst since githubId is not unique in schema)
        const user = await prisma.user.findFirst({ where: { githubId: senderGithubId } });

        if (!user) {
          console.error(`❌ User not found for GitHub ID ${senderGithubId}. User may need to connect GitHub account in Clerk first.`);
          // Return 200 to prevent GitHub from retrying, but log the error
          // The repositories will be synced when the user's githubId is updated via Clerk webhook
          return new Response('User not found - will sync when GitHub account is connected', { status: 200 });
        }

        // Loop through all selected repos
        for (const repo of repositories) {
          try {
            // Upsert ensures we don't crash if it already exists
            await prisma.repository.upsert({
              where: {
                // We defined this @@unique constraint in schema
                githubRepoId_userId: {
                  githubRepoId: repo.id,
                  userId: user.id
                }
              },
              update: {
                installationId: installationId, // Update install ID if it changed
                name: repo.full_name
              },
              create: {
                githubRepoId: repo.id,
                name: repo.full_name,
                installationId: installationId,
                userId: user.id
              }
            });
            console.log(`✅ Synced repository: ${repo.full_name} for user ${user.id}`);
          } catch (error) {
            console.error(`❌ Error syncing repository ${repo.full_name}:`, error);
          }
        }
        return new Response('Repositories Synced', { status: 200 });
      }
    }

    // 🤖 2. HANDLE PULL REQUEST (Enqueue for background processing)
    if (event === 'pull_request') {
      if (payload.action === 'opened' || payload.action === 'synchronize') {
        const prData = {
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          prNumber: payload.number,
          installationId: payload.installation.id,
          diffUrl: payload.pull_request.diff_url,
          deliveryId
        };

        try {
          // Enqueue background job with Inngest
          await inngest.send({
            name: "github/pull_request.received",
            data: prData
          });

          console.log(`🚀 PR analysis job enqueued for #${prData.prNumber} (${prData.owner}/${prData.repo})`);
          return new Response('Analysis job enqueued', { status: 200 });
        } catch (error) {
          console.error('❌ Failed to enqueue PR analysis job:', error);

          // Mark webhook as failed to process
          if (deliveryId) {
            await prisma.webhookLog.update({
              where: { deliveryId },
              data: {
                processed: false,
                processedAt: new Date(),
                error: error instanceof Error ? error.message : String(error)
              }
            }).catch(console.error);
          }

          return new Response('Failed to enqueue job', { status: 500 });
        }
      }
    }

    return new Response('Ignored', { status: 200 });

  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}