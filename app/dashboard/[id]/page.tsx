import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, CheckCircle, FileCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button"; // Reusing your UI
import { Card } from "@/components/ui/Card";     // Reusing your UI

const prisma = new PrismaClient();

// Params are async in Next.js 15
export default async function RepoDetails({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params; // Await the params

  if (!userId) redirect("/");

  // 1. Fetch the Repo & Its Analyses
  const repo = await prisma.repository.findUnique({
    where: { 
      id: id,
      userId: userId // Security: Ensure this user owns the repo
    },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!repo) return notFound(); // Show 404 if not found

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview
        </Link>

        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#262626] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{repo.name}</h1>
            <p className="text-gray-500 font-mono text-sm">ID: {repo.githubRepoId}</p>
          </div>
          <div className="text-right">
             <div className="text-sm text-gray-500 mb-1">Total Scans</div>
             <div className="text-2xl font-semibold text-white">{repo.analyses.length}</div>
          </div>
        </div>

        {/* Scan History List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Security Audits</h2>
          
          {repo.analyses.length === 0 ? (
            <div className="text-center py-12 bg-[#111] rounded-xl border border-[#262626] border-dashed">
              <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-300">No audits found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">
                Create a Pull Request in this repository to trigger the AI Auditor.
              </p>
            </div>
          ) : (
            repo.analyses.map((scan) => (
              <Card key={scan.id} className="flex flex-col md:flex-row justify-between gap-6 hover:border-gray-600 transition-colors">
                
                {/* Left: Metadata */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-mono border border-blue-900/50">
                      PR #{scan.prId}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(scan.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-medium text-white">
                    Status: <span className={scan.status === 'VULNERABLE' ? 'text-red-400' : 'text-emerald-400'}>
                      {scan.status}
                    </span>
                  </div>
                </div>

                {/* Right: Score & Issues */}
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Issues Found</div>
                    <div className="text-xl font-bold text-white">{scan.issuesFound}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Risk Score</div>
                    <div className={`text-2xl font-bold ${
                      scan.riskScore > 50 ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {scan.riskScore}
                    </div>
                  </div>
                  
                  {/* Action Button (We will build this view later) */}
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>

              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}