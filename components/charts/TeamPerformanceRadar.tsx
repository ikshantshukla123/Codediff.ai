"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip, ReferenceLine } from 'recharts';

const data = [
  { subject: 'Security Score', current: 85, target: 95, industry: 72, trend: '+5%', priority: 'HIGH' },
  { subject: 'Performance', current: 78, target: 85, industry: 68, trend: '+3%', priority: 'MEDIUM' },
  { subject: 'Code Quality', current: 92, target: 90, industry: 75, trend: '+8%', priority: 'HIGH' },
  { subject: 'Compliance', current: 88, target: 95, industry: 70, trend: '+12%', priority: 'HIGH' },
  { subject: 'Test Coverage', current: 75, target: 80, industry: 65, trend: '+2%', priority: 'MEDIUM' },
  { subject: 'Documentation', current: 80, target: 85, industry: 60, trend: '+15%', priority: 'LOW' },
  { subject: 'Automation', current: 90, target: 95, industry: 55, trend: '+7%', priority: 'HIGH' },
  { subject: 'Monitoring', current: 82, target: 90, industry: 62, trend: '+4%', priority: 'MEDIUM' },
];

export function TeamPerformanceRadar() {
  const avgCurrent = Math.round(data.reduce((sum, item) => sum + item.current, 0) / data.length);
  const avgTarget = Math.round(data.reduce((sum, item) => sum + item.target, 0) / data.length);
  const avgIndustry = Math.round(data.reduce((sum, item) => sum + item.industry, 0) / data.length);

  const highPriorityCount = data.filter(item => item.priority === 'HIGH').length;
  const improvementAreas = data.filter(item => item.current < item.target).length;
  const aboveIndustry = data.filter(item => item.current > item.industry).length;

  return (
    <div className="h-[32rem] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">👥 Team Performance Radar</h3>
          <p className="text-xs text-gray-400">Multi-dimensional development excellence tracking</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center p-2 bg-blue-900/20 rounded-lg border border-blue-800/50">
            <div className="text-lg font-bold text-blue-400">{avgCurrent}</div>
            <div className="text-gray-400">Current</div>
          </div>
          <div className="text-center p-2 bg-emerald-900/20 rounded-lg border border-emerald-800/50">
            <div className="text-lg font-bold text-emerald-400">{avgTarget}</div>
            <div className="text-gray-400">Target</div>
          </div>
          <div className="text-center p-2 bg-gray-700/50 rounded-lg border border-gray-600/50">
            <div className="text-lg font-bold text-gray-400">{avgIndustry}</div>
            <div className="text-gray-400">Industry</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <defs>
            <radialGradient id="currentGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </radialGradient>
            <radialGradient id="targetGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="70%" stopColor="#10b981" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </radialGradient>
          </defs>

          <PolarGrid
            stroke="#374151"
            strokeWidth={1}
            radialLines={true}
            gridType="polygon"
          />

          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: '500' }}
            tickFormatter={(value) => {
              // Smart truncation with better abbreviations
              const abbreviations: { [key: string]: string } = {
                'Security Score': 'Security',
                'Code Quality': 'Quality',
                'Test Coverage': 'Testing',
                'Documentation': 'Docs'
              };
              return abbreviations[value] || (value.length > 10 ? value.substring(0, 8) + '...' : value);
            }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#6B7280' }}
            tickCount={6}
            stroke="#4B5563"
            tickFormatter={(value) => `${value}`}
          />

          {/* Performance zones */}
          <ReferenceLine r={90} stroke="#10b981" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.3} />
          <ReferenceLine r={75} stroke="#eab308" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.3} />
          <ReferenceLine r={60} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.3} />

          {/* Industry Average (Background) */}
          <Radar
            name="Industry Benchmark"
            dataKey="industry"
            stroke="#6B7280"
            fill="url(#targetGradient)"
            fillOpacity={0.3}
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
          />

          {/* Target Performance */}
          <Radar
            name="Target Goals"
            dataKey="target"
            stroke="#10b981"
            fill="none"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3, stroke: '#1f2937' }}
          />

          {/* Current Performance (Main) */}
          <Radar
            name="Current Performance"
            dataKey="current"
            stroke="#3b82f6"
            fill="url(#currentGradient)"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#1f2937' }}
            filter="drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))"
          />

          <Tooltip
            content={({ payload, label }) => {
              if (!payload?.length) return null;
              const currentData = payload.find(p => p.dataKey === 'current');
              const targetData = payload.find(p => p.dataKey === 'target');
              const industryData = payload.find(p => p.dataKey === 'industry');
              const item = data.find(d => d.subject === label);

              return (
                <div className="bg-gray-900/95 border border-gray-700 p-4 rounded-lg shadow-xl backdrop-blur-sm min-w-[200px]">
                  <div className="border-b border-gray-700 pb-2 mb-3">
                    <p className="font-bold text-white text-sm">{label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item?.priority === 'HIGH' ? 'bg-red-900/50 text-red-300' :
                        item?.priority === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-green-900/50 text-green-300'
                        }`}>
                        {item?.priority} Priority
                      </span>
                      <span className={`text-xs font-semibold ${item?.trend?.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {item?.trend}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Current:</span>
                      <span className="text-blue-400 font-bold">{currentData?.value}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target:</span>
                      <span className="text-emerald-400 font-bold">{targetData?.value}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Industry:</span>
                      <span className="text-gray-400 font-bold">{industryData?.value}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-gray-700">
                      <span className="text-gray-400">Gap to Target:</span>
                      <span className={`font-bold ${Number(targetData?.value || 0) - Number(currentData?.value || 0) > 0 ? 'text-orange-400' : 'text-emerald-400'
                        }`}>
                        {Number(targetData?.value || 0) - Number(currentData?.value || 0) > 0 ? '+' : ''}
                        {Math.abs(Number(targetData?.value || 0) - Number(currentData?.value || 0))}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Enhanced Legend and Performance Summary */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-4 mb-3">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded border border-gray-600"></div>
              <span className="text-gray-300 font-medium">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded border border-gray-600"></div>
              <span className="text-gray-300 font-medium">Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded border border-gray-600"></div>
              <span className="text-gray-300 font-medium">Industry</span>
            </div>
          </div>

          {/* Performance zones */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-400">Excellent (90+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-400">Good (75-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-400">Needs Work (≤75)</span>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center p-2 bg-emerald-900/20 rounded border border-emerald-800/50">
            <div className="text-emerald-400 font-bold text-sm">+{avgCurrent - avgIndustry}</div>
            <div className="text-gray-400">vs Industry</div>
          </div>
          <div className="text-center p-2 bg-blue-900/20 rounded border border-blue-800/50">
            <div className="text-blue-400 font-bold text-sm">{avgTarget - avgCurrent}</div>
            <div className="text-gray-400">to Target</div>
          </div>
          <div className="text-center p-2 bg-purple-900/20 rounded border border-purple-800/50">
            <div className="text-purple-400 font-bold text-sm">{highPriorityCount}</div>
            <div className="text-gray-400">High Priority</div>
          </div>
          <div className="text-center p-2 bg-orange-900/20 rounded border border-orange-800/50">
            <div className="text-orange-400 font-bold text-sm">{aboveIndustry}/{data.length}</div>
            <div className="text-gray-400">Above Industry</div>
          </div>
        </div>
      </div>
    </div>
  );
}