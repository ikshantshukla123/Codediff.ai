import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, FileCode, Clock, Bug } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const prisma = new PrismaClient();

export default async function AnalysisDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string; analysisId: string }> 
}) {
  const { userId } = await auth();
  const { id, analysisId } = await params;

  if (!userId) redirect("/");

  // Fetch the analysis with repository
  const analysis = await prisma.analysis.findFirst({
    where: {
      id: analysisId,
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
  const bugs = Array.isArray(analysis.bugs) ? analysis.bugs : [];
  
  // Group bugs by severity
  const bugsBySeverity = {
    HIGH: bugs.filter((b: any) => b.severity === "HIGH"),
    MEDIUM: bugs.filter((b: any) => b.severity === "MEDIUM"),
    LOW: bugs.filter((b: any) => b.severity === "LOW"),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VULNERABLE":
        return "text-red-400 bg-red-950/30 border-red-900/50";
      case "WARNING":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-900/50";
      case "SECURE":
        return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
      default:
        return "text-gray-400 bg-gray-950/30 border-gray-900/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "text-red-400 bg-red-950/30 border-red-900/50";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-900/50";
      case "LOW":
        return "text-blue-400 bg-blue-950/30 border-blue-900/50";
      default:
        return "text-gray-400 bg-gray-950/30 border-gray-900/50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Button */}
        <Link 
          href={`/dashboard/${id}`} 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Repository
        </Link>

        {/* Header */}
        <div className="border-b border-[#262626] pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Security Analysis Report
              </h1>
              <p className="text-gray-500 font-mono text-sm">
                {analysis.repository.name} • PR #{analysis.prNumber}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-semibold border ${getStatusColor(analysis.status)}`}>
              {analysis.status}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-red-950/20 to-red-900/10 border-red-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Risk Score</p>
                  <p className="text-3xl font-bold text-white">{analysis.riskScore}/100</p>
                </div>
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 border-blue-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issues Found</p>
                  <p className="text-3xl font-bold text-white">{analysis.issuesFound}</p>
                </div>
                <Bug className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 border-emerald-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Security Score</p>
                  <p className="text-3xl font-bold text-white">{100 - analysis.riskScore}/100</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Analysis Metadata */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Analysis Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Analyzed At</p>
              <p className="text-white font-mono text-sm">
                {new Date(analysis.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Repository</p>
              <p className="text-white">{analysis.repository.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Pull Request</p>
              <p className="text-white font-mono">#{analysis.prNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Analysis ID</p>
              <p className="text-white font-mono text-xs">{analysis.id}</p>
            </div>
          </div>
        </Card>

        {/* Risk Score Visualization */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Risk Assessment</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Overall Risk Score</span>
                <span className="text-2xl font-bold text-white">{analysis.riskScore}/100</span>
              </div>
              <div className="h-4 w-full bg-[#262626] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    analysis.riskScore > 70 ? 'bg-red-500' : 
                    analysis.riskScore > 40 ? 'bg-yellow-500' : 
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-[#262626]">
              <p className="text-sm text-gray-400 mb-2">Interpretation</p>
              <p className="text-white text-sm">
                {analysis.riskScore > 70 
                  ? "⚠️ High risk detected. Immediate action required. Review all issues before merging."
                  : analysis.riskScore > 40
                  ? "⚡ Moderate risk. Review issues and consider fixes before merging."
                  : "✅ Low risk. Code appears secure. Proceed with caution."
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Bugs by Severity */}
        {bugs.length > 0 ? (
          <>
            {/* High Severity Bugs */}
            {bugsBySeverity.HIGH.length > 0 && (
              <Card className="border-red-900/50">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  High Severity Issues ({bugsBySeverity.HIGH.length})
                </h2>
                <div className="space-y-4">
                  {bugsBySeverity.HIGH.map((bug: any, index: number) => (
                    <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg border border-red-900/30">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{bug.type || "Security Issue"}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor("HIGH")}`}>
                          HIGH
                        </span>
                      </div>
                      {bug.description && (
                        <p className="text-gray-300 text-sm mb-2">{bug.description}</p>
                      )}
                      {bug.file && (
                        <p className="text-gray-500 text-xs font-mono mb-1">
                          <FileCode className="w-3 h-3 inline mr-1" />
                          {bug.file}{bug.line ? `:${bug.line}` : ''}
                        </p>
                      )}
                      {bug.recommendation && (
                        <div className="mt-3 pt-3 border-t border-red-900/20">
                          <p className="text-xs text-gray-400 mb-1">Recommendation:</p>
                          <p className="text-sm text-gray-300">{bug.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Medium Severity Bugs */}
            {bugsBySeverity.MEDIUM.length > 0 && (
              <Card className="border-yellow-900/50">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Medium Severity Issues ({bugsBySeverity.MEDIUM.length})
                </h2>
                <div className="space-y-4">
                  {bugsBySeverity.MEDIUM.map((bug: any, index: number) => (
                    <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg border border-yellow-900/30">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{bug.type || "Issue"}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor("MEDIUM")}`}>
                          MEDIUM
                        </span>
                      </div>
                      {bug.description && (
                        <p className="text-gray-300 text-sm mb-2">{bug.description}</p>
                      )}
                      {bug.file && (
                        <p className="text-gray-500 text-xs font-mono mb-1">
                          <FileCode className="w-3 h-3 inline mr-1" />
                          {bug.file}{bug.line ? `:${bug.line}` : ''}
                        </p>
                      )}
                      {bug.recommendation && (
                        <div className="mt-3 pt-3 border-t border-yellow-900/20">
                          <p className="text-xs text-gray-400 mb-1">Recommendation:</p>
                          <p className="text-sm text-gray-300">{bug.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Low Severity Bugs */}
            {bugsBySeverity.LOW.length > 0 && (
              <Card className="border-blue-900/50">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  Low Severity Issues ({bugsBySeverity.LOW.length})
                </h2>
                <div className="space-y-4">
                  {bugsBySeverity.LOW.map((bug: any, index: number) => (
                    <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg border border-blue-900/30">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{bug.type || "Suggestion"}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor("LOW")}`}>
                          LOW
                        </span>
                      </div>
                      {bug.description && (
                        <p className="text-gray-300 text-sm mb-2">{bug.description}</p>
                      )}
                      {bug.file && (
                        <p className="text-gray-500 text-xs font-mono mb-1">
                          <FileCode className="w-3 h-3 inline mr-1" />
                          {bug.file}{bug.line ? `:${bug.line}` : ''}
                        </p>
                      )}
                      {bug.recommendation && (
                        <div className="mt-3 pt-3 border-t border-blue-900/20">
                          <p className="text-xs text-gray-400 mb-1">Recommendation:</p>
                          <p className="text-sm text-gray-300">{bug.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-2">No Issues Found</h3>
              <p className="text-gray-500 text-sm">
                This pull request appears to be secure with no detected vulnerabilities.
              </p>
            </div>
          </Card>
        )}

        {/* Raw Data (for debugging) */}
        <Card className="border-[#262626]">
          <h2 className="text-lg font-semibold text-white mb-4">Raw Analysis Data</h2>
          <pre className="text-xs text-gray-400 bg-[#0a0a0a] p-4 rounded-lg border border-[#262626] overflow-x-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </Card>

      </div>
    </div>
  );
}

