"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { InvoiceStatus } from "@/generated/prisma/enums";

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

interface LineItemInput {
  description: string;
  quantity: number;
  unitAmount: number; // in dollars — we convert to cents inside
}

interface CreateInvoiceInput {
  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;

  // Invoice
  invoiceNumber?: string;
  currency?: string;
  notes?: string;
  dueDate?: string; // ISO string from form input type="date"

  // Line items — at least one required
  lineItems: LineItemInput[];
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function parseLineItems(formData: FormData): LineItemInput[] {
  // Expects form fields like:
  // lineItems[0][description], lineItems[0][quantity], lineItems[0][unitAmount]
  // lineItems[1][description], lineItems[1][quantity], lineItems[1][unitAmount]
  const items: LineItemInput[] = [];
  let index = 0;

  while (formData.has(`lineItems[${index}][description]`)) {
    const description = formData.get(
      `lineItems[${index}][description]`,
    ) as string;
    const quantity = parseInt(
      formData.get(`lineItems[${index}][quantity]`) as string,
      10,
    );
    const unitAmount = parseFloat(
      formData.get(`lineItems[${index}][unitAmount]`) as string,
    );

    if (description && !isNaN(quantity) && !isNaN(unitAmount)) {
      items.push({ description, quantity, unitAmount });
    }

    index++;
  }

  return items;
}

function generateInvoiceNumber(): string {
  // INV-1749823 style — timestamp suffix keeps it unique without a DB query
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${timestamp}`;
}

function validateInput(input: CreateInvoiceInput): string | null {
  if (!input.customerName.trim()) return "Customer name is required";
  if (!input.customerEmail.trim()) return "Customer email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail))
    return "Invalid customer email";
  if (input.lineItems.length === 0) return "At least one line item is required";

  for (const [i, item] of input.lineItems.entries()) {
    if (!item.description.trim())
      return `Line item ${i + 1}: description is required`;
    if (item.quantity < 1)
      return `Line item ${i + 1}: quantity must be at least 1`;
    if (item.unitAmount <= 0)
      return `Line item ${i + 1}: amount must be greater than 0`;
  }

  return null; // valid
}

// -----------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------

export type CreateInvoiceActionResult =
  | { success: false; error: string }
  | { success: true; invoiceId: string };

export async function createInvoiceAction(
  formData: FormData,
): Promise<CreateInvoiceActionResult> {
  // 1. Auth check
  const { userId, orgId } = await auth();

  if (!userId) {
    // Return instead of redirect so the form can handle it
    // (e.g. show a sign-in modal or redirect to /sign-in)
    return { success: false, error: "UNAUTHENTICATED" };
  }

  // 2. Parse form data
  const input: CreateInvoiceInput = {
    customerName: (formData.get("customerName") as string)?.trim() ?? "",
    customerEmail:
      (formData.get("customerEmail") as string)?.trim().toLowerCase() ?? "",
    customerPhone:
      (formData.get("customerPhone") as string)?.trim() || undefined,
    customerAddress:
      (formData.get("customerAddress") as string)?.trim() || undefined,
    invoiceNumber:
      (formData.get("invoiceNumber") as string)?.trim() || undefined,
    currency: (formData.get("currency") as string)?.trim() || "USD",
    notes: (formData.get("notes") as string)?.trim() || undefined,
    dueDate: (formData.get("dueDate") as string) || undefined,
    lineItems: parseLineItems(formData),
  };

  // 3. Validate
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  // 4. Upsert user — guaranteed sync point, runs once on first invoice creation
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name:
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
          null,
        imageUrl: clerkUser.imageUrl ?? null,
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        name:
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
          null,
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to upsert user:", err);
    return { success: false, error: "Failed to sync user. Please try again." };
  }

  // 5. Upsert customer — same email + userId = same customer, no duplicates
  // Uses upsert so repeat invoices to the same client don't create duplicate customers
  let customer;
  try {
    customer = await prisma.customer.upsert({
      where: {
        email_userId: {
          email: input.customerEmail,
          userId,
        },
      },
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
    return {
      success: false,
      error: "Failed to save customer. Please try again.",
    };
  }

  // 6. Create invoice + line items + activity log in one transaction
  // Atomic — if any part fails, nothing gets written
  let invoice;
  try {
    invoice = await prisma.$transaction(async (tx) => {
      const newInvoice = await tx.invoice.create({
        data: {
          userId,
          customerId: customer.id,
          organizationId: orgId ?? null,
          status: InvoiceStatus.DRAFT,
          invoiceNumber: input.invoiceNumber ?? generateInvoiceNumber(),
          currency: input.currency ?? "USD",
          notes: input.notes ?? null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          lineItems: {
            create: input.lineItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitAmount: Math.round(item.unitAmount * 100), // dollars → cents
            })),
          },
        },
        select: { id: true },
      });

      // Activity log — tracks the full history of every invoice
      await tx.activity.create({
        data: {
          invoiceId: newInvoice.id,
          userId,
          type: "CREATED",
        },
      });

      return newInvoice;
    });
  } catch (err) {
    console.error("Failed to create invoice:", err);
    return {
      success: false,
      error: "Failed to create invoice. Please try again.",
    };
  }

  // 7. Redirect outside try/catch — Next.js redirect() throws internally
  redirect(`/invoices/${invoice.id}`);
}
