"use client";

interface SeverityPieChartProps {
  high: number;
  medium: number;
  low: number;
}

export function SeverityPieChart({ high, medium, low }: SeverityPieChartProps) {
  const total = high + medium + low;

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-xl border border-[#262626] p-4">
      <h3 className="text-lg font-semibold text-white mb-1">Severity Distribution</h3>
      <p className="text-xs text-gray-400 mb-4">Breakdown of issues by severity level</p>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">{total}</div>
          <div className="text-sm text-gray-400">Total Issues</div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-400">High: {high}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-400">Medium: {medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Low: {low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
