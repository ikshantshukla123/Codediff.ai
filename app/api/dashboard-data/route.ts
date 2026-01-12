import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.time('dashboard-data-total');
  console.time('auth-check');
  const { userId } = await auth();
  console.timeEnd('auth-check');

  if (!userId) {
    console.timeEnd('dashboard-data-total');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.time('parallel-db-queries');
  const [repos, recentAnalyses, totalAnalyses, totalReposCount, highRiskCount] = await Promise.all([
    // Only essential repository data
    (async () => {
      console.time('query-repositories');
      const result = await prisma.repository.findMany({
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
      });
      console.timeEnd('query-repositories');
      return result;
    })(),

    // Recent analyses with minimal data
    (async () => {
      console.time('query-recent-analyses');
      const result = await prisma.analysis.findMany({
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
      });
      console.timeEnd('query-recent-analyses');
      return result;
    })(),

    // Count for stats
    (async () => {
      console.time('query-analysis-aggregate');
      const result = await prisma.analysis.aggregate({
        where: { repository: { userId } },
        _count: true,
        _avg: { riskScore: true }
      });
      console.timeEnd('query-analysis-aggregate');
      return result;
    })(),

    // Total Repos Count
    (async () => {
      console.time('query-total-repos-count');
      const result = await prisma.repository.count({ where: { userId } });
      console.timeEnd('query-total-repos-count');
      return result;
    })(),

    // High Risk Analyses Count
    (async () => {
      console.time('query-high-risk-count');
      const result = await prisma.analysis.count({ 
        where: { repository: { userId }, riskScore: { gt: 70 } } 
      });
      console.timeEnd('query-high-risk-count');
      return result;
    })()
  ]);
  console.timeEnd('parallel-db-queries');

  console.time('response-preparation');
  const response = Response.json({
    repositories: repos,
    recentAnalyses,
    stats: {
      totalRepos: totalReposCount,
      totalAnalyses: totalAnalyses._count,
      avgRiskScore: Math.round(totalAnalyses._avg.riskScore || 0),
      highRisk: highRiskCount
    }
  });
  console.timeEnd('response-preparation');
  
  console.timeEnd('dashboard-data-total');
  return response;
}
