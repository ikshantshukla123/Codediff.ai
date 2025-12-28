import { findBugsWithOpenRouter } from './providers/openrouter';
import { explainImpactWithGemini } from './providers/gemini';
import { classifyPRWithHuggingFace } from './providers/huggingface'; // 👈 NEW
import { getDiffContent, postComment } from '@/lib/github/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function analyzePullRequest(data: any) {
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
    
    // Gemini explains impact (using data from DeepSeek + HuggingFace)
    const finalReport = await explainImpactWithGemini(
      { ...bugReport, categories }, // Combine data
      diff
    );

    // Calculate Risk Score
    const riskScore = Math.min(
      (bugReport.bugs.length * 10) + 
      (bugReport.bugs.filter((b: any) => b.severity === "HIGH").length * 20), 
      100
    );

    // 💾 SAVE TO DATABASE
    console.log("💾 Saving Deep Analysis to NeonDB...");
    await prisma.analysis.create({
      data: {
        repoName: data.repo,
        prNumber: data.prNumber,
        riskScore: riskScore,
        financialRisk: categories.join(', '), // We'll save the Tags here for now to show on Dashboard
        bugs: JSON.stringify(bugReport.bugs)
      }
    });

    // Post to GitHub
    await postComment(data.owner, data.repo, data.prNumber, finalReport, data.installationId);
    
    console.log(`✅ Success! Analysis Complete.`);
  } catch (error) {
    console.error("🔥 Orchestrator Failed:", error);
  }
}