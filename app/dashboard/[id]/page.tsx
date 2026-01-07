import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ClickableRow } from "@/components/ui/ClickableRow";
import { prisma } from "@/lib/prisma";

export default async function RepoDetails({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) redirect("/");

  // 1. Fetch the Repo & Its Analyses
  const repo = await prisma.repository.findUnique({
    where: {
      id: id,
      userId: userId // Security: Ensure this user owns the repo
    },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!repo) return notFound();

  // Calculate metrics
  const currentRiskScore = repo.analyses[0]?.riskScore || 0;
  const totalScans = repo.analyses.length;
  const totalBugs = repo.analyses.reduce((sum, a) => sum + a.issuesFound, 0);

  // GitHub URL
  const githubUrl = `https://github.com/${repo.name}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#a1a1aa] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview
        </Link>

        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#262626] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-white">{repo.name}</h1>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a1a1aa] hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[#a1a1aa] font-mono text-sm">Repository ID: {repo.githubRepoId}</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Current Risk Score</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-semibold ${currentRiskScore > 70 ? 'text-red-400' :
                    currentRiskScore > 40 ? 'text-yellow-400' :
                      'text-emerald-400'
                  }`}>
                  {currentRiskScore}
                </p>
                <span className="text-sm text-[#a1a1aa]">/100</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Total Scans</p>
              <p className="text-3xl font-semibold text-white">{totalScans}</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-sm text-[#a1a1aa]">Bugs Found</p>
              <p className="text-3xl font-semibold text-white">{totalBugs}</p>
            </div>
          </Card>
        </div>

        {/* Scan History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Scan History</h2>

          {repo.analyses.length === 0 ? (
            <Card className="border-dashed">
              <div className="text-center py-12">
                <ShieldAlert className="w-12 h-12 text-[#a1a1aa] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">No audits found</h3>
                <p className="text-[#a1a1aa] text-sm max-w-sm mx-auto">
                  Create a Pull Request in this repository to trigger the AI Auditor.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#262626]">
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        PR Number
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right py-3 px-6 text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        Risk Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {repo.analyses.map((scan) => {
                      const isVulnerable = scan.status === 'VULNERABLE';
                      const isWarning = scan.status === 'WARNING';

                      return (
                        <ClickableRow
                          key={scan.id}
                          href={`/dashboard/${repo.id}/scan/${scan.id}`}
                          className="border-b border-[#262626] hover:bg-[#1a1a1a] transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span className="text-white font-mono text-sm">PR #{scan.prNumber}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-[#a1a1aa] text-sm">
                              {new Date(scan.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-xs font-semibold px-2 py-1 rounded border ${isVulnerable
                                ? "text-red-400 border-red-500/20 bg-red-500/10"
                                : isWarning
                                  ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/10"
                                  : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                              }`}>
                              {scan.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`text-sm font-semibold ${scan.riskScore > 70 ? 'text-red-400' :
                                scan.riskScore > 40 ? 'text-yellow-400' :
                                  'text-emerald-400'
                              }`}>
                              {scan.riskScore}
                            </span>
                          </td>
                        </ClickableRow>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
