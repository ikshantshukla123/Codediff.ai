import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Github, Plus, ArrowRight, ShieldAlert, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { syncRepositoriesForUser } from "@/lib/github/client";
import { Button } from "@/components/ui/Button";

// Inline Premium Card
function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

const prisma = new PrismaClient();

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/");

  // 🛡️ SELF-HEALING (Keep your existing sync logic)
  const githubAccount = user.externalAccounts.find((acc) => acc.provider === 'oauth_github');
  const githubId = githubAccount && 'providerUserId' in githubAccount 
    ? parseInt(String((githubAccount as { providerUserId?: string }).providerUserId || '0')) 
    : null;

  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      ...(githubId ? { githubId } : {}) 
    },
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
      githubId: githubId
    }
  });

  const repositories = await prisma.repository.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: { analyses: { take: 1, orderBy: { createdAt: 'desc' } } }
  });

  if (githubId && repositories.length === 0) {
    syncRepositoriesForUser(userId, githubId).catch(console.error);
  }

  // Stats Logic
  const totalRepos = repositories.length;
  const allAnalyses = repositories.flatMap(repo => repo.analyses);
  const avgRiskScore = allAnalyses.length > 0
    ? Math.round(allAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / allAnalyses.length)
    : 0;
  const criticalIssues = allAnalyses.reduce((sum, a) => {
    const bugs = Array.isArray(a.bugs) ? a.bugs : [];
    return sum + bugs.filter((b: any) => b.severity === "HIGH").length;
  }, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10 pb-20">
      
      {/* Hide Scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
    

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Security Overview</h1>
            <p className="text-[#a1a1aa] text-sm mt-2 max-w-lg leading-relaxed">
              Real-time vulnerability monitoring.
            </p>
          </div>
          
          <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
            <Button variant="primary" className="bg-white text-black hover:bg-gray-200 border-0 font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add Repository
            </Button>
          </Link>
        </div>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <GitBranch className="w-24 h-24 text-white" />
            </div>
            <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">Active Repositories</p>
            <p className="text-4xl font-bold text-white mt-4">{totalRepos}</p>
          </PremiumCard>

          <PremiumCard>
            <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">Avg. Risk Score</p>
            <div className="flex items-baseline gap-2 mt-4">
               <p className={`text-4xl font-bold ${avgRiskScore > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                 {avgRiskScore}
               </p>
               <span className="text-sm text-[#525252]">/100</span>
            </div>
          </PremiumCard>

          <PremiumCard className="border-red-900/20 bg-red-950/5">
            <p className="text-sm font-medium text-red-400 uppercase tracking-wider">Critical Vulnerabilities</p>
            <p className="text-4xl font-bold text-red-500 mt-4">{criticalIssues}</p>
          </PremiumCard>
        </div>

        {/* 🚀 SCROLLABLE REPOSITORY LIST */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Repositories</h2>
                <div className="flex gap-2">
                   <div className="text-xs text-[#525252] font-mono bg-[#111] px-2 py-1 rounded border border-[#262626]">
                      Scroll to view more →
                   </div>
                </div>
            </div>

            {repositories.length === 0 ? (
               <div className="border border-dashed border-[#262626] rounded-xl p-12 text-center bg-[#0a0a0a]">
                  <h3 className="text-lg text-white mb-2">No repositories connected</h3>
                  <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
                      <Button variant="outline">Connect GitHub</Button>
                  </Link>
               </div>
            ) : (
               /* The Scrollable Container */
               <div className="
                 flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide 
                 -mx-6 px-6
               ">
                  {repositories.map((repo) => {
                    const lastScan = repo.analyses[0];
                    const riskScore = lastScan?.riskScore || 0;
                    const securityScore = 100 - riskScore;
                    
                    let statusColor = riskScore > 70 ? "text-red-500" : riskScore > 40 ? "text-yellow-500" : "text-emerald-500";
                    let statusBg = riskScore > 70 ? "bg-red-500/10" : riskScore > 40 ? "bg-yellow-500/10" : "bg-emerald-500/10";
                    let statusBorder = riskScore > 70 ? "border-red-500/20" : riskScore > 40 ? "border-yellow-500/20" : "border-emerald-500/20";
                    let statusText = riskScore > 70 ? "Critical" : riskScore > 40 ? "Warning" : "Secure";

                    return (
                        <Link 
                           key={repo.id} 
                           href={`/dashboard/${repo.id}`} 
                           className="
                             snap-start flex-shrink-0 
                             w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]
                           "
                        >
                            <PremiumCard className="h-full flex flex-col justify-between group hover:border-[#525252] transition-colors cursor-pointer hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="p-2 bg-[#1a1a1a] rounded border border-[#262626] shrink-0">
                                                <Github className="w-4 h-4 text-white" />
                                            </div>
                                            {/* 👇 THE FIX: Added 'break-all' and removed truncate/max-w */}
                                            <span className="font-medium text-white break-all leading-tight">
                                                {repo.name}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border whitespace-nowrap ml-2 ${statusColor} ${statusBg} ${statusBorder}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between items-end">
                                            <div className="text-xs font-medium text-[#525252] uppercase tracking-wider">Score</div>
                                            <div className="text-xl font-bold text-white">{securityScore}%</div>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${securityScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#262626] flex justify-between items-center">
                                    <span className="text-xs text-[#525252] font-mono">
                                        {lastScan ? new Date(lastScan.createdAt).toLocaleDateString() : "No scans"}
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-[#525252] group-hover:text-white transition-colors" />
                                </div>
                            </PremiumCard>
                        </Link>
                    );
                  })}
               </div>
            )}
        </div>

      </main>
    </div>
  );
}