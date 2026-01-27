import { auth, currentUser } from "@clerk/nextjs/server";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

// Debug endpoint to check GitHub sync status
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const clerkUser = await currentUser();
    const githubAccount = clerkUser?.externalAccounts?.find(
      (acc) => acc.provider === 'oauth_github'
    );
    const userGithubId = (githubAccount as any)?.providerUserId
      ? parseInt((githubAccount as any).providerUserId)
      : null;

    // Get all GitHub App installations
    const appClient = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID!,
        privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
    });

    const { data: installations } = await appClient.rest.apps.listInstallations();

    const debug = {
      clerk: {
        userId,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        githubUsername: (githubAccount as any)?.username,
        githubId: userGithubId,
        githubConnected: !!githubAccount,
      },
      githubApp: {
        totalInstallations: installations.length,
        installations: installations.map(inst => ({
          id: inst.id,
          accountId: inst.account?.id,
          accountLogin: inst.account?.login,
          accountType: inst.account?.type,
          matchesUser: inst.account?.id === userGithubId
        })),
        userInstallationFound: installations.some(
          inst => inst.account?.id === userGithubId
        )
      },
      recommendation: null as string | null
    };

    // Provide recommendation
    if (!userGithubId) {
      debug.recommendation = "GitHub not connected to Clerk account. Please reconnect.";
    } else if (!debug.githubApp.userInstallationFound) {
      debug.recommendation = `No installation found for GitHub ID ${userGithubId}. Install the app at: ${process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL}`;
    } else {
      debug.recommendation = "Everything looks good! Installation found.";
    }

    return Response.json(debug, { status: 200 });

  } catch (error: any) {
    return Response.json({
      error: error.message,
      stack: error.stack,
      hint: "Check if GITHUB_APP_ID and GITHUB_PRIVATE_KEY are set in production"
    }, { status: 500 });
  }
}
