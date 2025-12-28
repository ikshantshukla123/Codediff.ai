import React from 'react';

interface SeverityPieChartProps {
  high: number;
  medium: number;
  low: number;
}

export function SeverityPieChart({ high, medium, low }: SeverityPieChartProps) {
  const total = high + medium + low;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const center = 50;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-[#111111] rounded-xl border border-[#262626]">
        <p className="text-gray-500">No issues found</p>
      </div>
    );
  }

  const highPercent = high / total;
  const mediumPercent = medium / total;
  const lowPercent = low / total;

  const highOffset = 0;
  const mediumOffset = -circumference * highPercent;
  const lowOffset = -circumference * (highPercent + mediumPercent);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#111111] rounded-xl border border-[#262626]">
      <h3 className="text-lg font-semibold text-white mb-6">Severity Distribution</h3>
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#262626"
            strokeWidth="12"
          />

          {/* High Severity Segment */}
          {high > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#ef4444" // red-500
              strokeWidth="12"
              strokeDasharray={`${circumference * highPercent} ${circumference}`}
              strokeDashoffset={highOffset}
              className="transition-all duration-1000 ease-out"
            />
          )}

          {/* Medium Severity Segment */}
          {medium > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#eab308" // yellow-500
              strokeWidth="12"
              strokeDasharray={`${circumference * mediumPercent} ${circumference}`}
              strokeDashoffset={mediumOffset}
              className="transition-all duration-1000 ease-out"
            />
          )}

          {/* Low Severity Segment */}
          {low > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#3b82f6" // blue-500
              strokeWidth="12"
              strokeDasharray={`${circumference * lowPercent} ${circumference}`}
              strokeDashoffset={lowOffset}
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Issues</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">High ({high})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-400">Med ({medium})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-400">Low ({low})</span>
        </div>
      </div>
    </div>
  );
}
