"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/InvoiceForm";
import { TemplateId, PreviewData, UserCompany } from "@/types/invoice";

// Lazy-load PreviewPanel — it pulls in all 4 preview components
// and should not block the initial form render
const PreviewPanel = dynamic(() => import("./PreviewPanel"), {
  ssr: false,
  loading: () => (
    <div className="hidden lg:flex lg:flex-col h-full border-l border-border bg-muted/10 items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading preview…</p>
    </div>
  ),
});

// ── Props ─────────────────────────────────────────────────────────────────

interface InvoiceBuilderProps {
  initialTemplate: TemplateId;
  userCompany: Pick<UserCompany, "companyName" | "companyEmail">;
}

// ── Default preview data — matches InvoiceForm's defaultValues ────────────

const DEFAULT_PREVIEW: PreviewData = {
  customerName:  "",
  customerEmail: "",
  invoiceNumber: "",
  dueDate:       "",
  currency:      "USD",
  lineItems:     [{ description: "", quantity: 1, unitAmount: 0 }],
};

// ── Component ─────────────────────────────────────────────────────────────

export default function InvoiceBuilder({
  initialTemplate,
  userCompany,
}: InvoiceBuilderProps) {
  const [previewData, setPreviewData] = useState<PreviewData>(DEFAULT_PREVIEW);

  // Stable callback reference — prevents InvoiceForm from re-rendering
  // every time previewData state updates in the builder
  const handlePreviewChange = useCallback((data: PreviewData) => {
    setPreviewData(data);
  }, []);

  return (
    // Full viewport height minus the top nav (adjust the offset to match your navbar height)
    <div className="flex flex-col h-[calc(100vh-64px)]">

      {/* ── Page header (full width) ── */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background shrink-0">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 shrink-0"
        >
          <Link href="/dashboard" aria-label="Back to invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Create Invoice
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            New invoices start as{" "}
            <strong className="font-medium text-foreground">Draft</strong>
          </p>
        </div>
      </div>

      {/* ── Split layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Form (40%) — scrollable independently */}
        <div className="w-full lg:w-[40%] h-full overflow-y-auto border-r border-border bg-background">
          <div className="p-6">
            <InvoiceForm onPreviewChange={handlePreviewChange} />
          </div>
        </div>

        {/* RIGHT — Preview (60%) — hidden on mobile, visible lg+ */}
        <div className="hidden lg:flex lg:flex-col lg:w-[60%] h-full">
          <PreviewPanel
            initialTemplate={initialTemplate}
            previewData={previewData}
            userCompany={userCompany}
          />
        </div>
      </div>
    </div>
  );
}