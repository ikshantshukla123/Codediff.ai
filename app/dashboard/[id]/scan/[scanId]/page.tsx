import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle, FileCode, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

const prisma = new PrismaClient();

interface Bug {
  type?: string;
  severity?: "HIGH" | "MEDIUM" | "LOW";
  description?: string;
  file?: string;
  line?: number;
  recommendation?: string;
  fix?: string;
}

export default async function ScanReportPage({ 
  params 
}: { 
  params: Promise<{ id: string; scanId: string }> 
}) {
  const { userId } = await auth();
  const { id, scanId } = await params;

  if (!userId) redirect("/");

  // Fetch the analysis with repository
  const analysis = await prisma.analysis.findFirst({
    where: {
      id: scanId,
      repository: {
        id: id,
        userId: userId // Security: Ensure user owns the repo
      }
    },
    include: {
      repository: true
    }
  });

  if (!analysis) return notFound();

  // Parse bugs from JSON
  const bugs: Bug[] = Array.isArray(analysis.bugs) ? analysis.bugs : [];
  
  // Group bugs by severity
  const bugsBySeverity = {
    HIGH: bugs.filter((b) => b.severity === "HIGH"),
    MEDIUM: bugs.filter((b) => b.severity === "MEDIUM"),
    LOW: bugs.filter((b) => b.severity === "LOW"),
  };

  const getStatusBadge = (status: string) => {
    const baseStyles = "px-3 py-1 rounded text-sm font-semibold border";
    switch (status) {
      case "VULNERABLE":
        return `${baseStyles} text-red-400 border-red-500/20 bg-red-500/10`;
      case "WARNING":
        return `${baseStyles} text-yellow-400 border-yellow-500/20 bg-yellow-500/10`;
      case "SECURE":
        return `${baseStyles} text-emerald-400 border-emerald-500/20 bg-emerald-500/10`;
      default:
        return `${baseStyles} text-[#a1a1aa] border-[#262626]`;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const baseStyles = "px-2 py-0.5 rounded text-xs font-semibold border";
    switch (severity) {
      case "HIGH":
        return `${baseStyles} text-red-400 border-red-500/20 bg-red-500/10`;
      case "MEDIUM":
        return `${baseStyles} text-yellow-400 border-yellow-500/20 bg-yellow-500/10`;
      case "LOW":
        return `${baseStyles} text-blue-400 border-blue-500/20 bg-blue-500/10`;
      default:
        return `${baseStyles} text-[#a1a1aa] border-[#262626]`;
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 70) return "text-red-400";
    if (score > 40) return "text-yellow-400";
    return "text-emerald-400";
  };

  // Executive Summary
  const executiveSummary = analysis.riskScore > 70
    ? "High risk detected. Immediate action required. Review all issues before merging. This pull request contains critical security vulnerabilities that could expose your application to significant risks."
    : analysis.riskScore > 40
    ? "Moderate risk. Review issues and consider fixes before merging. While not critical, addressing these issues will improve code quality and security posture."
    : "Low risk. Code appears secure. Proceed with caution. Minor improvements may be suggested but no critical issues were detected.";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Back Button */}
        <Link 
          href={`/dashboard/${id}`} 
          className="inline-flex items-center text-[#a1a1aa] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Repository
        </Link>

        {/* Header */}
        <div className="border-b border-[#262626] pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">
                Security Analysis Report
              </h1>
              <p className="text-[#a1a1aa] font-mono text-sm">
                {analysis.repository.name} • PR #{analysis.prNumber}
              </p>
            </div>
            <span className={getStatusBadge(analysis.status)}>
              {analysis.status}
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Summary */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Risk Score</h2>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-semibold ${getRiskColor(analysis.riskScore)}`}>
                    {analysis.riskScore}
                  </span>
                  <span className="text-[#a1a1aa] text-lg">/100</span>
                </div>
                <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      analysis.riskScore > 70 ? 'bg-red-500' : 
                      analysis.riskScore > 40 ? 'bg-yellow-500' : 
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${analysis.riskScore}%` }}
                  />
                </div>
                <div className="pt-4 border-t border-[#262626]">
                  <p className="text-sm text-[#a1a1aa] mb-2">Security Score</p>
                  <p className="text-2xl font-semibold text-white">{100 - analysis.riskScore}/100</p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Executive Summary</h2>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                {executiveSummary}
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-white mb-4">Analysis Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Analyzed At</span>
                  <span className="text-white font-mono">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Issues Found</span>
                  <span className="text-white">{analysis.issuesFound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Pull Request</span>
                  <span className="text-white font-mono">#{analysis.prNumber}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Vulnerabilities */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Vulnerabilities ({bugs.length})
              </h2>
              
              {bugs.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">No Issues Found</h3>
                    <p className="text-[#a1a1aa] text-sm">
                      This pull request appears to be secure with no detected vulnerabilities.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* High Severity Bugs */}
                  {bugsBySeverity.HIGH.map((bug, index) => (
                    <Card key={`high-${index}`} className="border-red-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileCode className="w-4 h-4 text-[#a1a1aa]" />
                            <span className="text-white font-medium text-sm">
                              {bug.file || "Unknown File"}
                              {bug.line && <span className="text-[#a1a1aa]">:{bug.line}</span>}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold mb-2">{bug.type || "Security Issue"}</h3>
                        </div>
                        <span className={getSeverityBadge("HIGH")}>
                          HIGH
                        </span>
                      </div>
                      
                      {bug.description && (
                        <p className="text-[#a1a1aa] text-sm mb-4 leading-relaxed">
                          {bug.description}
                        </p>
                      )}

                      {bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Suggested Fix</p>
                          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-[#a1a1aa] font-mono whitespace-pre-wrap">
                              <code>{bug.fix}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {bug.recommendation && !bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Recommendation</p>
                          <p className="text-sm text-[#a1a1aa]">{bug.recommendation}</p>
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* Medium Severity Bugs */}
                  {bugsBySeverity.MEDIUM.map((bug, index) => (
                    <Card key={`medium-${index}`} className="border-yellow-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileCode className="w-4 h-4 text-[#a1a1aa]" />
                            <span className="text-white font-medium text-sm">
                              {bug.file || "Unknown File"}
                              {bug.line && <span className="text-[#a1a1aa]">:{bug.line}</span>}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold mb-2">{bug.type || "Issue"}</h3>
                        </div>
                        <span className={getSeverityBadge("MEDIUM")}>
                          MEDIUM
                        </span>
                      </div>
                      
                      {bug.description && (
                        <p className="text-[#a1a1aa] text-sm mb-4 leading-relaxed">
                          {bug.description}
                        </p>
                      )}

                      {bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Suggested Fix</p>
                          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-[#a1a1aa] font-mono whitespace-pre-wrap">
                              <code>{bug.fix}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {bug.recommendation && !bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Recommendation</p>
                          <p className="text-sm text-[#a1a1aa]">{bug.recommendation}</p>
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* Low Severity Bugs */}
                  {bugsBySeverity.LOW.map((bug, index) => (
                    <Card key={`low-${index}`} className="border-blue-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileCode className="w-4 h-4 text-[#a1a1aa]" />
                            <span className="text-white font-medium text-sm">
                              {bug.file || "Unknown File"}
                              {bug.line && <span className="text-[#a1a1aa]">:{bug.line}</span>}
                            </span>
                          </div>
                          <h3 className="text-white font-semibold mb-2">{bug.type || "Suggestion"}</h3>
                        </div>
                        <span className={getSeverityBadge("LOW")}>
                          LOW
                        </span>
                      </div>
                      
                      {bug.description && (
                        <p className="text-[#a1a1aa] text-sm mb-4 leading-relaxed">
                          {bug.description}
                        </p>
                      )}

                      {bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Suggested Fix</p>
                          <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-[#a1a1aa] font-mono whitespace-pre-wrap">
                              <code>{bug.fix}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {bug.recommendation && !bug.fix && (
                        <div className="mt-4 pt-4 border-t border-[#262626]">
                          <p className="text-xs text-[#a1a1aa] mb-2 uppercase tracking-wider">Recommendation</p>
                          <p className="text-sm text-[#a1a1aa]">{bug.recommendation}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

