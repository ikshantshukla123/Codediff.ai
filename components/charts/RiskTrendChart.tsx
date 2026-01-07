import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RiskTrendChartProps {
  data: { date: string; score: number; label: string }[];
}

export function RiskTrendChart({ data }: RiskTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 h-64 bg-[#111111] rounded-xl border border-[#262626]">
        <h3 className="text-lg font-semibold text-white mb-2">Risk Score Trend</h3>
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.map(item => ({
    date: item.date,
    score: item.score,
    label: item.label
  }));

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-xl border border-[#262626] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Risk Score Trend</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Risk Score</span>
        </div>
      </div>

      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
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
              domain={[0, 100]}
              label={{
                value: 'Risk Score',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '10px', fontWeight: '500' }
              }}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Risk Score']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid #374151',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                fontSize: '12px'
              }}
            />

            {/* Background area */}
            <Area
              type="monotone"
              dataKey="score"
              fill="url(#trendGradient)"
              stroke="none"
            />

            {/* Trend line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1f2937' }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1f2937' }}
              filter="drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length) : 0}
          </div>
          <div className="text-xs text-gray-400 font-medium">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">
            {data.length > 0 ? Math.max(...data.map(d => d.score)) : 0}
          </div>
          <div className="text-xs text-gray-400 font-medium">Peak Risk</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${data.length > 1 && data[data.length - 1].score < data[0].score ? 'text-emerald-400' : 'text-red-400'
            }`}>
            {data.length > 1 ? (data[data.length - 1].score - data[0].score > 0 ? '+' : '') +
              Math.round(data[data.length - 1].score - data[0].score) : 0}
          </div>
          <div className="text-xs text-gray-400 font-medium">Change</div>
        </div>
      </div>
    </div>
  );
}
