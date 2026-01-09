import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma, retryDatabaseOperation } from "@/lib/prisma";
import { syncRepositoriesForUser } from "@/lib/github/client";

// Manual user sync endpoint
export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get current user data from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return Response.json({ error: 'User data not available' }, { status: 400 });
    }

    // Extract GitHub information
    const githubAccount = clerkUser.externalAccounts?.find(
      (acc) => acc.provider === 'oauth_github'
    );
    const githubId = (githubAccount as any)?.providerUserId ? parseInt((githubAccount as any).providerUserId) : null;

    // Get the best possible name
    const primaryName = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
      : clerkUser.username || 'Unknown User';

    console.log(`🔄 Manual user sync for ${primaryName} (GitHub ID: ${githubId})`);

    // Upsert user data
    await retryDatabaseOperation(async () => {
      return await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: primaryName,
          avatar: clerkUser.imageUrl,
          githubId: githubId
        },
        create: {
          id: userId,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: primaryName,
          avatar: clerkUser.imageUrl,
          githubId: githubId
        }
      });
    });

    let repositoryCount = 0;

    // Sync repositories if GitHub is connected
    if (githubId) {
      await syncRepositoriesForUser(userId, githubId);

      // Get repository count
      repositoryCount = await retryDatabaseOperation(async () => {
        return await prisma.repository.count({
          where: { userId }
        });
      });
    }

    return Response.json({
      success: true,
      user: {
        id: userId,
        name: primaryName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        githubConnected: !!githubId,
        githubId: githubId
      },
      repositoryCount
    });

  } catch (error: any) {
    console.error('❌ User sync failed:', error);
    return Response.json({
      error: 'Failed to sync user data',
      details: error.message
    }, { status: 500 });
  }
}