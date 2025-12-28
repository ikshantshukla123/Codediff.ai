import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// Helper to get an app-level client (for listing installations)
function getAppClient() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });
}

// Sync repositories for a user when their githubId is set
export async function syncRepositoriesForUser(userId: string, githubId: number) {
  try {
    const appClient = getAppClient();
    
    // Get all installations for the app
    const { data: installations } = await appClient.rest.apps.listInstallations();
    
    // Find installations that belong to this user (by matching account ID)
    const userInstallations = installations.filter(
      (installation) => installation.account?.id === githubId
    );

    if (userInstallations.length === 0) {
      console.log(`ℹ️ No GitHub installations found for user ${userId} (GitHub ID: ${githubId})`);
      return;
    }

    console.log(`🔄 Syncing repositories for user ${userId} from ${userInstallations.length} installation(s)`);

    // For each installation, get repositories and sync them
    for (const installation of userInstallations) {
      const installationId = installation.id;
      const client = getClient(installationId);
      
      try {
        // Get all repositories for this installation
        const { data: repos } = await client.rest.apps.listReposAccessibleToInstallation();
        
        for (const repo of repos.repositories) {
          try {
            await prisma.repository.upsert({
              where: {
                githubRepoId_userId: {
                  githubRepoId: repo.id,
                  userId: userId,
                },
              },
              update: {
                installationId: installationId,
                name: repo.full_name,
              },
              create: {
                githubRepoId: repo.id,
                name: repo.full_name,
                installationId: installationId,
                userId: userId,
              },
            });
            console.log(`✅ Synced repository: ${repo.full_name}`);
          } catch (error) {
            console.error(`❌ Error syncing repository ${repo.full_name}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching repositories for installation ${installationId}:`, error);
      }
    }
  } catch (error) {
    console.error(`❌ Error syncing repositories for user ${userId}:`, error);
  }
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