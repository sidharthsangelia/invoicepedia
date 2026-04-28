// /types/invoice.ts

import { Prisma } from "@/generated/prisma/client";

 
// ─────────────────────────────────────────────────────────────
// Base Prisma-powered invoice type (SOURCE OF TRUTH)
// ─────────────────────────────────────────────────────────────

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    customer: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
        address: true;
      };
    };
    lineItems: {
      select: {
        id: true;
        description: true;
        quantity: true;
        unitAmount: true;
      };
    };
    activities: {
      select: {
        id: true;
        createdAt: true;
        type: true;
        note: true;
      };
    };
  };
}>;

// ─────────────────────────────────────────────────────────────
// User company info (separate concern)
// ─────────────────────────────────────────────────────────────

export interface UserCompany {
  companyName: string | null;
  companyEmail: string | null;
  companyWebsite: string | null;
  companyLogoUrl: string | null;
}

// ─────────────────────────────────────────────────────────────
// PDF-friendly invoice (optional refinement)
// ─────────────────────────────────────────────────────────────

// If you want a cleaner type for PDF templates
export type InvoiceForPDF = Omit<
  InvoiceWithRelations,
  "updatedAt" | "activities" | "deletedAt" | "organizationId" | "userId"
>;