import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

// Helper to get an authenticated client for a specific installation
function getClient(installationId: number) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      installationId: installationId,
    },
  });
}

export async function getDiffContent(diffUrl: string, installationId: number): Promise<string> {
  const octokit = getClient(installationId);
  const response = await octokit.request({
    method: "GET",
    url: diffUrl,
    headers: {
      Accept: "application/vnd.github.v3.diff", // 👈 Crucial: Asks GitHub for the raw text diff
    },
  });
  return response.data as unknown as string;
}

export async function postComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
  installationId: number
) {
  const octokit = getClient(installationId);
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
}