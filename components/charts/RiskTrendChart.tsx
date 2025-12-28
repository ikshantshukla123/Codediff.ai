import React from 'react';

interface RiskTrendChartProps {
  data: { date: string; score: number; label: string }[];
}

export function RiskTrendChart({ data }: RiskTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-[#111111] rounded-xl border border-[#262626]">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  // Dimensions
  const width = 100;
  const height = 50;
  const padding = 5;

  // Scales
  const maxScore = Math.max(...data.map(d => d.score), 100); // Default to 100 if all lower
  const minScore = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return width / 2;
    return padding + (index / (data.length - 1)) * (width - 2 * padding);
  };

  const getY = (score: number) => {
    const range = maxScore - minScore;
    const normalized = (score - minScore) / (range || 1);
    return height - padding - (normalized * (height - 2 * padding));
  };

  // Generate Path
  const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');

  // Area Path (for gradient)
  const areaPoints = `
    ${getX(0)},${height} 
    ${points} 
    ${getX(data.length - 1)},${height}
  `;

  return (
    <div className="flex flex-col p-6 bg-[#111111] rounded-xl border border-[#262626] h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Risk Score Trend</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Last {data.length} scans</span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Gradients */}
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines (Horizontal) */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={val}
              x1="0"
              y1={getY(val)}
              x2={width}
              y2={getY(val)}
              stroke="#262626"
              strokeWidth="0.2"
              strokeDasharray="2 2"
            />
          ))}

          {/* Area Fill */}
          {data.length > 1 && (
            <polygon
              points={areaPoints}
              fill="url(#riskGradient)"
            />
          )}

          {/* Line */}
          {data.length > 1 && (
            <polyline
              points={points}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {data.map((d, i) => (
            <g key={i} className="group">
              <circle
                cx={getX(i)}
                cy={getY(d.score)}
                r="1.5"
                fill="#111111"
                stroke="#ef4444"
                strokeWidth="0.5"
                className="transition-all duration-300 group-hover:r-2"
              />
              {/* Tooltip (Simple SVG text, might be clipped, better to use HTML overlay but this is quick) */}
              {/* Using a foreignObject or just relying on hover state in a real app. 
                  For now, let's just show the value on the last point or all points if few. */}
            </g>
          ))}
        </svg>

        {/* X-Axis Labels (HTML overlay for better text rendering) */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-500 transform translate-y-4">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </div>
    </div>
  );
}
