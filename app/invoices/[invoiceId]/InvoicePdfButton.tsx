"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { InvoiceForPDF, UserCompany } from "@/types/invoice";

const InvoicePDFDialog = dynamic(() => import("./InvoicePdfDialog"), {
  ssr: false,
});

interface InvoicePDFButtonProps {
  invoice: InvoiceForPDF;
  user: UserCompany;
}

export default function InvoicePDFButton({ invoice, user }: InvoicePDFButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <FileText className="h-3.5 w-3.5" />
        Generate PDF
      </Button>

      {dialogOpen && (
        <InvoicePDFDialog
          invoice={invoice}
          user={user}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}