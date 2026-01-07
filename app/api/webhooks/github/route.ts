import { headers } from 'next/headers';
import { verifySignature } from '@/lib/github/utils';
import { analyzePullRequest } from '@/lib/ai/orchestrator';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers(); // Your fix for Next.js 15 is correct ✅

  const signature = headersList.get('x-hub-signature-256');
  const event = headersList.get('x-github-event');

  if (!signature || !await verifySignature(process.env.GITHUB_WEBHOOK_SECRET!, body, signature)) {
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

  // 🤖 2. HANDLE PULL REQUEST (Your Existing Logic)
  if (event === 'pull_request') {
    if (payload.action === 'opened' || payload.action === 'synchronize') {
      const prData = {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        prNumber: payload.number,
        installationId: payload.installation.id,
        diffUrl: payload.pull_request.diff_url
      };

      // Trigger AI
      analyzePullRequest(prData).catch(console.error);

      return new Response('Analysis Queued', { status: 202 });
    }
  }

  return new Response('Ignored', { status: 200 });
}