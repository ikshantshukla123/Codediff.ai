import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma, retryDatabaseOperation } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get current user from Clerk
    const clerkUser = await currentUser();

    // Get user from database
    const dbUser = await retryDatabaseOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          repositories: {
            include: {
              analyses: {
                take: 1,
                orderBy: { createdAt: 'desc' }
              }
            }
          }
        }
      });
    });

    // Get GitHub account info
    const githubAccount = clerkUser?.externalAccounts?.find(
      (acc) => acc.provider === 'oauth_github'
    );

    // Count totals
    const [totalUsers, totalRepos, totalAnalyses] = await retryDatabaseOperation(async () => {
      return Promise.all([
        prisma.user.count(),
        prisma.repository.count(),
        prisma.analysis.count()
      ]);
    });

    return Response.json({
      debug: {
        userId,
        clerkUser: clerkUser ? {
          id: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          username: clerkUser.username,
          imageUrl: clerkUser.imageUrl,
          hasGithubAccount: !!githubAccount,
          githubProviderId: (githubAccount as any)?.providerUserId || null
        } : null,
        dbUser: dbUser ? {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          githubId: dbUser.githubId,
          repositoryCount: dbUser.repositories.length,
          repositories: dbUser.repositories.map(repo => ({
            id: repo.id,
            name: repo.name,
            installationId: repo.installationId,
            analysisCount: repo.analyses.length,
            lastAnalysis: repo.analyses[0]?.createdAt || null
          }))
        } : null,
        totals: {
          users: totalUsers,
          repositories: totalRepos,
          analyses: totalAnalyses
        },
        mismatch: {
          userExists: !!dbUser,
          githubConnected: !!githubAccount,
          githubIdMatches: dbUser?.githubId?.toString() === (githubAccount as any)?.providerUserId
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Debug endpoint failed:', error);
    return Response.json({
      error: 'Debug failed',
      details: error.message
    }, { status: 500 });
  }
}