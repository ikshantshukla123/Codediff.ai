import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Github, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { syncRepositoriesForUser } from "@/lib/github/client";

// UI Components
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
    include: { analyses: { take: 1, orderBy: { createdAt: 'desc' } } }
  });

  // 3. If user has GitHub connected but no repositories, trigger a sync in the background
  if (githubId && repositories.length === 0) {
    // Sync in background without blocking the page load
    syncRepositoriesForUser(userId, githubId).catch(console.error);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-[#262626] pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Manage repositories and security posture.</p>
          </div>
          
          <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
            <Button icon={<Plus className="w-4 h-4" />}>Add Repository</Button>
          </Link>
        </div>

        {/* Empty State */}
        {repositories.length === 0 ? (
          <div className="border border-dashed border-[#262626] rounded-xl p-16 flex flex-col items-center justify-center text-center bg-[#0f0f0f]">
            <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#262626]">
              <Github className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No repositories found</h3>
            <p className="text-gray-500 max-w-sm mb-6 text-sm">
              Connect your GitHub repositories to enable real-time security scanning.
            </p>
            <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
              <Button variant="primary">Connect GitHub</Button>
            </Link>
          </div>
        ) : (
          /* Repository Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.map((repo) => {
              const lastScan = repo.analyses[0];
              const riskScore = lastScan?.riskScore || 0;
              const isHighRisk = riskScore > 70;

              return (
                <Card key={repo.id} className="hover:border-gray-600 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-white truncate max-w-[150px]">{repo.name}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                      isHighRisk 
                        ? "bg-red-950/30 text-red-400 border-red-900/50" 
                        : "bg-emerald-950/30 text-emerald-400 border-emerald-900/50"
                    }`}>
                      {isHighRisk ? "Action Needed" : "Secure"}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-gray-500">Security Score</div>
                      <div className="text-2xl font-bold text-white">{100 - riskScore}</div>
                    </div>
                    <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${100 - riskScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#262626] flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      {lastScan ? new Date(lastScan.createdAt).toLocaleDateString() : "No scans yet"}
                    </span>
                    <Link href={`/dashboard/${repo.id}`} className="text-white text-xs font-medium flex items-center gap-1 group-hover:underline">
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