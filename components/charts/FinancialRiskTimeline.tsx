"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const defaultData = [
  { month: 'Jan', internalScore: 85, financialRisk: 92, potentialLoss: 25000 },
  { month: 'Feb', internalScore: 78, financialRisk: 88, potentialLoss: 42000 },
  { month: 'Mar', internalScore: 72, financialRisk: 85, potentialLoss: 38000 },
  { month: 'Apr', internalScore: 65, financialRisk: 95, potentialLoss: 85000 },
  { month: 'May', internalScore: 82, financialRisk: 70, potentialLoss: 15000 },
  { month: 'Jun', internalScore: 90, financialRisk: 65, potentialLoss: 8000 },
];

interface FinancialRiskTimelineProps {
  data?: Array<{
    month: string;
    financialRisk: number;
    internalScore: number;
    potentialLoss: number;
  }>;
}

export function FinancialRiskTimeline({ data = defaultData }: FinancialRiskTimelineProps) {
  const latest = data[data.length - 1];

  return (
    <div className="h-[32rem] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">💰 Financial Risk Timeline</h3>
          <p className="text-xs text-gray-400">Context-aware scoring shows business impact</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-sm"></div>
            <span className="text-gray-300 font-medium">Financial Risk Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-sm"></div>
            <span className="text-gray-300 font-medium">Technical Score</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <LineChart data={data} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
          <defs>
            <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="technicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            fontSize={10}
            fontWeight="500"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            label={{
              value: 'Risk Score',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '10px', fontWeight: '500' }
            }}
          />
          <Tooltip
            formatter={(value: any, name: any) => {
              if (name === 'potentialLoss') return [`$${value?.toLocaleString() ?? '0'}`, 'Potential Loss'];
              return [value ?? 0, name === 'financialRisk' ? 'Financial Risk' : 'Technical Score'];
            }}
            labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid #374151',
              borderRadius: '6px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          />

          <Area
            type="monotone"
            dataKey="financialRisk"
            fill="url(#financialGradient)"
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey="financialRisk"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#1f2937' }}
            activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 3, fill: '#1f2937' }}
            filter="drop-shadow(0 4px 6px rgba(239, 68, 68, 0.3))"
          />

          <Line
            type="monotone"
            dataKey="internalScore"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#1f2937' }}
            activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#1f2937' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Bottom metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-xl font-bold text-emerald-400">
            ${Math.round(data.reduce((sum, d) => sum + d.potentialLoss, 0)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400 font-medium">Total Risk Prevented</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">
            {Math.round(data.reduce((sum, d) => sum + d.internalScore, 0) / data.length)}%
          </div>
          <div className="text-xs text-gray-400 font-medium">Avg Security Score</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-400">2.1x</div>
          <div className="text-xs text-gray-400 font-medium">Context Multiplier</div>
        </div>
      </div>
    </div>
  );
}
