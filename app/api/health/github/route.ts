import { auth } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

// Health check for GitHub App configuration
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      GITHUB_APP_ID: !!process.env.GITHUB_APP_ID,
      GITHUB_PRIVATE_KEY: !!process.env.GITHUB_PRIVATE_KEY,
      GITHUB_PRIVATE_KEY_LENGTH: process.env.GITHUB_PRIVATE_KEY?.length || 0,
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
    },
    githubApp: {
      configured: false,
      canListInstallations: false,
      installationCount: 0,
      error: null as string | null
    }
  };

  // Try to authenticate with GitHub
  if (process.env.GITHUB_APP_ID && process.env.GITHUB_PRIVATE_KEY) {
    checks.githubApp.configured = true;

    try {
      const appClient = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.GITHUB_APP_ID,
          privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
      });

      const { data: installations } = await appClient.rest.apps.listInstallations();
      checks.githubApp.canListInstallations = true;
      checks.githubApp.installationCount = installations.length;
    } catch (error: any) {
      checks.githubApp.error = error.message;
    }
  }

  return Response.json(checks);
}
