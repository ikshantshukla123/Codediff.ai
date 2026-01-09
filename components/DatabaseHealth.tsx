"use client";
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DatabaseStatus {
  status: string;
  database: string;
  stats?: {
    repositories: number;
    analyses: number;
  };
  error?: string;
  suggestion?: string;
}

export function DatabaseHealth() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        status: 'error',
        database: 'unreachable',
        error: 'Failed to reach health endpoint'
      });
    } finally {
      setLoading(false);
    }
  };

  const warmDatabase = async () => {
    setLoading(true);
    try {
      await fetch('/api/health', { method: 'POST' });
      await checkHealth(); // Refresh status after warming
    } catch (error) {
      console.error('Failed to warm database:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <Card className="animate-pulse">
        <div className="h-20 bg-gray-800 rounded"></div>
      </Card>
    );
  }

  const isHealthy = status.status === 'healthy';

  return (
    <Card className={`border ${isHealthy ? 'border-green-900/50' : 'border-red-900/50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isHealthy ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <div>
            <h3 className="font-semibold text-white">Database Status</h3>
            <p className={`text-sm ${isHealthy ? 'text-green-300' : 'text-red-300'}`}>
              {isHealthy ? 'Connected & Healthy' : 'Connection Issues'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status.stats && (
            <div className="text-right text-sm text-gray-400 mr-4">
              <div>{status.stats.repositories} repos</div>
              <div>{status.stats.analyses} analyses</div>
            </div>
          )}

          <Button
            onClick={isHealthy ? checkHealth : warmDatabase}
            disabled={loading}
            size="sm"
            variant={isHealthy ? 'outline' : 'primary'}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Working...' : isHealthy ? 'Refresh' : 'Warm DB'}
          </Button>
        </div>
      </div>

      {status.error && (
        <div className="mt-3 p-3 bg-red-950/20 border border-red-900/30 rounded text-sm">
          <p className="text-red-300">{status.error}</p>
          {status.suggestion && (
            <p className="text-gray-400 mt-1">{status.suggestion}</p>
          )}
        </div>
      )}
    </Card>
  );
}