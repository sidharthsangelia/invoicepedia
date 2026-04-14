"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";

export async function deleteInvoiceAction(formData: FormData): Promise<void> {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  const invoiceId = (formData.get("id") as string | null)?.trim();
  if (!invoiceId) throw new Error("Invoice ID is required");

  // Confirm ownership before mutating
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    select: { id: true },
  });

  if (!invoice) throw new Error("Invoice not found");

  // Soft-delete — preserves payment/activity history
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { deletedAt: new Date() },
  });

  redirect("/dashboard");
}