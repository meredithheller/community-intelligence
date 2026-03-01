import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response(null, { status: 401 });

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      converted: true,
      convertedAt: new Date().toISOString(),
    },
  });

  return new Response(null, { status: 200 });
}
