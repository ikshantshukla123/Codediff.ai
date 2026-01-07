"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  {
    name: 'PCI-DSS',
    score: 92,
    fill: '#10b981',
    description: 'Payment Card Industry Data Security Standard',
    requirements: 12,
    compliant: 11
  },
  {
    name: 'GDPR',
    score: 88,
    fill: '#3b82f6',
    description: 'General Data Protection Regulation',
    requirements: 8,
    compliant: 7
  },
  {
    name: 'SOC 2',
    score: 85,
    fill: '#8b5cf6',
    description: 'Service Organization Control 2',
    requirements: 5,
    compliant: 4
  },
  {
    name: 'HIPAA',
    score: 78,
    fill: '#f59e0b',
    description: 'Health Insurance Portability and Accountability Act',
    requirements: 6,
    compliant: 4
  }
];

export function ComplianceGauge() {
  const overallScore = Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length);

  return (
    <div className="h-[32rem] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">🛡️ Compliance Score Overview</h3>
          <p className="text-xs text-gray-400">Multi-standard regulatory compliance monitoring</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{overallScore}</div>
          <div className="text-xs text-gray-400 font-medium">Overall Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              data={data}
              startAngle={90}
              endAngle={450}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                background
                dataKey="score"
                cornerRadius={10}
              />
              <Tooltip
                formatter={(value: any, name: any) => [`${value ?? 0}%`, 'Compliance Score']}
                labelFormatter={(label) => {
                  const item = data.find(d => d.name === label);
                  return item ? item.description : label;
                }}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{item.score}%</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: item.fill,
                      width: `${item.score}%`,
                      boxShadow: `0 0 10px ${item.fill}30`
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {item.compliant}/{item.requirements} requirements met
                </span>
                <span className={`font-semibold ${item.score >= 90 ? 'text-emerald-400' :
                  item.score >= 80 ? 'text-blue-400' :
                    item.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                  {item.score >= 90 ? 'Excellent' :
                    item.score >= 80 ? 'Good' :
                      item.score >= 70 ? 'Fair' : 'Needs Work'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom summary */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">26/31</div>
          <div className="text-xs text-gray-400">Requirements Met</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">97%</div>
          <div className="text-xs text-gray-400">Data Protection</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">15</div>
          <div className="text-xs text-gray-400">Days to Audit</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">$2.4M</div>
          <div className="text-xs text-gray-400">Fine Risk Avoided</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Automated compliance monitoring • Real-time regulatory updates • Audit-ready reports
        </p>
      </div>
    </div>
  );
}