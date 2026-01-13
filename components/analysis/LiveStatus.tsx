"use client";

import { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

interface AnalysisStatus {
  id: string;
  status: string;
  riskScore: number;
  issuesFound: number;
  createdAt: string;
}

interface LiveStatusProps {
  scanId: string;
  initialStatus: string;
}

export function LiveStatus({ scanId, initialStatus }: LiveStatusProps) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [isPolling, setIsPolling] = useState(initialStatus === "PENDING");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/analysis/${scanId}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }

      const data = await response.json();
      setStatus(data);
      setLastUpdate(new Date());
      setError(null);

      // Stop polling if not pending
      if (data.status !== "PENDING") {
        setIsPolling(false);
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("Error fetching analysis status:", err);
    }
  };

  // Poll every 2 seconds when status is PENDING
  useEffect(() => {
    if (!isPolling) return;

    // Initial fetch
    fetchStatus();

    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [scanId, isPolling]);

  // Stop polling when component unmounts or status changes
  useEffect(() => {
    if (status && status.status !== "PENDING") {
      setIsPolling(false);
    }
  }, [status]);

  if (error) {
    return (
      <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
        <Clock className="w-3 h-3" />
        <span>{error}</span>
      </div>
    );
  }

  if (isPolling) {
    return (
      <div className="flex items-center gap-2 mt-2 text-blue-400 text-xs">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span>Scan in progress... auto updating</span>
        <span className="text-gray-500">
          (last check: {lastUpdate.toLocaleTimeString()})
        </span>
      </div>
    );
  }

  if (status) {
    return (
      <div className="flex items-center gap-2 mt-2 text-green-400 text-xs">
        <Clock className="w-3 h-3" />
        <span>Last updated: {new Date(status.createdAt).toLocaleString()}</span>
        {status.status !== initialStatus && (
          <span className="text-emerald-400 font-semibold">
            • Status: {status.status}
          </span>
        )}
      </div>
    );
  }

  return null;
}