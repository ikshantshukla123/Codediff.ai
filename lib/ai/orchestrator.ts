import { findBugsWithOpenRouter } from './providers/openrouter';
import { explainImpactWithGemini } from './providers/gemini';
import { classifyPRWithHuggingFace } from './providers/huggingface'; // 👈 NEW
import { getDiffContent, postComment } from '@/lib/github/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PullRequestData {
  owner: string;
  repo: string;
  prNumber: number;
  installationId: number;
  diffUrl: string;
}

export async function analyzePullRequest(data: PullRequestData) {
  console.log(`🚀 Starting Advanced Ensemble Analysis for PR #${data.prNumber}...`);

  try {
    const diff = await getDiffContent(data.diffUrl, data.installationId);

    // ⚡ RUN AI IN PARALLEL (The "Advanced" part)
    // We start all 3 AI requests at the same time to be faster
    const [bugReport, categories] = await Promise.all([
      findBugsWithOpenRouter(diff),       // DeepSeek
      classifyPRWithHuggingFace(diff)     // Hugging Face 👈
    ]);

    // Pass the categories to Gemini so it knows context
    console.log(`🏷️ Hugging Face tagged this as: ${categories.join(', ')}`);
    
    // Add categories to the diff context for Gemini
    const enrichedDiff = `Categories: ${categories.join(', ')}\n\n${diff}`;
    
    // Gemini explains impact (using data from DeepSeek + HuggingFace)
    const finalReport = await explainImpactWithGemini(
      bugReport, // Pass bug report
      enrichedDiff // Pass enriched diff with categories
    );

    // Calculate Risk Score
    const riskScore = Math.min(
      (bugReport.bugs.length * 10) + 
      (bugReport.bugs.filter((b) => b.severity === "HIGH").length * 20), 
      100
    );

    // Find the repository by name and installation ID
    const repository = await prisma.repository.findFirst({
      where: {
        name: `${data.owner}/${data.repo}`,
        installationId: data.installationId
      }
    });

    if (!repository) {
      console.error(`❌ Repository not found: ${data.owner}/${data.repo}`);
      return;
    }

    // Determine status based on risk score
    const status = riskScore > 70 ? "VULNERABLE" : riskScore > 40 ? "WARNING" : "SECURE";
    const issuesFound = bugReport.bugs.length;

    // 💾 SAVE TO DATABASE
    console.log("💾 Saving Deep Analysis to NeonDB...");
    await prisma.analysis.create({
      data: {
        repositoryId: repository.id,
        prNumber: data.prNumber,
        riskScore: riskScore,
        status: status,
        issuesFound: issuesFound,
        bugs: JSON.parse(JSON.stringify(bugReport.bugs)) // Store as JSON - ensure proper serialization
      }
    });

    // Post to GitHub
    await postComment(data.owner, data.repo, data.prNumber, finalReport, data.installationId);
    
    console.log(`✅ Success! Analysis Complete.`);
  } catch (error) {
    console.error("🔥 Orchestrator Failed:", error);
  }
}