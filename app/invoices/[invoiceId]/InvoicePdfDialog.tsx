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

import { InvoiceForPDF, UserCompany } from "@/types/invoice";

// ── Types ──────────────────────────────────────────────────────────────────

interface InvoicePDFDialogProps {
  invoice: InvoiceForPDF;
  user: UserCompany;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TemplateId = "classic" | "modern" | "mono" | "luxe";

// ── Template Config ────────────────────────────────────────────────────────

const TEMPLATES = [
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
    traits: ["Amber accent rule", "FROM / TO layout", "Stone palette"],
    Preview: StudioLuxePreview,
  },
] as const;

const TEMPLATE_MAP = {
  classic: () => import("./pdf-templates/ClassicInvoice"),
  modern: () => import("./pdf-templates/ModernInvoice"),
  mono: () => import("./pdf-templates/MinimalMonoInvoice"),
  luxe: () => import("./pdf-templates/StudioLuxeInvoice"),
};

// ── Helper: safely extract component ────────────────────────────────────────

function getTemplateComponent(mod: any) {
  return (
    mod.ClassicInvoice ||
    mod.ModernInvoice ||
    mod.MinimalMonoInvoice ||
    mod.StudioLuxeInvoice ||
    mod.default
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function InvoicePDFDialog({
  invoice,
  open,
  onOpenChange,
  user,
}: InvoicePDFDialogProps) {
  const [selected, setSelected] = useState<TemplateId>("classic");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);

    try {
      // ✅ import pdf ONLY ONCE
      const { pdf } = await import("@react-pdf/renderer");

      // ✅ load template
      const templateMod = await TEMPLATE_MAP[selected]();

      const Template = getTemplateComponent(templateMod);

      if (!Template) {
        throw new Error("Template component not found");
      }

      const invoiceLabel = invoice.invoiceNumber
        ? invoice.invoiceNumber
        : invoice.id.slice(-8).toUpperCase();

      // ✅ IMPORTANT: pass props correctly
      const element = <Template invoice={invoice} user={user} />;

      const blob = await pdf(element).toBlob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceLabel}.pdf`;
      a.click();

      URL.revokeObjectURL(url);

      onOpenChange(false);

      toast.success("PDF generated!", {
        description: `invoice-${invoiceLabel}.pdf downloaded`,
        icon: <FileText className="h-4 w-4" />,
        richColors: true,
        position: "top-right",
      });
    } catch (err) {
      console.error("PDF generation failed:", err);

      toast.error("Generation failed", {
        description: "Something went wrong. Please try again.",
        icon: <AlertTriangle className="h-4 w-4" />,
        richColors: true,
        position: "top-right",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Generate Invoice PDF</DialogTitle>
          <DialogDescription>
            Choose a design template for your invoice.
          </DialogDescription>
        </DialogHeader>

        {/* Templates */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-1">
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(({ id, label, tagline, traits, Preview }) => {
              const isSelected = selected === id;

              return (
                <button
                  key={id}
                  onClick={() => setSelected(id as TemplateId)}
                  className={cn(
                    "group relative flex flex-col gap-2.5 rounded-xl border-2 p-3 text-left transition",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2">
                      <Check className="h-4 w-4" />
                    </span>
                  )}

                  <Preview />

                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{tagline}</p>
                    <ul className="mt-2 text-xs text-muted-foreground">
                      {traits.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t">
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
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}