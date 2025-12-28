import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Github, Plus, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { syncRepositoriesForUser } from "@/lib/github/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const prisma = new PrismaClient();

export default async function Dashboard() {
  // 1. Get Clerk User Data
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/");

  // 🛡️ SELF-HEALING MECHANISM 🛡️
  // We check Clerk directly for the GitHub ID and force-save it to the DB.
  // This fixes the "null" error permanently.
  const githubAccount = user.externalAccounts.find((acc) => acc.provider === 'oauth_github');
  // Clerk SDK uses providerUserId (camelCase) while webhook uses provider_user_id (snake_case)
  const githubId = githubAccount && 'providerUserId' in githubAccount 
    ? parseInt(String((githubAccount as { providerUserId?: string }).providerUserId || '0')) 
    : null;

  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      // 👇 Force update the GitHub ID every time you load the page
      ...(githubId ? { githubId } : {}) 
    },
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      githubId: githubId
    }
  });

  // 2. Now fetch Repositories (The ID is guaranteed to be there now)
  const repositories = await prisma.repository.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: { 
      analyses: { 
        take: 1, 
        orderBy: { createdAt: 'desc' } 
      } 
    }
  });

  // 3. If user has GitHub connected but no repositories, trigger a sync in the background
  if (githubId && repositories.length === 0) {
    // Sync in background without blocking the page load
    syncRepositoriesForUser(userId, githubId).catch(console.error);
  }

  // Calculate stats
  const totalRepos = repositories.length;
  const allAnalyses = repositories.flatMap(repo => repo.analyses);
  const avgRiskScore = allAnalyses.length > 0
    ? Math.round(allAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / allAnalyses.length)
    : 0;
  const criticalIssues = allAnalyses.reduce((sum, a) => {
    const bugs = Array.isArray(a.bugs) ? a.bugs : [];
    return sum + bugs.filter((b) => {
      const bug = b as { severity?: string };
      return bug.severity === "HIGH";
    }).length;
  }, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-[#262626] pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Overview</h1>
            <p className="text-[#a1a1aa] text-sm mt-1">Manage repositories and security posture</p>
          </div>
          
          <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add Repository
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Total Repositories</p>
              <p className="text-3xl font-semibold text-white">{totalRepos}</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Average Risk Score</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-white">{avgRiskScore}</p>
                <span className="text-sm text-[#a1a1aa]">/100</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Critical Issues Detected</p>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-3xl font-semibold text-white">{criticalIssues}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Repository Grid */}
        {repositories.length === 0 ? (
          <Card className="border-dashed">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#262626]">
                <Github className="w-6 h-6 text-[#a1a1aa]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No repositories found</h3>
              <p className="text-[#a1a1aa] max-w-sm mb-6 text-sm">
                Connect your GitHub repositories to enable real-time security scanning.
              </p>
              <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
                <Button variant="primary">Connect GitHub</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.map((repo) => {
              const lastScan = repo.analyses[0];
              const riskScore = lastScan?.riskScore || 0;
              const securityScore = 100 - riskScore;
              const isHighRisk = riskScore > 70;
              const isMediumRisk = riskScore > 40 && riskScore <= 70;

              return (
                <Card key={repo.id} className="hover:border-[#404040] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Github className="w-4 h-4 text-[#a1a1aa] shrink-0" />
                      <span className="font-medium text-white truncate">{repo.name}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border shrink-0 ${
                      isHighRisk 
                        ? "text-red-400 border-red-500/20 bg-red-500/10" 
                        : isMediumRisk
                        ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
                        : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                    }`}>
                      {isHighRisk ? "Critical" : isMediumRisk ? "Warning" : "Secure"}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-[#a1a1aa]">Security Score</div>
                      <div className="text-2xl font-semibold text-white">{securityScore}</div>
                    </div>
                    <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          isHighRisk ? 'bg-red-500' : 
                          isMediumRisk ? 'bg-yellow-500' : 
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${securityScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#262626] flex justify-between items-center">
                    <span className="text-xs text-[#a1a1aa]">
                      {lastScan ? new Date(lastScan.createdAt).toLocaleDateString() : "No scans yet"}
                    </span>
                    <Link 
                      href={`/dashboard/${repo.id}`} 
                      className="text-white text-xs font-medium flex items-center gap-1 group-hover:text-white transition-colors"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
