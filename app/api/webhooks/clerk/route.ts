import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { syncRepositoriesForUser } from '@/lib/github/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('❌ Missing CLERK_WEBHOOK_SECRET in .env')
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify the payload
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  // Handle the Event
  const eventType = evt.type
  
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url, external_accounts } = evt.data;
    
    // 1. Get the best possible name
    const primaryName = first_name 
      ? `${first_name} ${last_name || ''}`.trim() 
      : username;

    // 2. Extract GitHub ID safely (Crucial for Repo Sync!)
    // We look through connected accounts to find the one that is 'oauth_github'
    const githubAccount = external_accounts?.find((acc: { provider: string; provider_user_id?: string }) => acc.provider === 'oauth_github');
    const githubId = githubAccount?.provider_user_id ? parseInt(githubAccount.provider_user_id) : null;

    try {
      // 3. Check if this is a new githubId being set (user just connected GitHub)
      const existingUser = await prisma.user.findUnique({ where: { id: id } });
      const isNewGithubConnection = !existingUser?.githubId && githubId !== null;

      // 4. UPSERT: The Magic Fix 🪄
      // Instead of failing if the user exists, we UPDATE them.
      await prisma.user.upsert({
        where: { id: id }, // Look for user by Clerk ID
        update: {
          email: email_addresses[0].email_address,
          name: primaryName,
          avatar: image_url,
          githubId: githubId // Keep this synced
        },
        create: {
          id: id,
          email: email_addresses[0].email_address,
          name: primaryName || 'Unknown User',
          avatar: image_url,
          githubId: githubId
        }
      });
      console.log(`✅ Synced User: ${primaryName} (GitHub ID: ${githubId})`);

      // 5. If this is a new GitHub connection, sync repositories
      if (isNewGithubConnection && githubId !== null) {
        console.log(`🔄 New GitHub connection detected, syncing repositories...`);
        // Sync repositories in the background (don't await to avoid blocking webhook response)
        syncRepositoriesForUser(id, githubId).catch(console.error);
      }
    
    } catch (dbError) {
      console.error('❌ Database Sync Error:', dbError);
      return new Response('Database error', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 })
}