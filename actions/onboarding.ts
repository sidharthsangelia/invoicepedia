// app/onboarding/actions.ts
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

export type OnboardingActionResult =
  | { success: false; error: string }
  | { success: true ; redirectTo: string};

export async function onboardingAction(
  formData: FormData
): Promise<OnboardingActionResult> {
  const { userId } = await auth();

  if (!userId) return { success: false, error: "UNAUTHENTICATED" };

  const companyName = (formData.get("companyName") as string)?.trim() ?? "";
  const companyEmail = (formData.get("companyEmail") as string)?.trim().toLowerCase() ?? "";
  const companyWebsite = (formData.get("companyWebsite") as string)?.trim() || undefined;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!companyName) return { success: false, error: "Company name is required" };
  if (!companyEmail) return { success: false, error: "Billing email is required" };
      
  
  const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

  // 1. Upsert user + onboarding data
  try {


    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        imageUrl: clerkUser.imageUrl ?? null,
        companyName,
        companyEmail,
        companyWebsite: companyWebsite ?? null,
        isOnboarded: true,
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
        imageUrl: clerkUser.imageUrl ?? null,
        companyName,
        companyEmail,
        companyWebsite: companyWebsite ?? null,
        isOnboarded: true,
      },
    });
  } catch (err) {
    console.error("Failed to upsert user during onboarding:", err);
    return { success: false, error: "Failed to save. Please try again." };
  }

  // 2. Update Clerk metadata
  try {
 
    await client.users.updateUser(userId, {
      publicMetadata: { onboarded: true },
    });
  } catch (err) {
    console.error("Clerk metadata update failed:", err);
    // Don't fail — DB is saved, middleware will catch on next session refresh
  }

  // 3. Clear pendingRedirect is client-side only (sessionStorage)
  // so just redirect — the invoice form's useEffect handles clearing it
  return { success: true, redirectTo };
}