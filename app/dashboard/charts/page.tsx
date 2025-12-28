import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { TrendingUp, AlertCircle, ShieldCheck, Activity, GitBranch } from "lucide-react";

const prisma = new PrismaClient();

// --- 🛠️ HELPER: SVG CHART GENERATORS ---

function TrendChart({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="h-full w-full bg-[#111] rounded flex items-center justify-center text-xs text-gray-600">Not enough data</div>;

  const height = 60;
  const width = 200;
  const max = Math.max(...data, 100);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <polyline fill="none" stroke="#525252" strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <polyline fill="url(#gradient)" stroke="none" points={`${points} ${width},${height} 0,${height}`} opacity="0.2" />
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#525252" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DistributionBar({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="group">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-gray-200 tabular-nums">{count} <span className="text-gray-600">({Math.round(percentage)}%)</span></span>
      </div>
      <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// --- 📄 MAIN PAGE COMPONENT ---

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 1. Fetch Data
  const repositories = await prisma.repository.findMany({
    where: { userId },
    include: { analyses: { orderBy: { createdAt: "desc" } } }
  });

  // 2. SORT REPOSITORIES BY RECENT ACTIVITY 👇
  // We compare the date of the first analysis (which is the latest due to the query above)
  const sortedRepositories = [...repositories].sort((a, b) => {
    const dateA = a.analyses[0]?.createdAt ? new Date(a.analyses[0].createdAt).getTime() : 0;
    const dateB = b.analyses[0]?.createdAt ? new Date(b.analyses[0].createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (Newest first)
  });

  // 3. Process Stats
  const allAnalyses = repositories.flatMap(repo => repo.analyses);
  const totalScans = allAnalyses.length;
  const avgRiskScore = totalScans > 0
    ? Math.round(allAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / totalScans)
    : 0;
  const totalIssues = allAnalyses.reduce((sum, a) => sum + a.issuesFound, 0);

  const vulnerableCount = allAnalyses.filter(a => a.status === "VULNERABLE").length;
  const warningCount = allAnalyses.filter(a => a.status === "WARNING").length;
  const secureCount = allAnalyses.filter(a => a.status === "SECURE").length;
  const trendData = allAnalyses.slice(0, 14).reverse().map(a => a.riskScore);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Minimal Header */}
        <div className="flex justify-between items-end border-b border-[#262626] pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Analytics</h1>
            <p className="text-[#737373] text-sm mt-1">Security posture performance and trends.</p>
          </div>
          <div className="text-right">
             <div className="text-xs text-[#525252] font-mono uppercase tracking-wider mb-1">Overall Health</div>
             <div className={`text-sm font-medium px-2 py-0.5 rounded border inline-block ${
                avgRiskScore > 70 ? 'text-red-400 border-red-900/30 bg-red-900/10' : 
                avgRiskScore > 40 ? 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10' : 
                'text-emerald-400 border-emerald-900/30 bg-emerald-900/10'
             }`}>
                {avgRiskScore > 70 ? 'Critical' : avgRiskScore > 40 ? 'Moderate' : 'Healthy'}
             </div>
          </div>
        </div>

        {/* 📊 KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-[#262626] p-5 rounded-lg">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[#737373] text-xs font-medium uppercase tracking-wider">Total Scans</span>
               <Activity className="w-4 h-4 text-[#525252]" />
            </div>
            <div className="text-3xl font-bold text-white tabular-nums">{totalScans}</div>
          </div>

          <div className="bg-[#111] border border-[#262626] p-5 rounded-lg">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[#737373] text-xs font-medium uppercase tracking-wider">Avg Risk Score</span>
               <TrendingUp className="w-4 h-4 text-[#525252]" />
            </div>
            <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white tabular-nums">{avgRiskScore}</div>
                <span className="text-sm text-[#525252]">/100</span>
            </div>
          </div>

          <div className="bg-[#111] border border-[#262626] p-5 rounded-lg">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[#737373] text-xs font-medium uppercase tracking-wider">Issues Found</span>
               <AlertCircle className="w-4 h-4 text-[#525252]" />
            </div>
            <div className="text-3xl font-bold text-white tabular-nums">{totalIssues}</div>
          </div>

          <div className="bg-[#111] border border-[#262626] p-5 rounded-lg">
             <div className="flex justify-between items-start mb-4">
               <span className="text-[#737373] text-xs font-medium uppercase tracking-wider">Repositories</span>
               <GitBranch className="w-4 h-4 text-[#525252]" />
            </div>
            <div className="text-3xl font-bold text-white tabular-nums">{repositories.length}</div>
          </div>
        </div>

        {/* 📈 CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#111] border border-[#262626] rounded-lg p-6">
             <div className="mb-6">
                <h3 className="text-white font-medium">Risk Trend</h3>
                <p className="text-[#737373] text-xs mt-1">Fluctuation in risk scores over the last 14 scans.</p>
             </div>
             <div className="h-[120px] w-full"><TrendChart data={trendData} /></div>
             <div className="flex justify-between text-[10px] text-[#525252] mt-2 font-mono uppercase">
                <span>Oldest</span>
                <span>Latest Scan</span>
             </div>
          </div>

          <div className="bg-[#111] border border-[#262626] rounded-lg p-6 flex flex-col justify-center">
            <h3 className="text-white font-medium mb-6">Risk Distribution</h3>
            <div className="space-y-5">
               <DistributionBar label="Critical (≥70)" count={vulnerableCount} total={totalScans} color="bg-red-500" />
               <DistributionBar label="Warning (40-69)" count={warningCount} total={totalScans} color="bg-yellow-500" />
               <DistributionBar label="Secure (<40)" count={secureCount} total={totalScans} color="bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* 📋 REPOSITORY LIST (Sorted by Recent Activity) */}
        <div>
           <h3 className="text-lg font-semibold text-white mb-4">Repository Performance</h3>
           <div className="bg-[#111] border border-[#262626] rounded-lg overflow-hidden flex flex-col">
             
             {/* Sticky Table Header */}
             <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#262626] bg-[#161616] text-xs font-medium text-[#737373] uppercase tracking-wider z-10 sticky top-0">
               <div className="col-span-5">Name</div>
               <div className="col-span-2 text-right">Scans</div>
               <div className="col-span-3 text-right">Avg. Risk</div>
               <div className="col-span-2 text-right">Last Audit</div>
             </div>

             {/* SCROLLABLE ROWS CONTAINER */}
             <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
               {sortedRepositories.length === 0 ? (
                  <div className="p-8 text-center text-[#525252] text-sm">No repositories found.</div>
               ) : (
                  sortedRepositories.map((repo) => {
                    const repoAnalyses = repo.analyses;
                    const repoAvgRisk = repoAnalyses.length > 0 
                      ? Math.round(repoAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / repoAnalyses.length)
                      : 0;
                    
                    return (
                      <div key={repo.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[#262626] last:border-0 hover:bg-[#161616] transition-colors items-center text-sm">
                         <div className="col-span-5 font-medium text-white truncate">{repo.name}</div>
                         <div className="col-span-2 text-right text-gray-400 tabular-nums">{repoAnalyses.length}</div>
                         <div className="col-span-3 text-right flex justify-end">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium tabular-nums border ${
                                repoAvgRisk > 70 ? 'text-red-400 border-red-900/30 bg-red-900/10' : 
                                repoAvgRisk > 40 ? 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10' : 
                                'text-emerald-400 border-emerald-900/30 bg-emerald-900/10'
                            }`}>
                              {repoAvgRisk}
                            </span>
                         </div>
                         <div className="col-span-2 text-right text-[#737373] text-xs font-mono">
                            {repoAnalyses[0] ? new Date(repoAnalyses[0].createdAt).toLocaleDateString() : '-'}
                         </div>
                      </div>
                    );
                  })
               )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}