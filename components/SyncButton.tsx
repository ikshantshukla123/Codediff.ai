"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Github, User, Database } from 'lucide-react';

interface SyncResult {
  success: boolean;
  user?: {
    name: string;
    email: string;
    githubConnected: boolean;
    githubId: number | null;
  };
  repositoryCount?: number;
  error?: string;
}

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const syncUserData = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Refresh the page after successful sync
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to connect to server'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncRepositories = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`Success! Synced repositories. Found ${data.repositoryCount} repositories.`);
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to sync repositories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={syncUserData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <User className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync User Data
        </Button>

        <Button
          onClick={syncRepositories}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Github className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync Repositories
        </Button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg border text-sm ${result.success
            ? 'bg-green-950/20 border-green-900/50 text-green-300'
            : 'bg-red-950/20 border-red-900/50 text-red-300'
          }`}>
          {result.success ? (
            <div>
              <div className="font-semibold mb-2">✅ Sync Successful!</div>
              {result.user && (
                <div className="space-y-1 text-xs">
                  <div>👤 {result.user.name}</div>
                  <div>📧 {result.user.email}</div>
                  <div>
                    {result.user.githubConnected ? (
                      <>🔗 GitHub Connected (ID: {result.user.githubId})</>
                    ) : (
                      <span className="text-yellow-400">⚠️ GitHub Not Connected</span>
                    )}
                  </div>
                  <div>📂 {result.repositoryCount || 0} repositories synced</div>
                </div>
              )}
              <div className="mt-2 text-gray-400">Page will refresh in 2 seconds...</div>
            </div>
          ) : (
            <div>
              <div className="font-semibold mb-1">❌ Sync Failed</div>
              <div>{result.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}