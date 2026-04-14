"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";
import { InvoiceStatus } from "@/generated/prisma/enums";

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

interface LineItemInput {
  description: string;
  quantity: number;
  unitAmount: number; // dollars — converted to cents inside
}

interface UpdateInvoiceInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  invoiceNumber?: string;
  currency?: string;
  notes?: string;
  dueDate?: string;
  lineItems: LineItemInput[];
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function parseLineItems(formData: FormData): LineItemInput[] {
  const items: LineItemInput[] = [];
  let index = 0;
  while (formData.has(`lineItems[${index}][description]`)) {
    const description = formData.get(`lineItems[${index}][description]`) as string;
    const quantity = parseInt(formData.get(`lineItems[${index}][quantity]`) as string, 10);
    const unitAmount = parseFloat(formData.get(`lineItems[${index}][unitAmount]`) as string);
    if (description && !isNaN(quantity) && !isNaN(unitAmount)) {
      items.push({ description, quantity, unitAmount });
    }
    index++;
  }
  return items;
}

function validateInput(input: UpdateInvoiceInput): string | null {
  if (!input.customerName.trim()) return "Customer name is required";
  if (!input.customerEmail.trim()) return "Customer email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail))
    return "Invalid customer email";
  if (input.lineItems.length === 0) return "At least one line item is required";
  for (const [i, item] of input.lineItems.entries()) {
    if (!item.description.trim()) return `Line item ${i + 1}: description is required`;
    if (item.quantity < 1) return `Line item ${i + 1}: quantity must be at least 1`;
    if (item.unitAmount <= 0) return `Line item ${i + 1}: amount must be greater than 0`;
  }
  return null;
}

// -----------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------

export type UpdateInvoiceActionResult =
  | { success: false; error: string }
  | { success: true };

export async function updateInvoiceAction(
  formData: FormData,
): Promise<UpdateInvoiceActionResult> {
  const { userId, orgId } = await auth();
  if (!userId) return { success: false, error: "UNAUTHENTICATED" };

  const invoiceId = (formData.get("invoiceId") as string | null)?.trim();
  if (!invoiceId) return { success: false, error: "Invoice ID is required" };

  // Confirm invoice exists, belongs to user/org, and is still DRAFT
  const existing = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      status: InvoiceStatus.DRAFT, // only DRAFT invoices can be edited
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    select: { id: true, customerId: true },
  });

  if (!existing) {
    return {
      success: false,
      error: "Invoice not found or cannot be edited (only Draft invoices can be updated).",
    };
  }

  const input: UpdateInvoiceInput = {
    customerName: (formData.get("customerName") as string)?.trim() ?? "",
    customerEmail: (formData.get("customerEmail") as string)?.trim().toLowerCase() ?? "",
    customerPhone: (formData.get("customerPhone") as string)?.trim() || undefined,
    customerAddress: (formData.get("customerAddress") as string)?.trim() || undefined,
    invoiceNumber: (formData.get("invoiceNumber") as string)?.trim() || undefined,
    currency: (formData.get("currency") as string)?.trim() || "USD",
    notes: (formData.get("notes") as string)?.trim() || undefined,
    dueDate: (formData.get("dueDate") as string) || undefined,
    lineItems: parseLineItems(formData),
  };

  const validationError = validateInput(input);
  if (validationError) return { success: false, error: validationError };

  // Upsert customer (same as create flow)
  let customer;
  try {
    customer = await prisma.customer.upsert({
      where: { email_userId: { email: input.customerEmail, userId } },
      update: {
        name: input.customerName,
        phone: input.customerPhone ?? null,
        address: input.customerAddress ?? null,
      },
      create: {
        name: input.customerName,
        email: input.customerEmail,
        phone: input.customerPhone ?? null,
        address: input.customerAddress ?? null,
        userId,
        organizationId: orgId ?? null,
      },
      select: { id: true },
    });
  } catch (err) {
    console.error("Failed to upsert customer:", err);
    return { success: false, error: "Failed to save customer. Please try again." };
  }

  // Update invoice + replace all line items atomically
  try {
    await prisma.$transaction(async (tx) => {
      // Delete old line items and recreate — simplest correct approach for edits
      await tx.lineItem.deleteMany({ where: { invoiceId } });

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          customerId: customer.id,
          invoiceNumber: input.invoiceNumber ?? undefined,
          currency: input.currency ?? "USD",
          notes: input.notes ?? null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          lineItems: {
            create: input.lineItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitAmount: Math.round(item.unitAmount * 100),
            })),
          },
        },
      });
    });
  } catch (err) {
    console.error("Failed to update invoice:", err);
    return { success: false, error: "Failed to update invoice. Please try again." };
  }

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");

  redirect(`/invoices/${invoiceId}`);
}