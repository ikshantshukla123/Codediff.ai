"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30d");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Overview</h1>
            <p className="text-gray-500">Codebase health metrics & trends</p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded text-sm font-medium ${timeframe === t
                    ? "bg-blue-900/50 text-white border border-blue-700"
                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-900/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-5 h-5 text-blue-400" />
                <div className="flex items-center text-emerald-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">87%</div>
              <p className="text-sm text-gray-400">Code Health Score</p>
            </div>
          </Card>

          <Card className="border-purple-900/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <div className="flex items-center text-red-400 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -8%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">42</div>
              <p className="text-sm text-gray-400">Vulnerabilities Fixed</p>
            </div>
          </Card>

          <Card className="border-emerald-900/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div className="flex items-center text-emerald-400 text-sm">
                  +$28K
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">$128K</div>
              <p className="text-sm text-gray-400">Total Risk Prevented</p>
            </div>
          </Card>

          <Card className="border-orange-900/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-5 h-5 text-orange-400">⚡</div>
                <div className="flex items-center text-emerald-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">94%</div>
              <p className="text-sm text-gray-400">Auto-Fix Success Rate</p>
            </div>
          </Card>
        </div>

        <Card className="border-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Predictive Analytics Dashboard</h3>
            <p className="text-gray-400 mb-4">
              This dashboard will soon include predictive analytics that forecast future
              architecture breaks, technical debt accumulation, and security vulnerabilities
              before they happen.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-800">
                <span className="text-gray-300">Architecture break prediction</span>
                <span className="text-yellow-400 text-sm font-medium">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-800">
                <span className="text-gray-300">Technical debt forecasting</span>
                <span className="text-yellow-400 text-sm font-medium">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-800">
                <span className="text-gray-300">Team performance analytics</span>
                <span className="text-yellow-400 text-sm font-medium">Coming soon</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}