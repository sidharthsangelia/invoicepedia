"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

import { TemplateId } from "@/types/invoice";

import ClassicPreview from "@/app/invoices/[invoiceId]/pdf-templates/template-preview/ClassicPreview";
import ModernPreview from "@/app/invoices/[invoiceId]/pdf-templates/template-preview/ModernPreview";
import MinimalMonoPreview from "@/app/invoices/[invoiceId]/pdf-templates/template-preview/MinimalMonoPreview";
import StudioLuxePreview from "@/app/invoices/[invoiceId]/pdf-templates/template-preview/StudioLuxePreview";

// ── Types ──────────────────────────────────────────────────────────────────

interface TemplatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Template Config ────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic" as TemplateId,
    label: "Classic",
    tagline: "Traditional · Elegant · Formal",
    traits: ["Serif typography", "Warm cream tones", "Timeless layout"],
    Preview: ClassicPreview,
  },
  {
    id: "modern" as TemplateId,
    label: "Agency",
    tagline: "Creative · Airy · Studio",
    traits: ["Sage accent stripe", "Summary pill layout", "Clean grid"],
    Preview: ModernPreview,
  },
  {
    id: "mono" as TemplateId,
    label: "Freelancer",
    tagline: "Technical · Utilitarian · Sharp",
    traits: ["Navy header band", "Monospaced font", "Dense meta strip"],
    Preview: MinimalMonoPreview,
  },
  {
    id: "luxe" as TemplateId,
    label: "Consultant",
    tagline: "Refined · Authoritative · Warm",
    traits: ["Amber accent rule", "FROM / TO layout", "Stone palette"],
    Preview: StudioLuxePreview,
  },
] as const;

// ── Main Component ─────────────────────────────────────────────────────────

export default function TemplatePickerDialog({
  open,
  onOpenChange,
}: TemplatePickerDialogProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<TemplateId>("classic");

  function handleNext() {
    onOpenChange(false);
    router.push(`/invoices/new?template=${selected}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Pick a design for your invoice. You can change it later in the
            builder.
          </DialogDescription>
        </DialogHeader>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-1">
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(({ id, label, tagline, traits, Preview }) => {
              const isSelected = selected === id;

              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={cn(
                    "group relative flex flex-col gap-2.5 rounded-xl border-2 p-3 text-left transition",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                  )}

                  {/* Static thumbnail — no data prop, renders placeholders */}
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
          >
            Cancel
          </Button>

          <Button size="sm" onClick={handleNext} className="gap-1.5">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}