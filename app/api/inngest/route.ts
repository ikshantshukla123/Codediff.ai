import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processAnalyzePullRequest } from "@/lib/inngest/functions/analyzePullRequest";

// Create an API that serves your functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processAnalyzePullRequest],
});