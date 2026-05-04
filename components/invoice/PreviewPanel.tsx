"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateId, PreviewData, UserCompany } from "@/types/invoice";

// ── Lazy-load all four full-size previews ─────────────────────────────────
// Each is only downloaded when that template is actually selected.

const PREVIEW_COMPONENTS = {
  classic: dynamic(
    () => import("@/app/invoices/[invoiceId]/pdf-templates/template-preview/ClassicPreview"),
    { ssr: false, loading: () => <PreviewSkeleton /> }
  ),
  modern: dynamic(
    () => import("@/app/invoices/[invoiceId]/pdf-templates/template-preview/ModernPreview"),
    { ssr: false, loading: () => <PreviewSkeleton /> }
  ),
  mono: dynamic(
    () => import("@/app/invoices/[invoiceId]/pdf-templates/template-preview/MinimalMonoPreview"),
    { ssr: false, loading: () => <PreviewSkeleton /> }
  ),
  luxe: dynamic(
    () => import("@/app/invoices/[invoiceId]/pdf-templates/template-preview/StudioLuxePreview"),
    { ssr: false, loading: () => <PreviewSkeleton /> }
  ),
} as const;

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: "Classic",
  modern:  "Agency",
  mono:    "Freelancer",
  luxe:    "Consultant",
};

// ── Skeleton shown while a template chunk loads ───────────────────────────

function PreviewSkeleton() {
  return (
    <div
      className="w-full rounded-lg border border-border bg-muted/30"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div className="p-6 space-y-4 h-full flex flex-col">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-end mt-auto">
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface PreviewPanelProps {
  initialTemplate: TemplateId;
  previewData: PreviewData;
  userCompany: Pick<UserCompany, "companyName" | "companyEmail">;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function PreviewPanel({
  initialTemplate,
  previewData,
  userCompany,
}: PreviewPanelProps) {
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplate);
  const [, startTransition] = useTransition();

  const PreviewComponent = PREVIEW_COMPONENTS[templateId];

  // Merge company info (from server/user profile) with live form data
  const mergedData: PreviewData = {
    ...previewData,
    companyName:  userCompany.companyName  ?? undefined,
    companyEmail: userCompany.companyEmail ?? undefined,
  };

  function handleTemplateChange(value: string) {
    // useTransition keeps the current preview visible while the new
    // template chunk loads — no jarring blank flash
    startTransition(() => {
      setTemplateId(value as TemplateId);
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Preview</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Updates as you type
          </span>
        </div>

        {/* Template switcher */}
        <Select value={templateId} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {(Object.entries(TEMPLATE_LABELS) as [TemplateId, string][]).map(
              ([id, label]) => (
                <SelectItem key={id} value={id} className="text-xs">
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Preview area — scrollable so tall invoices don't overflow */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
        <PreviewComponent data={mergedData} size="full" />
      </div>
    </div>
  );
}