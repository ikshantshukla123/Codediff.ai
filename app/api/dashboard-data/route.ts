import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Use unique request ID for timing labels to avoid conflicts in concurrent requests
  const reqId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  const { userId } = await auth();
  const authTime = Date.now() - startTime;

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const queryStart = Date.now();
  const [repos, recentAnalyses, totalAnalyses, totalReposCount, highRiskCount] = await Promise.all([
    // Only essential repository data
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
      take: 8 // User requested 8 recent repos
    }),

    // Recent analyses with minimal data
    prisma.analysis.findMany({
      where: {
        repository: { userId }
      },
      select: {
        id: true,
        prNumber: true,
        riskScore: true,
        status: true,
        createdAt: true,
        repository: {
          select: { name: true, id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 6 // User requested 6 recent scans
    }),

    // Count for stats
    prisma.analysis.aggregate({
      where: { repository: { userId } },
      _count: true,
      _avg: { riskScore: true }
    }),

    // Total Repos Count
    prisma.repository.count({ where: { userId } }),

    // High Risk Analyses Count
    prisma.analysis.count({
      where: { repository: { userId }, riskScore: { gt: 70 } }
    })
  ]);

  const queryTime = Date.now() - queryStart;
  const totalTime = Date.now() - startTime;

  // Log performance metrics without duplicate labels
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dashboard API ${reqId}] Auth: ${authTime}ms | Queries: ${queryTime}ms | Total: ${totalTime}ms`);
  }

  return Response.json({
    repositories: repos,
    recentAnalyses,
    stats: {
      totalRepos: totalReposCount,
      totalAnalyses: totalAnalyses._count,
      avgRiskScore: Math.round(totalAnalyses._avg.riskScore || 0),
      highRisk: highRiskCount
    }
  });
}
