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
import StudioLuxePreview from "./pdf-templates/template-preview/StudioLuxePreview";
import MinimalMonoPreview from "./pdf-templates/template-preview/MinimalMonoPreview";
import ModernPreview from "./pdf-templates/template-preview/ModernPreview";
import ClassicPreview from "./pdf-templates/template-preview/ClassicPreview";

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
