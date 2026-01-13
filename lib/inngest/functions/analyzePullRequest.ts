import { inngest } from "../client";
import { analyzePullRequest } from "../../ai/orchestrator";
import { prisma } from "../../prisma";

export const processAnalyzePullRequest = inngest.createFunction(
  { id: "analyze-pull-request" },
  { event: "github/pull_request.received" },
  async ({ event, step }) => {
    const { owner, repo, prNumber, installationId, diffUrl, deliveryId } = event.data;

    console.log(`🔄 Processing PR analysis for #${prNumber} (${owner}/${repo}) - delivery: ${deliveryId}`);

    return await step.run("analyze-pull-request", async () => {
      try {
        // Call the existing analysis function
        await analyzePullRequest({
          owner,
          repo,
          prNumber,
          installationId,
          diffUrl
        });

        // Mark webhook as successfully processed
        if (deliveryId) {
          await prisma.webhookLog.update({
            where: { deliveryId },
            data: {
              processed: true,
              processedAt: new Date()
            }
          });
        }

        console.log(`✅ PR analysis completed for #${prNumber} (${owner}/${repo})`);
        return { success: true, prNumber, owner, repo };

      } catch (error) {
        console.error(`❌ PR analysis failed for #${prNumber} (${owner}/${repo}):`, error);

        // Mark webhook as failed
        if (deliveryId) {
          await prisma.webhookLog.update({
            where: { deliveryId },
            data: {
              processed: false,
              processedAt: new Date(),
              error: error instanceof Error ? error.message : String(error)
            }
          }).catch(console.error);
        }

        throw error; // Re-throw to trigger Inngest retry logic
      }
    });
  }
);