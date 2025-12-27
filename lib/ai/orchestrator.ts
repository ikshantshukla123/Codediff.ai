// lib/ai/orchestrator.ts
import { findBugsWithOpenRouter } from './providers/openrouter'; // 👈 Using DeepSeek
import { explainImpactWithGemini } from './providers/gemini';    // 👈 Using Google
import { getDiffContent, postComment } from '@/lib/github/client';

export async function analyzePullRequest(data: any) {
  console.log(`🚀 Starting Ensemble Analysis (DeepSeek + Gemini) for PR #${data.prNumber}...`);

  try {
    // 1. Get Code
    const diff = await getDiffContent(data.diffUrl, data.installationId);

    // 2. DeepSeek finds the bugs (The "Sniper")
    console.log("🕵️‍♂️ DeepSeek (via OpenRouter) is hunting for bugs...");
    const bugReport = await findBugsWithOpenRouter(diff);

    // 3. Gemini explains the cost (The "CFO")
    console.log("💼 Gemini 1.5 is calculating financial impact...");
    // We pass the DeepSeek bugs to Gemini here
    const finalReport = await explainImpactWithGemini(bugReport, diff);

    // 4. Post to GitHub
    await postComment(data.owner, data.repo, data.prNumber, finalReport, data.installationId);
    
    console.log(`✅ Success! Ensemble Analysis posted on PR #${data.prNumber}`);
  } catch (error) {
    console.error("🔥 Orchestrator Failed:", error);
  }
}