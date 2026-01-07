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
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">85</div>
          <div className="text-sm text-gray-400 mb-4">Average Risk Score</div>
          <div className="text-lg font-semibold text-emerald-400 mb-2">$45,230</div>
          <div className="text-xs text-gray-400">Average Potential Loss</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-gray-600 bg-red-500"></div>
            <span className="text-gray-400 font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-gray-600 bg-orange-500"></div>
            <span className="text-gray-400 font-medium">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-gray-600 bg-yellow-500"></div>
            <span className="text-gray-400 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-gray-600 bg-green-500"></div>
            <span className="text-gray-400 font-medium">Low</span>
          </div>
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
