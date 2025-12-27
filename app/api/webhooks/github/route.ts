import { headers } from 'next/headers';
import { verifySignature } from '@/lib/github/utils';
import { analyzePullRequest } from '@/lib/ai/orchestrator';

export async function POST(req: Request) {
  const body = await req.text();
  
  // 🚨 FIX: Add 'await' here because headers() is now async in Next.js 15
  const headersList = await headers(); 
  
  const signature = headersList.get('x-hub-signature-256');
  const event = headersList.get('x-github-event');

  if (!signature || !await verifySignature(process.env.GITHUB_WEBHOOK_SECRET!, body, signature)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = JSON.parse(body);

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