"use client";

import { useState, useEffect } from "react";
import { Github, Plus, ArrowRight, ShieldAlert, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Inline Premium Card
function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-12 py-12">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="h-10 w-32 bg-[#1a1a1a] rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
          <div className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
        </div>

        <div className="h-64 bg-[#1a1a1a] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

interface Repository {
  id: string;
  name: string;
  createdAt: string;
  analyses: {
    riskScore: number;
    createdAt: string;
  }[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(res => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then(data => {
        if (data) setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  const { repositories = [], stats = {} } = data;
  const { totalRepos = 0, avgRiskScore = 0, highRisk = 0 } = stats;
  const criticalIssues = highRisk;

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
              <Link href="/dashboard/repositories">
                <Button variant="outline" size="sm" className="h-8 text-xs border-[#262626] text-[#a1a1aa] hover:text-white">
                  View All Repositories <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {repositories.length === 0 ? (
            <div className="border border-dashed border-[#262626] rounded-xl p-12 text-center bg-[#0a0a0a]">
              <h3 className="text-lg text-white mb-2">No repositories connected</h3>
              <Link href={process.env.NEXT_PUBLIC_GITHUB_INSTALL_URL || "#"}>
                <Button variant="outline">Connect repo</Button>
              </Link>
            </div>
          ) : (
            /* The Scrollable Container */
            <div className="
                 flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide 
                 -mx-6 px-6
               ">
              {repositories.map((repo: Repository) => {
                const lastScan = repo.analyses?.[0];
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

        {/* Recent Scans */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>

          <div className="bg-[#111] border border-[#262626] rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 p-4 border-b border-[#262626] text-xs font-medium text-[#525252] uppercase tracking-wider bg-[#0f0f0f]">
              <div className="pl-2">Repository</div>
              <div>Context</div>
              <div>Risk Score</div>
              <div className="text-right pr-2">Date</div>
            </div>

            {/* Rows */}
            {data.recentAnalyses?.map((analysis: any) => (
              <Link key={analysis.id} href={`/dashboard/${analysis.repository.id}/scan/${analysis.id}`} className="grid grid-cols-4 p-4 border-b border-[#262626] last:border-0 hover:bg-[#1a1a1a] transition-colors items-center group">
                <div className="flex items-center gap-3 font-medium text-white px-2">
                  <Github className="w-4 h-4 text-[#525252]" />
                  <span className="truncate">{analysis.repository.name}</span>
                </div>
                <div className="text-sm text-[#a1a1aa] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#525252]" />
                  <span className="font-mono text-xs">PR #{analysis.prNumber || 'MANUAL'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${analysis.riskScore > 70 ? 'bg-red-500' : analysis.riskScore > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                    <span className={`text-sm font-medium ${analysis.riskScore > 70 ? 'text-red-400' :
                      analysis.riskScore > 40 ? 'text-yellow-400' :
                        'text-emerald-400'
                      }`}>
                      {analysis.riskScore > 70 ? 'High Risk' : analysis.riskScore > 40 ? 'Medium Risk' : 'Low Risk'}
                    </span>
                    <span className="text-xs text-[#525252] ml-1">({analysis.riskScore}/100)</span>
                  </div>
                </div>
                <div className="text-right text-xs text-[#525252] font-mono pr-2">
                  {new Date(analysis.createdAt).toLocaleDateString()} {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </Link>
            ))}
            {(!data.recentAnalyses || data.recentAnalyses.length === 0) && (
              <div className="p-12 text-center">
                <ShieldAlert className="w-8 h-8 text-[#262626] mx-auto mb-3" />
                <p className="text-[#525252] text-sm">No recent scans found.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}