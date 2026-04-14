"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { InvoiceStatus, ActivityType } from "@/generated/prisma/enums";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const VALID_STATUSES = new Set(Object.values(InvoiceStatus));

export async function updateStatusAction(
  formData: FormData,
): Promise<ActionResult> {
  const { userId, orgId } = await auth();
  if (!userId) return { success: false, error: "UNAUTHENTICATED" };

  const invoiceId = (formData.get("id") as string | null)?.trim();
  const newStatus = (formData.get("status") as string | null)?.trim();

  if (!invoiceId) return { success: false, error: "Invoice ID is required" };
  if (!newStatus || !VALID_STATUSES.has(newStatus as InvoiceStatus))
    return { success: false, error: `Invalid status: ${newStatus}` };

  // Confirm ownership before mutating — scoped to org or personal
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    select: { id: true, status: true },
  });

  if (!invoice) return { success: false, error: "Invoice not found" };

  // No-op if status hasn't changed
  if (invoice.status === newStatus) return { success: true };

  const statusToActivity: Partial<Record<InvoiceStatus, ActivityType>> = {
    [InvoiceStatus.SENT]: ActivityType.SENT,
    [InvoiceStatus.VIEWED]: ActivityType.VIEWED,
    [InvoiceStatus.PAID]: ActivityType.PAID,
    [InvoiceStatus.OVERDUE]: ActivityType.OVERDUE,
    [InvoiceStatus.CANCELLED]: ActivityType.CANCELLED,
  };

  const activityType = statusToActivity[newStatus as InvoiceStatus];

  try {
    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus as InvoiceStatus },
      });

      if (activityType) {
        await tx.activity.create({
          data: { invoiceId, userId, type: activityType },
        });
      }
    });
  } catch (err) {
    console.error("updateStatusAction failed:", err);
    return { success: false, error: "Failed to update status. Please try again." };
  }

  // Revalidate so the server component re-fetches fresh data
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");

  return { success: true };
}