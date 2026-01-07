import { Card } from "@/components/ui/Card";
import { Zap, Clock, Shield, AlertTriangle } from "lucide-react";

export default function LiveExploitsPage() {
  const mockExploits = [
    {
      id: 1,
      title: "SQL Injection in Payment Processing",
      severity: "CRITICAL",
      exploitType: "Database Breach",
      potentialLoss: "$5M+",
      status: "Active",
      discoveredAt: "2024-01-07T10:30:00Z"
    },
    {
      id: 2,
      title: "Race Condition in Transaction Handler",
      severity: "HIGH",
      exploitType: "Double Spending",
      potentialLoss: "$50M+",
      status: "Monitoring",
      discoveredAt: "2024-01-07T09:15:00Z"
    },
    {
      id: 3,
      title: "JWT Token Manipulation",
      severity: "HIGH",
      exploitType: "Authentication Bypass",
      potentialLoss: "$1M+",
      status: "Patched",
      discoveredAt: "2024-01-06T16:45:00Z"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "text-red-400 bg-red-950/30 border-red-900/50";
      case "HIGH": return "text-orange-400 bg-orange-950/30 border-orange-900/50";
      case "MEDIUM": return "text-yellow-400 bg-yellow-950/30 border-yellow-900/50";
      default: return "text-blue-400 bg-blue-950/30 border-blue-900/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-red-400 bg-red-950/30";
      case "Monitoring": return "text-yellow-400 bg-yellow-950/30";
      case "Patched": return "text-emerald-400 bg-emerald-950/30";
      default: return "text-gray-400 bg-gray-950/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Exploits</h1>
            <p className="text-gray-500">Active breach attempts and vulnerability demonstrations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-red-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Active Exploits</h3>
              </div>
              <div className="text-4xl font-bold text-red-400 mb-2">2</div>
              <p className="text-sm text-gray-400">Require immediate attention</p>
            </div>
          </Card>

          <Card className="border-yellow-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Under Monitoring</h3>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1</div>
              <p className="text-sm text-gray-400">Tracked vulnerabilities</p>
            </div>
          </Card>

          <Card className="border-emerald-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Patched Today</h3>
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">1</div>
              <p className="text-sm text-gray-400">Successfully resolved</p>
            </div>
          </Card>
        </div>

        <Card className="border-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Exploit Timeline</h3>
            <div className="space-y-4">
              {mockExploits.map((exploit) => (
                <div key={exploit.id} className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                  <div className="mt-1">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{exploit.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(exploit.severity)}`}>
                          {exploit.severity}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exploit.status)}`}>
                          {exploit.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Exploit Type:</span>
                        <span className="ml-2 text-white">{exploit.exploitType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Potential Loss:</span>
                        <span className="ml-2 text-red-400 font-medium">{exploit.potentialLoss}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Discovered:</span>
                        <span className="ml-2 text-white">
                          {new Date(exploit.discoveredAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-gray-800 mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🚀 Coming Soon: Interactive Exploit Demos</h3>
            <p className="text-gray-400">
              We're building interactive demonstrations that show exactly how these vulnerabilities
              could be exploited in your specific codebase, complete with step-by-step attack vectors
              and real-time financial impact calculations.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}