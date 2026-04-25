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
import { Loader2, Check, FileText, AlertTriangle } from "lucide-react";

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

type TemplateId = "classic" | "modern" | "mono" | "luxe";

// ── Template Preview Components ────────────────────────────────────────────

function ClassicPreview() {
  return (
    <div
      className="relative w-full rounded border border-gray-200 bg-white select-none"
      style={{ height: 168, fontSize: 0 }}
    >
      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div>
            <div
              className="font-bold tracking-widest text-black"
              style={{ fontSize: 11 }}
            >
              INVOICE
            </div>
            <div className="text-gray-500 mt-0.5" style={{ fontSize: 5.5 }}>
              INV-2025-001
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-black" style={{ fontSize: 6.5 }}>
              Your Company
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              your@company.com
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between mb-3">
          <div>
            <div
              className="uppercase tracking-wider text-gray-500 mb-1"
              style={{ fontSize: 4.5 }}
            >
              Bill To
            </div>
            <div className="font-medium text-black" style={{ fontSize: 6 }}>
              Client Name
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              client@email.com
            </div>
          </div>

          <div className="text-right">
            <div
              className="uppercase tracking-wider text-gray-500 mb-1"
              style={{ fontSize: 4.5 }}
            >
              Details
            </div>
            <div className="text-black" style={{ fontSize: 5 }}>
              Issued Jan 1, 2025
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              Due Jan 31, 2025
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-black mb-2" />

        {/* Table */}
        <div>
          {/* Header */}
          <div className="flex pb-1 mb-1 border-b border-black">
            <span className="flex-1 font-semibold" style={{ fontSize: 4.5 }}>
              Description
            </span>
            <span
              className="w-5 text-center font-semibold"
              style={{ fontSize: 4.5 }}
            >
              Qty
            </span>
            <span
              className="w-10 text-right font-semibold"
              style={{ fontSize: 4.5 }}
            >
              Amount
            </span>
          </div>

          {/* Rows */}
          {[
            ["Web Design", "1", "$1,200.00"],
            ["Development", "3", "$3,600.00"],
          ].map(([desc, qty, amt], i) => (
            <div key={i} className="flex py-0.5">
              <span className="flex-1 text-black" style={{ fontSize: 4.5 }}>
                {desc}
              </span>
              <span
                className="w-5 text-center text-gray-500"
                style={{ fontSize: 4.5 }}
              >
                {qty}
              </span>
              <span
                className="w-10 text-right text-black"
                style={{ fontSize: 4.5 }}
              >
                {amt}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end mt-2">
          <div
            className="border-t border-black pt-1 font-semibold text-black"
            style={{ fontSize: 6 }}
          >
            TOTAL $4,800.00
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-1 border-t border-gray-200">
        <span className="text-gray-500" style={{ fontSize: 4.5 }}>
          Thank you for your business.
        </span>
        <span className="text-gray-500" style={{ fontSize: 4.5 }}>
          INV-2025-001
        </span>
      </div>
    </div>
  );
}
// ── Modern → "Agency" Preview ─────────────────────────────────────────────
// Muted sage accent bar on the left, airy white summary pill, clean sans.
// Target: boutique creative agencies & design studios.
function ModernPreview() {
  return (
    <div className="relative w-full h-[168px] rounded border border-gray-200 bg-[#F8F7F4] overflow-hidden select-none flex">
      {/* Left accent stripe */}
      <div className="w-[3px] shrink-0 bg-[#4A7C6F]" />

      <div className="flex-1 p-3 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-[7px] font-bold text-[#1C1C1A] leading-none">
              Your Company
            </div>
            <div className="text-[4.5px] text-[#7A7A74] mt-0.5">
              your@company.com
            </div>
          </div>
          <div className="text-right">
            <div className="text-[4px] tracking-widest text-[#4A7C6F] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[6px] font-bold text-[#1C1C1A]">
              INV-2025-001
            </div>
          </div>
        </div>

        {/* Summary pill */}
        <div className="bg-white rounded p-1.5 flex gap-1.5 mb-2 border border-gray-100">
          <div className="flex-1">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Billed To
            </div>
            <div className="text-[5px] font-semibold text-[#1C1C1A]">
              Acme Corp
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Due
            </div>
            <div className="text-[5px] font-semibold text-[#1C1C1A]">
              Jan 31, 2025
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-right">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Amount Due
            </div>
            <div className="text-[7px] font-bold text-[#4A7C6F]">$4,800</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#EAF0EE] rounded px-1.5 py-1 mb-1 flex">
          <span className="flex-1 text-[4px] tracking-widest text-[#3A6259] uppercase">
            Description
          </span>
          <span className="text-[4px] tracking-widest text-[#3A6259] uppercase">
            Total
          </span>
        </div>
        {[
          ["Web Design", "$1,200"],
          ["Development", "$3,600"],
        ].map(([desc, amt]) => (
          <div
            key={desc}
            className="flex justify-between px-1.5 py-0.5 border-b border-gray-200"
          >
            <span className="text-[4.5px] text-[#1C1C1A]">{desc}</span>
            <span className="text-[4.5px] font-bold text-[#1C1C1A]">{amt}</span>
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-end mt-1.5">
          <div className="border-t-2 border-[#4A7C6F] pt-0.5">
            <span className="text-[5px] font-bold text-[#4A7C6F]">
              TOTAL $4,800.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Minimal Mono → "Freelancer" Preview ───────────────────────────────────
// Mirrors: full-bleed navy header · pale tint meta strip · navy total chip
function MinimalMonoPreview() {
  return (
    <div className="w-full h-[168px] rounded border border-gray-200 bg-[#FDFCFA] overflow-hidden select-none font-mono flex flex-col">
      {/* Full-bleed navy header */}
      <div className="bg-[#1E3A5F] px-3 pt-2.5 pb-2 flex justify-between items-end shrink-0">
        <div>
          <div className="text-[7px] font-bold text-white tracking-wide leading-tight">
            YOUR NAME
          </div>
          <div className="text-[4px] text-[#93B4D4] mt-0.5">your@email.com</div>
        </div>
        <div className="text-right">
          <div className="text-[3.5px] tracking-[0.25em] text-[#93B4D4] uppercase mb-0.5">
            Invoice
          </div>
          <div className="text-[8px] font-bold text-white">INV-2025-001</div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="bg-[#EEF3F9] px-3 py-1.5 flex gap-1 border-b border-gray-200 shrink-0">
        <div className="flex-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Billed To
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Client Name
          </div>
          <div className="text-[3.5px] text-[#71717A]">client@email.com</div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Issue Date
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Jan 1, 2025
          </div>
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mt-1 mb-0.5">
            Due Date
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Jan 31, 2025
          </div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1 text-right">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Currency
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">USD</div>
        </div>
      </div>

      {/* Table body */}
      <div className="flex-1 px-3 pt-1.5 flex flex-col">
        <div className="flex border-b-2 border-[#18181B] pb-0.5 mb-0.5">
          <span className="flex-1 text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Description
          </span>
          <span className="text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Amount
          </span>
        </div>
        {[
          ["Web Design", "$1,200.00"],
          ["Development", "$3,600.00"],
        ].map(([d, a]) => (
          <div
            key={d}
            className="flex justify-between border-b border-[#D4D4D8] py-0.5"
          >
            <span className="text-[4px] text-[#18181B]">{d}</span>
            <span className="text-[4px] font-bold text-[#18181B]">{a}</span>
          </div>
        ))}

        {/* Total chip */}
        <div className="flex justify-end mt-auto pb-1.5">
          <div className="bg-[#1E3A5F] flex gap-3 items-center px-2 py-1">
            <span className="text-[3.5px] font-bold tracking-widest text-[#93B4D4] uppercase">
              Total Due
            </span>
            <span className="text-[6px] font-bold text-white">$4,800.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Studio Luxe → "Consultant" Preview ───────────────────────────────────
// Mirrors: amber top rule · from/to split · stone chips · left-border total block
function StudioLuxePreview() {
  return (
    <div className="w-full h-[168px] rounded border border-[#DDD8CF] bg-[#FAFAF8] overflow-hidden select-none flex flex-col">
      {/* Amber top rule */}
      <div className="h-[2.5px] bg-[#8B6340] shrink-0" />

      <div className="flex-1 px-3 pt-2 pb-1.5 flex flex-col gap-1.5 min-h-0">
        {/* Letterhead */}
        <div className="flex justify-between items-end pb-1.5 border-b border-[#DDD8CF]">
          <div>
            <div className="text-[7.5px] font-bold text-[#1C1A17] leading-tight">
              Your Studio
            </div>
            <div className="text-[4px] text-[#7C7468] tracking-wide">
              Independent Consulting
            </div>
          </div>
          <div className="text-right">
            <div className="text-[3px] tracking-[0.3em] text-[#8B6340] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[5.5px] font-bold text-[#1C1A17]">
              INV-2025-001
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              From
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">
              Your Studio
            </div>
            <div className="text-[3.5px] text-[#7C7468]">your@studio.com</div>
          </div>
          <div className="w-px bg-[#DDD8CF]" />
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              Billed To
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">
              Acme Studio
            </div>
            <div className="text-[3.5px] text-[#7C7468]">acme@client.com</div>
          </div>
        </div>

        {/* Date chips */}
        <div className="flex gap-1">
          {[
            ["Issue Date", "Jan 1, 2025"],
            ["Due Date", "Jan 31, 2025"],
            ["Currency", "USD"],
          ].map(([l, v]) => (
            <div
              key={l}
              className="flex-1 bg-[#F3EFE9] rounded-[2px] px-1.5 py-1 border-l-[1.5px] border-[#C8C3BA]"
            >
              <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
                {l}
              </div>
              <div className="text-[4px] font-bold text-[#1C1A17]">{v}</div>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-0">
          <div className="flex pb-0.5 border-b border-[#1C1A17]">
            <span className="flex-1 text-[3px] tracking-widest text-[#7C7468] uppercase">
              Description
            </span>
            <span className="text-[3px] tracking-widest text-[#7C7468] uppercase">
              Amount
            </span>
          </div>
          {[
            ["Brand Strategy", "$2,000"],
            ["Web Design", "$3,000"],
          ].map(([d, a]) => (
            <div
              key={d}
              className="flex justify-between border-b border-[#DDD8CF] py-0.5"
            >
              <span className="text-[4px] text-[#1C1A17]">{d}</span>
              <span className="text-[4px] font-bold text-[#1C1A17]">{a}</span>
            </div>
          ))}
        </div>

        {/* Total block */}
        <div className="flex justify-end mt-auto">
          <div className="bg-[#F7F1EA] border-l-[2px] border-[#8B6340] flex justify-between items-center gap-4 pl-2 pr-3 py-1">
            <span className="text-[3px] tracking-[0.2em] text-[#8B6340] uppercase">
              Total Due
            </span>
            <span className="text-[7px] font-bold text-[#1C1A17]">
              $5,000.00
            </span>
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
    label: "Agency",
    tagline: "Creative · Airy · Studio",
    traits: ["Sage accent stripe", "Summary pill layout", "Clean grid"],
    Preview: ModernPreview,
  },
  {
    id: "mono",
    label: "Freelancer",
    tagline: "Technical · Utilitarian · Sharp",
    traits: ["Navy header band", "Monospaced font", "Dense meta strip"],
    Preview: MinimalMonoPreview,
  },
  {
    id: "luxe",
    label: "Consultant",
    tagline: "Refined · Authoritative · Warm",
    traits: ["Amber accent rule", "FROM / TO layout", "Stone colour palette"],
    Preview: StudioLuxePreview,
  },
];

const TEMPLATE_MAP = {
  classic: () => import("./pdf-templates/ClassicInvoice"),
  modern: () => import("./pdf-templates/ModernInvoice"),
  mono: () => import("./pdf-templates/MinimalMonoInvoice"),
  luxe: () => import("./pdf-templates/StudioLuxeInvoice"),
};

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
        TEMPLATE_MAP[selected](),
      ]);

      const Template = Object.values(templateMod)[0];

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
        richColors: true,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Generation failed", {
        description: "Something went wrong. Please try again.",
        richColors: true,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Generate Invoice PDF
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a design template for your invoice. The PDF will include all
            line items, customer details, and invoice metadata.
          </DialogDescription>
        </DialogHeader>

        {/* ── Template Cards ── scrollable middle */}
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-6 px-6 py-1">
          <div className="grid grid-cols-2 gap-3">
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
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <Preview />
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
        </div>

        {/* ── Actions ── sticky footer */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
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
