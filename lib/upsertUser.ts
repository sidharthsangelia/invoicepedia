import { prisma } from "@/db/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function upsertUser() {
  const user = await currentUser();

  if (!user) return null;

  return await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      imageUrl: user.imageUrl ?? null,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      imageUrl: user.imageUrl ?? null,
    },
  });
}