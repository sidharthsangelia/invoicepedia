"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Check, FileText } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface InvoiceData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  invoiceNumber: string | null;
  currency: string;
  notes: string | null;
  status: string;
  customer: Customer;
  lineItems: LineItem[];
}

interface InvoicePDFDialogProps {
  invoice: InvoiceData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TemplateId = "classic" | "modern";

// ── Template Preview Components ────────────────────────────────────────────

function ClassicPreview() {
  return (
    <div
      className="relative w-full rounded overflow-hidden bg-[#FDF8F4] border border-[#E8DDD0] select-none"
      style={{ height: 168, fontSize: 0 }}
    >
      {/* Top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B3A2A]" />

      <div className="px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-2.5 pb-2 border-b border-[#DDD0C4]">
          <div>
            <div
              className="font-bold text-[#6B3A2A] tracking-widest"
              style={{ fontSize: 11 }}
            >
              INVOICE
            </div>
            <div className="text-[#9C6B52] mt-0.5" style={{ fontSize: 5.5 }}>
              INV-2025-001
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[#1A1209]" style={{ fontSize: 6.5 }}>
              Your Company
            </div>
            <div className="text-[#6B5C4C]" style={{ fontSize: 5 }}>
              hello@yourcompany.com
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between mb-2.5">
          <div>
            <div
              className="text-[#9C6B52] uppercase tracking-widest mb-1"
              style={{ fontSize: 4.5 }}
            >
              Bill To
            </div>
            <div className="font-bold text-[#1A1209]" style={{ fontSize: 6 }}>
              Client Name
            </div>
            <div className="text-[#6B5C4C]" style={{ fontSize: 5 }}>
              client@email.com
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-[#9C6B52] uppercase tracking-widest mb-1"
              style={{ fontSize: 4.5 }}
            >
              Due Date
            </div>
            <div className="text-[#1A1209]" style={{ fontSize: 5 }}>
              January 31, 2025
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden" style={{ borderRadius: 1 }}>
          <div
            className="bg-[#6B3A2A] text-white flex px-2 py-1"
            style={{ fontSize: 4.5 }}
          >
            <span className="flex-1">Description</span>
            <span className="w-5 text-center">Qty</span>
            <span className="w-10 text-right">Amount</span>
          </div>
          {[
            ["Web Design", "1", "$1,200.00"],
            ["Development", "3", "$3,600.00"],
          ].map(([desc, qty, amt], i) => (
            <div
              key={i}
              className={cn(
                "flex px-2 py-1 border-b border-[#DDD0C4]",
                i % 2 === 1 && "bg-[#F0E8E0]",
              )}
              style={{ fontSize: 4.5 }}
            >
              <span className="flex-1 text-[#1A1209]">{desc}</span>
              <span className="w-5 text-center text-[#6B5C4C]">{qty}</span>
              <span className="w-10 text-right font-bold text-[#1A1209]">
                {amt}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end mt-2">
          <div
            className="font-bold text-[#6B3A2A] border-t-2 border-[#6B3A2A] pt-1"
            style={{ fontSize: 6.5 }}
          >
            TOTAL DUE: $4,800.00
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-1 border-t border-[#DDD0C4]">
        <span className="text-[#9C6B52] italic" style={{ fontSize: 4.5 }}>
          Thank you for your business.
        </span>
        <span className="text-[#9C6B52]" style={{ fontSize: 4.5 }}>
          USD
        </span>
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div
      className="relative w-full rounded overflow-hidden border border-slate-200 select-none bg-white"
      style={{ height: 168, fontSize: 0 }}
    >
      {/* Hero band */}
      <div className="bg-[#0F172A] px-4 py-2.5 flex justify-between items-end">
        <div>
          <div
            className="text-amber-500 uppercase tracking-widest mb-1"
            style={{ fontSize: 4.5 }}
          >
            INVOICE
          </div>
          <div
            className="font-bold text-white"
            style={{ fontSize: 9, letterSpacing: -0.3 }}
          >
            Your Company
          </div>
        </div>
        <div className="text-right">
          <div
            className="font-bold text-amber-500"
            style={{ fontSize: 11, letterSpacing: -0.5 }}
          >
            #INV-001
          </div>
          <div className="text-slate-500" style={{ fontSize: 4.5 }}>
            Jan 1, 2025
          </div>
        </div>
      </div>
      {/* Amber bar */}
      <div className="h-[3px] bg-amber-500" />

      <div className="px-4 pt-2.5">
        {/* Info grid */}
        <div className="flex justify-between mb-2">
          <div>
            <div
              className="font-bold text-[#0F172A] uppercase tracking-widest mb-1 border-b border-amber-500"
              style={{ fontSize: 4.5, paddingBottom: 2 }}
            >
              BILL TO
            </div>
            <div className="font-bold text-[#0F172A]" style={{ fontSize: 6 }}>
              Client Name
            </div>
            <div className="text-slate-500" style={{ fontSize: 5 }}>
              client@email.com
            </div>
          </div>
          <div className="text-right">
            <div
              className="font-bold text-[#0F172A] uppercase tracking-widest mb-1 border-b border-amber-500"
              style={{ fontSize: 4.5, paddingBottom: 2 }}
            >
              DETAILS
            </div>
            <div className="font-bold text-[#0F172A]" style={{ fontSize: 5.5 }}>
              Issued Jan 1, 2025
            </div>
            <div
              className="mt-0.5 inline-block bg-amber-50 px-1 rounded-full text-amber-600 font-bold"
              style={{ fontSize: 4 }}
            >
              PAID
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div
            className="bg-[#1E293B] text-slate-100 flex px-2 py-1"
            style={{ fontSize: 4.5 }}
          >
            <span className="flex-1">Description</span>
            <span className="w-5 text-center">Qty</span>
            <span className="w-10 text-right">Amount</span>
          </div>
          {[
            ["Web Design", "1", "$1,200.00"],
            ["Development", "3", "$3,600.00"],
          ].map(([desc, qty, amt], i) => (
            <div
              key={i}
              className={cn(
                "flex px-2 py-1 border-b border-slate-100",
                i % 2 === 1 && "bg-slate-50",
              )}
              style={{ fontSize: 4.5 }}
            >
              <span className="flex-1 text-slate-700">{desc}</span>
              <span className="w-5 text-center text-slate-500">{qty}</span>
              <span className="w-10 text-right font-bold text-slate-700">
                {amt}
              </span>
            </div>
          ))}
        </div>

        {/* Total block */}
        <div className="flex justify-end mt-1.5">
          <div
            className="bg-[#0F172A] text-amber-500 font-bold flex justify-between gap-4 px-3 py-1.5 rounded"
            style={{ fontSize: 6, minWidth: 100 }}
          >
            <span
              className="text-slate-300 font-normal"
              style={{ fontSize: 5 }}
            >
              TOTAL DUE
            </span>
            <span>$4,800.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Template Config ────────────────────────────────────────────────────────

const TEMPLATES: {
  id: TemplateId;
  label: string;
  tagline: string;
  traits: string[];
  Preview: React.FC;
}[] = [
  {
    id: "classic",
    label: "Classic",
    tagline: "Traditional · Elegant · Formal",
    traits: ["Serif typography", "Warm cream tones", "Timeless layout"],
    Preview: ClassicPreview,
  },
  {
    id: "modern",
    label: "Modern",
    tagline: "Contemporary · Bold · Minimal",
    traits: ["Dark header band", "Amber accents", "Clean grid"],
    Preview: ModernPreview,
  },
];

// ── Main Component ─────────────────────────────────────────────────────────

export default function InvoicePDFDialog({
  invoice,
  open,
  onOpenChange,
}: InvoicePDFDialogProps) {
  const [selected, setSelected] = useState<TemplateId>("classic");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      // Dynamic imports — loaded only on demand, no SSR issues
      const [{ pdf }, templateMod] = await Promise.all([
        import("@react-pdf/renderer"),
        selected === "classic"
          ? import(".//pdf-templates/ClassicInvoice")
          : import(".//pdf-templates/ModernInvoice"),
      ]);

      const Template =
        selected === "classic"
          ? (
              templateMod as Awaited<
                typeof import("./pdf-templates/ClassicInvoice")
              >
            ).ClassicInvoice
          : (
              templateMod as Awaited<
                typeof import("./pdf-templates/ModernInvoice")
              >
            ).ModernInvoice;

      const invoiceLabel = invoice.invoiceNumber
        ? invoice.invoiceNumber
        : invoice.id.slice(-8).toUpperCase();

      const blob = await pdf(<Template invoice={invoice} />).toBlob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `invoice-${invoiceLabel}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);

      onOpenChange(false);
      toast.success("PDF generated!", {
        description: `invoice-${invoiceLabel}.pdf has been downloaded.`,
        icon: <FileText className="h-4 w-4" />,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Generation failed", {
        description: "Something went wrong. Please try again.",
      }, );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Generate Invoice PDF
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a design template for your invoice. The PDF will include all
            line items, customer details, and invoice metadata.
          </DialogDescription>
        </DialogHeader>

        {/* ── Template Cards ── */}
        <div className="grid grid-cols-2 gap-3 my-1">
          {TEMPLATES.map(({ id, label, tagline, traits, Preview }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={cn(
                  "group relative flex flex-col gap-2.5 rounded-xl border-2 p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/40",
                )}
              >
                {/* Check mark */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Check className="h-3 w-3" />
                  </span>
                )}

                {/* Preview thumbnail */}
                <Preview />

                {/* Label */}
                <div className="pt-0.5">
                  <p className="text-sm font-semibold leading-none mb-1">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{tagline}</p>
                  <ul className="mt-2 space-y-0.5">
                    {traits.map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span
                          className={cn(
                            "h-1 w-1 rounded-full shrink-0",
                            isSelected
                              ? "bg-primary"
                              : "bg-muted-foreground/50",
                          )}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={generating}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="gap-1.5 min-w-[130px]"
          >
            {generating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <FileText className="h-3.5 w-3.5" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
