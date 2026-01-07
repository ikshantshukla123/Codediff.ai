"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SeverityPieChartProps {
  high: number;
  medium: number;
  low: number;
}

export function SeverityPieChart({ high, medium, low }: SeverityPieChartProps) {
  const data = [
    { name: 'High', value: high, color: '#ef4444' },   // red-500
    { name: 'Medium', value: medium, color: '#eab308' }, // yellow-500
    { name: 'Low', value: low, color: '#3b82f6' },    // blue-500
  ].filter(item => item.value > 0);

  const total = high + medium + low;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-64 bg-[#111111] rounded-xl border border-[#262626]">
        <h3 className="text-lg font-semibold text-white mb-2">Severity Distribution</h3>
        <p className="text-gray-500">No issues found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-xl border border-[#262626] p-4">
      <h3 className="text-lg font-semibold text-white mb-1">Severity Distribution</h3>
      <p className="text-xs text-gray-400 mb-4">Breakdown of issues by severity level</p>

      <div className="flex-1 min-h-[280px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value, 'Issues']}
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-gray-300 ml-1 text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text for Donut Chart */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
        </div>
      </div>
    </div>
  );
}
