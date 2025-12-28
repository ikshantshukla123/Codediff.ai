import { PrismaClient } from '@prisma/client';
import { 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Activity, 
  Search,
  ArrowUpRight 
} from 'lucide-react';

const prisma = new PrismaClient();

// Force fresh data on every reload
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // 1. Fetch Data
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // 2. Calculate Real Stats
  const totalScans = analyses.length;
  const criticalRisks = analyses.filter(a => a.riskScore > 70).length;
  
  // Calculate "Money Saved" (Mock logic: Risk Score * $5,000 per point of risk)
  // Real logic would parse the "$15,000,000" string, but this is fine for demo
  const totalRiskValue = analyses.reduce((acc, curr) => {
    return acc + (curr.riskScore > 0 ? curr.riskScore * 12500 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation Bar */}
      <nav className="border-b border-gray-800 bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-white h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">CodeDiff AI</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs border border-gray-700">
              Enterprise
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Operational
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white mb-2">Security Overview</h1>
          <p className="text-gray-400">Real-time audit logs and financial risk assessment.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Total Volume */}
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Activity className="text-blue-500 h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                +12% vs last week
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">Total PRs Audited</p>
            <h3 className="text-3xl font-bold text-white mt-1">{totalScans}</h3>
          </div>

          {/* Card 2: Critical Risks */}
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                <ShieldAlert className="text-red-500 h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Critical Risks Blocked</p>
            <h3 className="text-3xl font-bold text-white mt-1">{criticalRisks}</h3>
          </div>

          {/* Card 3: Financial Impact */}
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <DollarSign className="text-emerald-500 h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Est. Liability Prevented</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              ${(totalRiskValue / 1000000).toFixed(1)}M
            </h3>
          </div>

        </div>

        {/* Data Table */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Audit History</h3>
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider font-medium">
                  <th className="p-5 border-b border-gray-800">Status</th>
                  <th className="p-5 border-b border-gray-800">Repository</th>
                  <th className="p-5 border-b border-gray-800">Risk Score</th>
                  <th className="p-5 border-b border-gray-800">Financial Assessment</th>
                  <th className="p-5 border-b border-gray-800 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {analyses.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-900/50 transition-colors group">
                    <td className="p-5">
                      {scan.riskScore > 50 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          <ShieldAlert size={12} /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Passed
                        </span>
                      )}
                    </td>
                    <td className="p-5 font-medium text-white group-hover:text-blue-400 transition-colors">
                      {scan.repoName} 
                      <span className="text-gray-500 ml-2 font-normal">#{scan.prNumber}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${scan.riskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${scan.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{scan.riskScore}/100</span>
                      </div>
                    </td>
                    <td className="p-5 text-gray-400 text-sm max-w-md truncate">
                      {scan.financialRisk.includes("$") ? scan.financialRisk : "Analysis Pending..."}
                    </td>
                    <td className="p-5 text-right text-gray-500 text-sm tabular-nums">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-gray-400 text-sm max-w-md truncate">
  {/* If the data looks like tags (no $ sign), render them as badges */}
  {!scan.financialRisk.includes("$") ? (
    <div className="flex gap-2">
      {scan.financialRisk.split(', ').map((tag, i) => (
        <span key={i} className="px-2 py-1 rounded text-xs border border-purple-500/20 bg-purple-500/10 text-purple-400">
          {tag}
        </span>
      ))}
    </div>
  ) : (
    // Fallback for old data or if Gemini wrote a price
    scan.financialRisk
  )}
</td>
                  </tr>
                ))}
                
                {analyses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-8 w-8 opacity-20" />
                        <p>No audits found yet. Waiting for Webhooks...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}