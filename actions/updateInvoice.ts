"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { InvoiceStatus, ActivityType } from "@/generated/prisma/enums";

// Types

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

const VALID_STATUSES = Object.values(InvoiceStatus) as string[];

export async function updateStatusAction(
  formData: FormData,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "UNAUTHENTICATED" };

  const invoiceId = formData.get("id") as string;
  const newStatus = formData.get("status") as string;

  if (!invoiceId) return { success: false, error: "Invoice ID is required" };
  if (!VALID_STATUSES.includes(newStatus))
    return { success: false, error: `Invalid status: ${newStatus}` };

  // Confirm ownership before mutating
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId, deletedAt: null },
    select: { id: true, status: true },
  });

  if (!invoice) return { success: false, error: "Invoice not found" };

  // Map status string → ActivityType where one exists
  const statusToActivity: Partial<Record<InvoiceStatus, ActivityType>> = {
    [InvoiceStatus.SENT]: ActivityType.SENT,
    [InvoiceStatus.VIEWED]: ActivityType.VIEWED,
    [InvoiceStatus.PAID]: ActivityType.PAID,
    [InvoiceStatus.OVERDUE]: ActivityType.OVERDUE,
    [InvoiceStatus.CANCELLED]: ActivityType.CANCELLED,
  };

  const activityType = statusToActivity[newStatus as InvoiceStatus];

  await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus as InvoiceStatus },
    });

    if (activityType) {
      await tx.activity.create({
        data: {
          invoiceId,
          userId,
          type: activityType,
        },
      });
    }
  });

  return { success: true };
}
