import { findBugsWithOpenRouter } from './providers/openrouter';
import { explainImpactWithGemini } from './providers/gemini';
import { classifyPRWithHuggingFace } from './providers/huggingface'; // 👈 NEW
import { getDiffContent, postComment } from '@/lib/github/client';
import { prisma } from '../prisma';

interface PullRequestData {
  owner: string;
  repo: string;
  prNumber: number;
  installationId: number;
  diffUrl: string;
}
export async function analyzePullRequest(data: PullRequestData) {
  console.log(`🚀 Starting Analysis for PR #${data.prNumber} (${data.owner}/${data.repo})...`);

  try {
    // 1. Fetch Diff & Run AI
    const diff = await getDiffContent(data.diffUrl, data.installationId);

    const [bugReport, categories] = await Promise.all([
      findBugsWithOpenRouter(diff),
      classifyPRWithHuggingFace(diff)
    ]);

    console.log(`🏷️ Categories: ${categories.join(', ')}`);

    const enrichedDiff = `Categories: ${categories.join(', ')}\n\n${diff}`;
    const finalReport = await explainImpactWithGemini(bugReport, enrichedDiff);

    const riskScore = Math.min(
      (bugReport.bugs.length * 10) +
      (bugReport.bugs.filter((b: any) => b.severity === "HIGH").length * 20),
      100
    );
    const status = riskScore > 70 ? "VULNERABLE" : riskScore > 40 ? "WARNING" : "SECURE";

    // 🔍 2. ROBUST DATABASE LOOKUP (THE FIX)
    // We search by name ONLY first, ignoring case sensitivity.
    console.log(`🔍 Looking for repo "${data.owner}/${data.repo}" in DB...`);

    const repository = await prisma.repository.findFirst({
      where: {
        name: {
          equals: `${data.owner}/${data.repo}`,
          mode: 'insensitive' // Matches "Ikshant/Repo" with "ikshant/repo"
        }
      }
    });

    if (!repository) {
      console.error(`❌ CRITICAL: Repo "${data.owner}/${data.repo}" NOT found in DB.`);
      console.error("💡 HINT: Go to Dashboard -> Add Repository to ensure it is tracked.");
      return; // Stop here if no repo found
    }

    // Self-Heal: Update Installation ID if it changed (e.g. reinstall)
    if (repository.installationId !== data.installationId) {
      console.log(`🔄 Updating Installation ID from ${repository.installationId} to ${data.installationId}...`);
      await prisma.repository.update({
        where: { id: repository.id },
        data: { installationId: data.installationId }
      });
    }

    // 💾 3. SAVE TO DATABASE
    console.log(`💾 Saving Analysis (Risk: ${riskScore}, Bugs: ${bugReport.bugs.length})...`);

    // SANITIZATION: Clean the bugs array to ensure it's valid JSON for Postgres
    const cleanBugs = bugReport.bugs.map((b: any) => ({
      type: b.type || "Issue",
      severity: b.severity || "LOW",
      description: b.description || "No description provided",
      file: b.file || "unknown",
      line: b.line || 0,
      recommendation: b.recommendation || b.fix || "Check code manually"
    }));

    try {
      const analysis = await prisma.analysis.create({
        data: {
          repositoryId: repository.id,
          prNumber: data.prNumber,
          riskScore: riskScore,
          status: status,
          issuesFound: cleanBugs.length,
          bugs: cleanBugs as any // Now guaranteed to be clean JSON
        }
      });

      console.log(`✅ SUCCESS: Analysis saved with ID: ${analysis.id}`);

      // 4. Post to GitHub with Dashboard Link
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/${repository.id}/scan/${analysis.id}`;
      const reportWithLink = `${finalReport}\n\n---\n[📊 View Detailed Analysis Dashboard](${dashboardUrl})`;

      await postComment(data.owner, data.repo, data.prNumber, reportWithLink, data.installationId);

    } catch (dbError) {
      // 🚨 THIS IS WHERE IT WAS FAILING BEFORE
      console.error("❌ CRITICAL DATABASE ERROR:", dbError);
      console.error("⚠️ Payload that failed:", JSON.stringify({ riskScore, bugs: cleanBugs }));

      // Fallback: Post comment without link so you still see results
      await postComment(data.owner, data.repo, data.prNumber, finalReport, data.installationId);
    }

  } catch (error) {
    console.error("🔥 Orchestrator Failed:", error);
  }
}