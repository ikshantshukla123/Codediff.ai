import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, FileCode, Clock, Bug as BugIcon, DollarSign, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import { AttackReplay } from "@/components/AttackReplay";
import { prisma } from "@/lib/prisma";

// 1. Define the Interface explicitly
interface Bug {
  type: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  file: string;
  line: number;
  recommendation: string;
}

// Financial impact calculations
const calculateFinancialRisk = (bugs: Bug[], riskScore: number) => {
  const hasSQL = bugs.some(b => b.description?.toLowerCase().includes('sql') || b.type?.toLowerCase().includes('sql'));
  const hasRaceCondition = bugs.some(b => b.description?.toLowerCase().includes('race') || b.type?.toLowerCase().includes('race'));
  const hasCriticalVulns = bugs.filter(b => b.severity === 'HIGH').length;

  let estimatedFines = { min: 0, max: 0 };
  let fraudRisk = { min: 0, max: 0 };
  let riskLevel = 'LOW';

  if (hasSQL || hasCriticalVulns >= 3) {
    estimatedFines = { min: 100000, max: 5000000 };
    fraudRisk = { min: 1000000, max: 50000000 };
    riskLevel = 'EXTREME';
  } else if (hasRaceCondition || hasCriticalVulns >= 1) {
    estimatedFines = { min: 50000, max: 1000000 };
    fraudRisk = { min: 500000, max: 10000000 };
    riskLevel = 'HIGH';
  } else if (riskScore > 40) {
    estimatedFines = { min: 10000, max: 100000 };
    fraudRisk = { min: 100000, max: 1000000 };
    riskLevel = 'MODERATE';
  }

  return { estimatedFines, fraudRisk, riskLevel, hasSQL, hasRaceCondition };
};

const formatCurrency = (min: number, max: number) => {
  const formatNum = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toLocaleString()}`;
  };
  return `${formatNum(min)} - ${formatNum(max)}`;
};

export default async function AnalysisDetailPage({
  params
}: {
  params: Promise<{ id: string; scanId: string }> // Changed analysisId -> scanId to match your error path
}) {
  const { userId } = await auth();
  const { id, scanId } = await params;

  if (!userId) redirect("/");

  const analysis = await prisma.analysis.findFirst({
    where: {
      id: scanId,
      repository: {
        id: id,
        userId: userId
      }
    },
    include: {
      repository: true
    }
  });

  if (!analysis) return notFound();

  // 2. THE FIX: Cast as unknown first, then as Bug[]
  const bugs = (Array.isArray(analysis.bugs) ? analysis.bugs : []) as unknown as Bug[];

  const bugsBySeverity = {
    HIGH: bugs.filter((b) => b.severity === "HIGH"),
    MEDIUM: bugs.filter((b) => b.severity === "MEDIUM"),
    LOW: bugs.filter((b) => b.severity === "LOW"),
  };

  // Calculate financial risks
  const financialRisk = calculateFinancialRisk(bugs, analysis.riskScore);
  const githubRiskScore = Math.min(95, analysis.riskScore + (financialRisk.hasSQL ? 20 : 0) + (financialRisk.hasRaceCondition ? 15 : 0));
  const internalScore = analysis.riskScore;

  // Helper colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VULNERABLE": return "text-red-400 bg-red-950/30 border-red-900/50";
      case "WARNING": return "text-yellow-400 bg-yellow-950/30 border-yellow-900/50";
      case "SECURE": return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
      default: return "text-gray-400 bg-gray-950/30 border-gray-900/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "text-red-400 bg-red-950/30 border-red-900/50";
      case "MEDIUM": return "text-yellow-400 bg-yellow-950/30 border-yellow-900/50";
      case "LOW": return "text-blue-400 bg-blue-950/30 border-blue-900/50";
      default: return "text-gray-400 bg-gray-950/30 border-gray-900/50";
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

          {/* Financial Risk Scoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="bg-gradient-to-br from-red-950/30 to-red-900/10 border-red-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">🔥 GitHub Risk Score</p>
                  <p className="text-4xl font-bold text-red-400">{githubRiskScore}/100</p>
                  <p className="text-xs text-gray-400 mt-1">Financial Impact Focused</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">📊 Internal Score</p>
                  <p className="text-4xl font-bold text-blue-400">{internalScore}/100</p>
                  <p className="text-xs text-gray-400 mt-1">Bug Count Focused</p>
                </div>
              </div>

              {/* Financial Impact */}
              <div className="mt-4 pt-4 border-t border-red-900/30">
                <p className="text-sm font-semibold text-white mb-2">💰 Financial Exposure</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Regulatory Fines:</span>
                    <span className="text-xs text-red-300">{formatCurrency(financialRisk.estimatedFines.min, financialRisk.estimatedFines.max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Potential Fraud Loss:</span>
                    <span className="text-xs text-red-300">{formatCurrency(financialRisk.fraudRisk.min, financialRisk.fraudRisk.max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Total Liability:</span>
                    <span className={`text-xs font-bold ${financialRisk.riskLevel === 'EXTREME' ? 'text-red-400' :
                      financialRisk.riskLevel === 'HIGH' ? 'text-orange-400' :
                        financialRisk.riskLevel === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                      }`}>{financialRisk.riskLevel} RISK</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/20 to-blue-900/10 border-blue-900/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issues Found</p>
                  <p className="text-3xl font-bold text-white">{analysis.issuesFound}</p>
                </div>
                <BugIcon className="w-8 h-8 text-blue-400" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">High Severity:</span>
                  <span className="text-sm font-bold text-red-400">{bugsBySeverity.HIGH.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Medium Severity:</span>
                  <span className="text-sm font-bold text-yellow-400">{bugsBySeverity.MEDIUM.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Low Severity:</span>
                  <span className="text-sm font-bold text-blue-400">{bugsBySeverity.LOW.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FinTech Risk Analysis */}
        {(financialRisk.hasSQL || financialRisk.hasRaceCondition || bugsBySeverity.HIGH.length > 0) && (
          <Card className="border-red-900/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              FinTech Risk Analysis
            </h2>

            <div className="space-y-4">
              {/* SQL Injection Risk */}
              {financialRisk.hasSQL && (
                <div className="p-4 bg-red-950/20 rounded border border-red-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">SQL Injection (CRITICAL)</h3>
                    <span className="px-2 py-1 text-xs bg-red-900/50 text-red-300 rounded">
                      Regulatory Fines: {formatCurrency(100000, 5000000)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Direct string interpolation in SQL queries. Could trigger GDPR, PCI-DSS fines.
                  </p>
                </div>
              )}

              {/* Race Condition Risk */}
              {financialRisk.hasRaceCondition && (
                <div className="p-4 bg-red-950/20 rounded border border-red-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Race Condition (HIGH)</h3>
                    <span className="px-2 py-1 text-xs bg-red-900/50 text-red-300 rounded">
                      Fraud Loss: {formatCurrency(10000000, 50000000)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Double-spending vulnerability. Enables unlimited fraudulent transactions.
                  </p>
                </div>
              )}

              {/* High Severity Issues */}
              {bugsBySeverity.HIGH.length > 0 && !financialRisk.hasSQL && !financialRisk.hasRaceCondition && (
                <div className="p-4 bg-orange-950/20 rounded border border-orange-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Critical Vulnerabilities ({bugsBySeverity.HIGH.length})</h3>
                    <span className="px-2 py-1 text-xs bg-orange-900/50 text-orange-300 rounded">
                      Compliance Risk: {formatCurrency(50000, 1000000)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Multiple high-severity issues detected. Potential regulatory compliance violations.
                  </p>
                </div>
              )}

              {/* Risk Mitigation */}
              <div className="mt-4 p-4 bg-blue-950/20 rounded border border-blue-900/30">
                <h4 className="font-semibold text-blue-400 mb-2">🛡️ Immediate Actions Required</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Block PR merge until critical issues are resolved</li>
                  <li>• Conduct emergency security review with compliance team</li>
                  <li>• Implement additional monitoring for financial transactions</li>
                  <li>• Consider penetration testing before production deployment</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Attack Replay Component */}
        {analysis.attackProof && (
          <Card className="border-red-900/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Live Attack Simulation Proof
            </h2>
            <p className="text-gray-300 mb-4 text-sm">
              Our security engine successfully demonstrated a real attack against your code.
              Watch the simulated attack that bypassed your application's security logic:
            </p>
            <AttackReplay proof={(analysis.attackProof as any)?.proof} />
          </Card>
        )}

        {/* Score Breakdown & Explanation */}
        <ScoreExplanation
          technicalScore={internalScore}
          financialRiskScore={githubRiskScore}
          bugs={bugs}
        />

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
                  className={`h-full ${analysis.riskScore > 70 ? 'bg-red-500' :
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
                  {bugsBySeverity.HIGH.map((bug, index) => (
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
                  {bugsBySeverity.MEDIUM.map((bug, index) => (
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
                  {bugsBySeverity.LOW.map((bug, index) => (
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