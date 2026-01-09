"use client";

import { useState, useEffect } from "react";
import { Github, ArrowRight, ArrowLeft, ArrowRight as ArrowNext } from "lucide-react";
import Link from "next/link";
import { SyncButton } from "@/components/SyncButton";

function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 py-12 px-6">
      <div className="h-10 w-48 bg-[#1a1a1a] rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="h-40 bg-[#1a1a1a] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

interface Repository {
  id: string;
  name: string;
  createdAt: string;
  analyses: {
    riskScore: number;
    createdAt: string;
  }[];
}

export default function RepositoriesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ repositories: Repository[], pagination: any } | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/repositories?page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [page]);

  if (loading && !data) return <div className="min-h-screen bg-[#0a0a0a] text-white pb-20"><LoadingSkeleton /></div>;

  const { repositories = [], pagination } = data || {};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/10 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Repositories</h1>
          <p className="text-[#a1a1aa] text-sm mt-2">
            Manage and view all your connected codebases.
          </p>
        </div>

        {/* Sync Button */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Sync Data</h2>
          <p className="text-gray-400 text-sm mb-4">
            If you don't see your repositories or user data, use these buttons to manually sync with GitHub:
          </p>
          <SyncButton />
        </div>

        {repositories.length === 0 ? (
          <div className="text-center py-20 text-[#525252]">
            No repositories found. Try syncing your GitHub data above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {repositories.map((repo: Repository) => {
              const lastScan = repo.analyses?.[0];
              const riskScore = lastScan?.riskScore || 0;
              const securityScore = 100 - riskScore;

              let statusColor = riskScore > 70 ? "text-red-500" : riskScore > 40 ? "text-yellow-500" : "text-emerald-500";
              let statusBg = riskScore > 70 ? "bg-red-500/10" : riskScore > 40 ? "bg-yellow-500/10" : "bg-emerald-500/10";
              let statusBorder = riskScore > 70 ? "border-red-500/20" : riskScore > 40 ? "border-yellow-500/20" : "border-emerald-500/20";
              let statusText = riskScore > 70 ? "Critical" : riskScore > 40 ? "Warning" : "Secure";

              return (
                <Link key={repo.id} href={`/dashboard/${repo.id}`} className="block h-full">
                  <PremiumCard className="h-full flex flex-col justify-between group hover:border-[#525252] transition-colors cursor-pointer hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-[#1a1a1a] rounded border border-[#262626] shrink-0">
                            <Github className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-white break-all leading-tight truncate">
                            {repo.name}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold">
                          <span className={statusColor}>{statusText}</span>
                          <span className="text-white">{securityScore}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                            style={{ width: `${securityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#262626] flex justify-between items-center text-xs text-[#525252] font-mono">
                      <span>{lastScan ? new Date(lastScan.createdAt).toLocaleDateString() : "No scans"}</span>
                      <ArrowRight className="w-3 h-3 group-hover:text-white transition-colors" />
                    </div>
                  </PremiumCard>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-4 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center px-4 py-2 rounded bg-[#111] border border-[#262626] text-white disabled:opacity-50 hover:bg-[#222] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </button>
            <div className="flex items-center px-4 text-[#a1a1aa]">
              Page {page} of {pagination.pages}
            </div>
            <button
              disabled={page === pagination.pages}
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              className="flex items-center px-4 py-2 rounded bg-[#111] border border-[#262626] text-white disabled:opacity-50 hover:bg-[#222] transition-colors"
            >
              Next <ArrowNext className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
