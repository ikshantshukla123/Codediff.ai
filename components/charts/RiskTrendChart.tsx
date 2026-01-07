"use client";

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

  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : null;
  const trend = previous ? latest.score - previous.score : 0;

  return (
    <div className="flex flex-col h-full bg-[#111111] rounded-xl border border-[#262626] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Risk Score Trend</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Risk Score</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400 mb-2">{latest.score}</div>
          <div className="text-sm text-gray-400 mb-4">Current Risk Score</div>
          {trend !== 0 && (
            <div className={`text-sm font-semibold ${trend > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)} points {trend > 0 ? 'increase' : 'decrease'}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Last {data.length} scans
          </div>
        </div>
      </div>

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
