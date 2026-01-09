import { auth } from "@clerk/nextjs/server";
import { prisma, retryDatabaseOperation } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { syncRepositoriesForUser } from "@/lib/github/client";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  const [repos, total] = await retryDatabaseOperation(async () => {
    return Promise.all([
      prisma.repository.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              riskScore: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.repository.count({
        where: { userId }
      })
    ]);
  });

  return Response.json({
    repositories: repos,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      current: page
    }
  });
}

// POST endpoint to manually sync repositories
export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Get user's GitHub ID from database
    const user = await retryDatabaseOperation(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: { githubId: true, name: true }
      });
    });

    if (!user) {
      return Response.json({
        error: 'User not found',
        suggestion: 'Please make sure you are signed in properly'
      }, { status: 404 });
    }

    if (!user.githubId) {
      return Response.json({
        error: 'GitHub account not connected',
        suggestion: 'Please connect your GitHub account in your profile settings'
      }, { status: 400 });
    }

    console.log(`🔄 Manual sync requested for user ${userId} (${user.name}) with GitHub ID ${user.githubId}`);

    // Sync repositories
    await syncRepositoriesForUser(userId, user.githubId);

    // Get updated repository count
    const repoCount = await retryDatabaseOperation(async () => {
      return await prisma.repository.count({
        where: { userId }
      });
    });

    return Response.json({
      success: true,
      message: `Successfully synced repositories`,
      repositoryCount: repoCount
    });

  } catch (error: any) {
    console.error('❌ Manual sync failed:', error);
    return Response.json({
      error: 'Failed to sync repositories',
      details: error.message
    }, { status: 500 });
  }
}
