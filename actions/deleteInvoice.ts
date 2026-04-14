"use server";

import { auth } from "@clerk/nextjs/server";
import { ActionResult } from "./updateInvoice";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

export async function deleteInvoiceAction(
  formData: FormData
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "UNAUTHENTICATED" };

  const invoiceId = formData.get("id") as string;
  if (!invoiceId) return { success: false, error: "Invoice ID is required" };

  // Confirm ownership
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId, deletedAt: null },
    select: { id: true },
  });

  if (!invoice) return { success: false, error: "Invoice not found" };

  // Soft-delete — preserves payment/activity history
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { deletedAt: new Date() },
  });

  redirect("/invoices");
}