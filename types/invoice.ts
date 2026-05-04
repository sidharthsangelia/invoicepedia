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

export type InvoiceForPDF = Omit<
  InvoiceWithRelations,
  "updatedAt" | "activities" | "deletedAt" | "organizationId" | "userId"
>;

// ─────────────────────────────────────────────────────────────
// Template ID  — shared across dialog, builder, registry
// (Previously a local type inside InvoicePDFDialog — now canonical here)
// ─────────────────────────────────────────────────────────────

export type TemplateId = "classic" | "modern" | "mono" | "luxe";

// ─────────────────────────────────────────────────────────────
// Preview types  — used by the live builder preview only
//
// IMPORTANT: unitAmount here is in DOLLARS (what the user types in the form).
// This is intentionally different from InvoiceForPDF / LineItem where
// unitAmount is stored in CENTS in the DB.
//
// Boundary:
//   Form input  → PreviewData (dollars) → Preview components
//   DB / Prisma → InvoiceForPDF (cents) → PDF templates
//   Server action multiplies dollars × 100 before writing to DB.
// ─────────────────────────────────────────────────────────────

export interface PreviewLineItem {
  description: string;
  quantity: number;
  unitAmount: number; // dollars — e.g. 1200 means $1,200.00
}

export interface PreviewData {
  // ── Company info (passed in from user profile, not the form) ──
  companyName?: string;
  companyEmail?: string;

  // ── Customer (typed into the form) ──
  customerName?: string;
  customerEmail?: string;

  // ── Invoice meta (typed into the form) ──
  invoiceNumber?: string;
  dueDate?: string; // ISO date string "2025-01-31" or empty string
  currency?: string; // "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD"

  // ── Line items (built up in the form) ──
  lineItems?: PreviewLineItem[];
}

/**
 * Props interface shared by all four preview components:
 * ClassicPreview, ModernPreview, MinimalMonoPreview, StudioLuxePreview.
 *
 * Both props are optional so existing usages (template picker modal)
 * continue to work with zero changes — they render static placeholder data.
 */
export interface PreviewProps {
  /**
   * Live form data. When undefined the preview renders its built-in
   * placeholder values, identical to the original static thumbnail.
   */
  data?: PreviewData;

  /**
   * "thumbnail" (default) — compact 168px card used in the template
   *   picker modal. Renders at native size, no scaling.
   *
   * "full" — large A4-ratio preview used in the split-screen builder.
   *   The inner layout is CSS-scaled up via transform so the visual
   *   structure is identical to the thumbnail, just bigger.
   */
  size?: "thumbnail" | "full";
}