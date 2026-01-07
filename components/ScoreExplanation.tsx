"use client";

import { Card } from "@/components/ui/Card";
import { Info, Calculator, TrendingUp, AlertTriangle, Shield, DollarSign } from "lucide-react";
import { useState } from "react";

interface ScoreExplanationProps {
  technicalScore: number;
  financialRiskScore: number;
  bugs: any[];
}

export function ScoreExplanation({ technicalScore, financialRiskScore, bugs }: ScoreExplanationProps) {
  const [showDetailed, setShowDetailed] = useState(false);

  // Calculate breakdown
  const calculateBreakdown = () => {
    const highCount = bugs.filter(b => b.severity === "HIGH").length;
    const mediumCount = bugs.filter(b => b.severity === "MEDIUM").length;
    const lowCount = bugs.filter(b => b.severity === "LOW").length;

    const hasSQL = bugs.some(b =>
      b.description?.toLowerCase().includes('sql') ||
      b.type?.toLowerCase().includes('sql')
    );
    const hasRaceCondition = bugs.some(b =>
      b.description?.toLowerCase().includes('race') ||
      b.type?.toLowerCase().includes('race condition')
    );

    // Technical score calculation (explainable)
    let techScoreCalc = 100;
    techScoreCalc -= highCount * 20;
    techScoreCalc -= mediumCount * 10;
    techScoreCalc -= lowCount * 5;

    // Financial risk calculation
    let financialRiskCalc = 0;
    if (hasSQL) financialRiskCalc += 75; // Base 30 × 2.5 multiplier
    if (hasRaceCondition) financialRiskCalc += 56; // Base 20 × 2.8 multiplier
    if (highCount > 0) financialRiskCalc += (highCount * 15);
    if (mediumCount > 0) financialRiskCalc += (mediumCount * 8);

    return {
      highCount,
      mediumCount,
      lowCount,
      hasSQL,
      hasRaceCondition,
      techScoreCalc: Math.max(0, techScoreCalc),
      financialRiskCalc: Math.min(100, financialRiskCalc)
    };
  };

  const breakdown = calculateBreakdown();

  return (
    <Card className="border-blue-900/50 bg-gradient-to-br from-blue-950/20 to-blue-900/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Score Breakdown & Explanation
        </h3>
        <button
          onClick={() => setShowDetailed(!showDetailed)}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          {showDetailed ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-black/30 rounded border border-blue-900/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Technical Score</span>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">{technicalScore}/100</div>
          <p className="text-xs text-gray-400">Measures code quality & security hygiene</p>
        </div>

        <div className="p-3 bg-black/30 rounded border border-red-900/30">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white">Financial Risk Score</span>
          </div>
          <div className="text-3xl font-bold text-red-400 mb-1">{financialRiskScore}/100</div>
          <p className="text-xs text-gray-400">Measures business impact for FinTech</p>
        </div>
      </div>

      {/* Why Two Scores? */}
      <div className="mb-4 p-3 bg-black/40 rounded border border-gray-800">
        <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400" />
          Why Two Different Scores?
        </h4>
        <p className="text-xs text-gray-300">
          A bug's danger depends on context. <strong>SQL injection in a blog = Medium risk.</strong><br />
          <strong>SQL injection in banking code = Catastrophic risk.</strong> Our system understands <strong>what the code does</strong>, not just what the bug is.
        </p>
      </div>

      {/* Detailed Breakdown */}
      {showDetailed && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-white mb-3">📊 Detailed Calculation</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Score Breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-blue-400">Technical Score: {technicalScore}/100</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Starting Score</span>
                  <span className="text-white">100</span>
                </div>
                {breakdown.highCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-red-400">High Severity ({breakdown.highCount}×)</span>
                    <span className="text-red-400">-{breakdown.highCount * 20}</span>
                  </div>
                )}
                {breakdown.mediumCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Medium Severity ({breakdown.mediumCount}×)</span>
                    <span className="text-yellow-400">-{breakdown.mediumCount * 10}</span>
                  </div>
                )}
                {breakdown.lowCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-400">Low Severity ({breakdown.lowCount}×)</span>
                    <span className="text-blue-400">-{breakdown.lowCount * 5}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Final Technical Score</span>
                    <span className="text-white">{technicalScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Risk Breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-red-400">Financial Risk: {financialRiskScore}/100</h5>
              <div className="space-y-1 text-sm">
                {breakdown.hasSQL && (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">SQL Injection Base</span>
                      <span className="text-white">30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">× Payments Multiplier (2.5×)</span>
                      <span className="text-white">75</span>
                    </div>
                  </div>
                )}
                {breakdown.hasRaceCondition && (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Race Condition Base</span>
                      <span className="text-white">20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">× FinTech Multiplier (2.8×)</span>
                      <span className="text-white">56</span>
                    </div>
                  </div>
                )}
                {breakdown.highCount > 0 && !breakdown.hasSQL && !breakdown.hasRaceCondition && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">High Severity Issues ({breakdown.highCount}×)</span>
                    <span className="text-white">{breakdown.highCount * 15}</span>
                  </div>
                )}
                {breakdown.mediumCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Medium Severity Issues ({breakdown.mediumCount}×)</span>
                    <span className="text-white">{breakdown.mediumCount * 8}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Risk Score</span>
                    <span className="text-red-400">{financialRiskScore} (Capped at 100)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multiplier Explanation */}
          <div className="mt-4 p-3 bg-black/40 rounded border border-gray-800">
            <h5 className="text-xs font-semibold text-yellow-400 mb-2">📈 Financial Multipliers Explained</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-red-900/20 rounded">
                <div className="font-medium text-red-300">SQL Injection</div>
                <div className="text-gray-300">2.5× in payments</div>
              </div>
              <div className="p-2 bg-red-900/20 rounded">
                <div className="font-medium text-red-300">Race Conditions</div>
                <div className="text-gray-300">2.8× in banking</div>
              </div>
              <div className="p-2 bg-yellow-900/20 rounded">
                <div className="font-medium text-yellow-300">Hardcoded Secrets</div>
                <div className="text-gray-300">2.0× compliance risk</div>
              </div>
              <div className="p-2 bg-blue-900/20 rounded">
                <div className="font-medium text-blue-300">General Bugs</div>
                <div className="text-gray-300">1.0× standard</div>
              </div>
            </div>
          </div>

          {/* Real-World Impact */}
          <div className="mt-4 p-3 bg-black/40 rounded border border-gray-800">
            <h5 className="text-xs font-semibold text-white mb-2">💼 Real-World Impact Analysis</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  <strong>Technical Score {technicalScore}:</strong> "There are {bugs.length} bugs needing fixes"
                </span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  <strong>Financial Risk {financialRiskScore}:</strong> "This code could cause ${breakdown.hasSQL ? '100K-5M' : '10K-100K'} in fines and ${breakdown.hasRaceCondition ? '10M-50M' : '100K-1M'} in fraud"
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setShowDetailed(!showDetailed)}
        className="w-full mt-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-950/50 rounded border border-blue-900/30 transition-colors"
      >
        {showDetailed ? (
          "↑ Hide Detailed Calculation"
        ) : (
          "↓ Show How Scores Are Calculated"
        )}
      </button>
    </Card>
  );
}