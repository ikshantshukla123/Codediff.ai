import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { TrendingUp, AlertTriangle, Shield, BarChart3, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

const prisma = new PrismaClient();

export default async function ChartsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  // Fetch all analyses for the user's repositories
  const repositories = await prisma.repository.findMany({
    where: { userId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  // Calculate statistics
  const allAnalyses = repositories.flatMap(repo => repo.analyses);
  const totalScans = allAnalyses.length;
  const vulnerableScans = allAnalyses.filter(a => a.status === "VULNERABLE").length;
  const warningScans = allAnalyses.filter(a => a.status === "WARNING").length;
  const secureScans = allAnalyses.filter(a => a.status === "SECURE").length;
  
  const avgRiskScore = totalScans > 0
    ? Math.round(allAnalyses.reduce((sum, a) => sum + a.riskScore, 0) / totalScans)
    : 0;

  const totalIssues = allAnalyses.reduce((sum, a) => sum + a.issuesFound, 0);

  // Risk score distribution
  const riskDistribution = {
    low: allAnalyses.filter(a => a.riskScore < 40).length,
    medium: allAnalyses.filter(a => a.riskScore >= 40 && a.riskScore < 70).length,
    high: allAnalyses.filter(a => a.riskScore >= 70).length,
  };

  // Recent scans (last 10)
  const recentScans = allAnalyses.slice(0, 10);

  // Repository statistics
  const repoStats = repositories.map(repo => ({
    name: repo.name,
    scanCount: repo.analyses.length,
    avgRisk: repo.analyses.length > 0
      ? Math.round(repo.analyses.reduce((sum, a) => sum + a.riskScore, 0) / repo.analyses.length)
      : 0,
    lastScan: repo.analyses[0]?.createdAt || null
  })).sort((a, b) => b.scanCount - a.scanCount);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#262626] pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
          <p className="text-gray-500 text-sm">Comprehensive security analysis overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 border-blue-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-white">{totalScans}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-950/20 to-red-900/10 border-red-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Vulnerable</p>
                <p className="text-3xl font-bold text-white">{vulnerableScans}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-950/20 to-yellow-900/10 border-yellow-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Warnings</p>
                <p className="text-3xl font-bold text-white">{warningScans}</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 border-emerald-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Secure</p>
                <p className="text-3xl font-bold text-white">{secureScans}</p>
              </div>
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
          </Card>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Risk Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Average Risk Score</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Overall Average</span>
                  <span className="text-2xl font-bold text-white">{avgRiskScore}/100</span>
                </div>
                <div className="h-3 w-full bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      avgRiskScore > 70 ? 'bg-red-500' : avgRiskScore > 40 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${avgRiskScore}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-[#262626]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security Score</span>
                  <span className="text-white font-semibold">{100 - avgRiskScore}/100</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Risk Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">High Risk (≥70)</span>
                  <span className="text-red-400 font-semibold">{riskDistribution.high}</span>
                </div>
                <div className="h-2 w-full bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${totalScans > 0 ? (riskDistribution.high / totalScans) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Medium Risk (40-69)</span>
                  <span className="text-yellow-400 font-semibold">{riskDistribution.medium}</span>
                </div>
                <div className="h-2 w-full bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${totalScans > 0 ? (riskDistribution.medium / totalScans) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Low Risk (&lt;40)</span>
                  <span className="text-emerald-400 font-semibold">{riskDistribution.low}</span>
                </div>
                <div className="h-2 w-full bg-[#262626] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500"
                    style={{ width: `${totalScans > 0 ? (riskDistribution.low / totalScans) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Repository Performance */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Repository Performance</h2>
          {repoStats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No repository data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repoStats.map((repo, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                  <div className="flex-1">
                    <p className="text-white font-medium">{repo.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {repo.scanCount} scan{repo.scanCount !== 1 ? 's' : ''} • 
                      {repo.lastScan ? ` Last: ${new Date(repo.lastScan).toLocaleDateString()}` : ' No scans yet'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-400 mb-1">Avg Risk</p>
                    <p className={`text-xl font-bold ${
                      repo.avgRisk > 70 ? 'text-red-400' : repo.avgRisk > 40 ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>
                      {repo.avgRisk}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Scans */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Scans</h2>
          {recentScans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No scans available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => {
                const repo = repositories.find(r => r.analyses.some(a => a.id === scan.id));
                return (
                  <div 
                    key={scan.id} 
                    className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-[#262626] hover:border-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-medium">{repo?.name || 'Unknown'}</span>
                        <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-xs font-mono border border-blue-900/50">
                          PR #{scan.prNumber}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${
                          scan.status === 'VULNERABLE' 
                            ? 'bg-red-950/30 text-red-400 border-red-900/50'
                            : scan.status === 'WARNING'
                            ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50'
                            : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                        }`}>
                          {scan.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(scan.createdAt).toLocaleString()} • {scan.issuesFound} issue{scan.issuesFound !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-white">{scan.riskScore}</p>
                      <p className="text-xs text-gray-500">Risk Score</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Total Issues Found */}
        <Card className="bg-gradient-to-br from-purple-950/20 to-purple-900/10 border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Issues Detected</p>
              <p className="text-3xl font-bold text-white">{totalIssues}</p>
              <p className="text-xs text-gray-500 mt-2">
                Across {repositories.length} repositor{repositories.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-purple-400" />
          </div>
        </Card>

      </div>
    </div>
  );
}

