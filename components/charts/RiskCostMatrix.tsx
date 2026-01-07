"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const data = [
  { x: 95, y: 85000, z: 120, type: 'SQL Injection', severity: 'CRITICAL', category: 'Payment Processing' },
  { x: 88, y: 42000, z: 100, type: 'Race Condition', severity: 'CRITICAL', category: 'Transaction Logic' },
  { x: 75, y: 28000, z: 80, type: 'Double Spending', severity: 'HIGH', category: 'Balance Updates' },
  { x: 65, y: 18000, z: 70, type: 'Hardcoded Secrets', severity: 'HIGH', category: 'API Authentication' },
  { x: 55, y: 12000, z: 60, type: 'JWT Bypass', severity: 'HIGH', category: 'User Sessions' },
  { x: 45, y: 8000, z: 50, type: 'XSS', severity: 'MEDIUM', category: 'User Interface' },
  { x: 35, y: 5000, z: 40, type: 'CSRF', severity: 'MEDIUM', category: 'Form Processing' },
  { x: 25, y: 2500, z: 30, type: 'Info Disclosure', severity: 'LOW', category: 'Error Handling' },
];

const SEVERITY_COLORS = {
  'CRITICAL': '#dc2626',
  'HIGH': '#ea580c',
  'MEDIUM': '#ca8a04',
  'LOW': '#16a34a'
};

export function RiskCostMatrix() {
  return (
    <div className="h-[32rem] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">🎯 Risk vs Financial Impact Analysis</h3>
          <p className="text-xs text-gray-400">Business impact correlation with technical risk scores</p>
        </div>
        <div className="text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded-full">
          Bubble size = Complexity
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <ScatterChart margin={{ top: 15, right: 25, left: 35, bottom: 35 }}>
          <defs>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#374151" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#374151" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="url(#gridGradient)" strokeWidth={1} />
          <XAxis
            type="number"
            dataKey="x"
            name="Risk Score"
            domain={[0, 100]}
            stroke="#9CA3AF"
            fontSize={10}
            fontWeight="500"
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Financial Risk Score',
              position: 'insideBottom',
              offset: -12,
              style: { fill: '#9CA3AF', fontSize: '10px', fontWeight: '600' }
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Cost Saved ($)"
            stroke="#9CA3AF"
            fontSize={10}
            fontWeight="500"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            label={{
              value: 'Potential Financial Loss',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '10px', fontWeight: '600' }
            }}
          />
          <ZAxis type="number" dataKey="z" range={[60, 250]} />

          {/* Risk zones */}
          <ReferenceLine x={70} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
          <ReferenceLine y={30000} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />

          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-gray-900/95 border border-gray-700 p-4 rounded-lg shadow-xl backdrop-blur-sm">
                  <div className="border-b border-gray-700 pb-2 mb-2">
                    <p className="font-bold text-white text-sm">{data.type}</p>
                    <p className="text-xs text-gray-400">{data.category}</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Severity:</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-xs ${data.severity === 'CRITICAL' ? 'bg-red-900/50 text-red-300' :
                          data.severity === 'HIGH' ? 'bg-orange-900/50 text-orange-300' :
                            data.severity === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-300' :
                              'bg-green-900/50 text-green-300'
                        }`}>{data.severity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Financial Risk:</span>
                      <span className="text-white font-semibold">{data.x}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Potential Loss:</span>
                      <span className="text-emerald-400 font-bold">${data.y.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Fix Complexity:</span>
                      <span className="text-blue-300">{data.z > 90 ? 'High' : data.z > 60 ? 'Medium' : 'Low'}</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />

          <Scatter name="Vulnerabilities" data={data}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS]}
                stroke="#1f2937"
                strokeWidth={2}
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend and Zones */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex gap-3 text-xs">
          {Object.entries(SEVERITY_COLORS).map(([severity, color]) => (
            <div key={severity} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full border border-gray-600"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-400 font-medium">{severity}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2 px-2 py-1 bg-red-900/20 border border-red-800/50 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-300 font-medium">Critical Zone</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">$205K</div>
            <div className="text-xs text-gray-400">Total Exposure</div>
          </div>
        </div>
      </div>
    </div>
  );
}