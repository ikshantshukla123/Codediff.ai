import { Card } from "@/components/ui/Card";
import { Shield, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Compliance Dashboard</h1>
        <p className="text-gray-500 mb-8">Audit logs, reports, and regulatory compliance tracking</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">PCI-DSS</h3>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">98%</div>
              <p className="text-sm text-gray-400">Compliance Score</p>
            </div>
          </Card>

          <Card className="border-blue-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">GDPR</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <p className="text-sm text-gray-400">Compliance Score</p>
            </div>
          </Card>

          <Card className="border-yellow-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">SOX</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">87%</div>
              <p className="text-sm text-gray-400">Compliance Score</p>
            </div>
          </Card>

          <Card className="border-purple-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">HIPAA</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">92%</div>
              <p className="text-sm text-gray-400">Compliance Score</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Compliance Events</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-950/20 rounded border border-emerald-900/30">
                  <span className="text-emerald-300">PCI-DSS audit passed</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-950/20 rounded border border-yellow-900/30">
                  <span className="text-yellow-300">GDPR data retention review</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-950/20 rounded border border-blue-900/30">
                  <span className="text-blue-300">SOX controls updated</span>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compliance Risks</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-950/20 rounded border border-red-900/30">
                  <span className="text-red-300">Hardcoded API keys detected</span>
                  <span className="text-xs text-red-400">HIGH</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-950/20 rounded border border-orange-900/30">
                  <span className="text-orange-300">Data encryption gaps</span>
                  <span className="text-xs text-orange-400">MEDIUM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-950/20 rounded border border-yellow-900/30">
                  <span className="text-yellow-300">Audit trail incomplete</span>
                  <span className="text-xs text-yellow-400">LOW</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Automated Compliance Monitoring</h3>
            <p className="text-gray-400 mb-4">
              Our system continuously monitors your codebase for compliance violations across
              major financial and healthcare regulations, providing real-time alerts and
              automated remediation suggestions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
                <h4 className="text-white font-medium mb-2">📋 Features</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Real-time compliance scoring</li>
                  <li>• Automated audit report generation</li>
                  <li>• Regulatory change tracking</li>
                  <li>• Risk assessment automation</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
                <h4 className="text-white font-medium mb-2">🎯 Supported Standards</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• PCI-DSS (Payment Card Industry)</li>
                  <li>• GDPR (European Data Protection)</li>
                  <li>• SOX (Financial Reporting)</li>
                  <li>• HIPAA (Healthcare Privacy)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}