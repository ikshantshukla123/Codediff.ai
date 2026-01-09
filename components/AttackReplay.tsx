"use client";
import { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Unlock } from 'lucide-react';

export function AttackReplay({ proof }: { proof: any }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (proof) {
      // Animate the hacking steps
      const timers = [
        setTimeout(() => setStep(1), 500),  // Detect
        setTimeout(() => setStep(2), 1500), // Inject
        setTimeout(() => setStep(3), 2500), // Bypass
        setTimeout(() => setStep(4), 3500), // Success
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [proof]);

  if (!proof) return null;

  return (
    <div className="w-full bg-[#0d1117] border border-red-500/30 rounded-lg overflow-hidden font-mono text-sm shadow-2xl my-6">
      <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-xs">root@codediff-sandbox:~</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="p-4 space-y-3 min-h-45">
        {/* Step 1 */}
        <div className={`transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-blue-400">➜</span> <span className="text-gray-300">target_scan</span> <span className="text-purple-400">--mode=sql</span>
          <div className="mt-1 pl-4 text-gray-500">[+] Target identified: "{proof.target}"</div>
        </div>

        {/* Step 2 */}
        <div className={`transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-blue-400">➜</span> <span className="text-gray-300">inject_payload</span> <span className="text-yellow-400">"{proof.payload}"</span>
        </div>

        {/* Step 3 */}
        <div className={`transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mt-2 pl-4 p-3 bg-red-950/20 border-l-2 border-red-500 text-red-200">
            <div className="flex items-center gap-2 mb-1">
              <Unlock className="w-4 h-4 text-red-500" />
              <span className="font-bold">CRITICAL: LOGIC BYPASS CONFIRMED</span>
            </div>
            <div className="opacity-70 text-xs">Query became: {proof.result_query}</div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`transition-opacity duration-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'} mt-4`}>
          <span className="text-red-500 font-bold animate-pulse">_VULNERABILITY PROVEN.</span>
        </div>
      </div>
    </div>
  );
}