import { Card } from "@/components/ui/Card";
import { AlertTriangle, Shield, Zap, TrendingUp } from "lucide-react";

export default function SecurityIntelligencePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence</h1>
        <p className="text-gray-500 mb-8">Live vulnerability tracking & exploit proofs</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-red-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Active Threats</h3>
              </div>
              <div className="text-4xl font-bold text-white mb-2">18</div>
              <p className="text-sm text-gray-400">Critical vulnerabilities detected</p>
            </div>
          </Card>

          <Card className="border-blue-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Live Exploits</h3>
              </div>
              <div className="text-4xl font-bold text-white mb-2">7</div>
              <p className="text-sm text-gray-400">Verified exploit demonstrations</p>
            </div>
          </Card>

          <Card className="border-emerald-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Prevented Loss</h3>
              </div>
              <div className="text-4xl font-bold text-white mb-2">$42.8K</div>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </Card>
        </div>

        <Card className="border-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon: Live Vulnerability Prover</h3>
            <p className="text-gray-400">
              This dashboard will soon show interactive proof-of-concept exploits that demonstrate
              exactly how vulnerabilities could be exploited in your codebase, with dollar amounts
              calculated for potential financial loss.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}