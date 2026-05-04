"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { InvoiceForPDF, UserCompany } from "@/types/invoice";
import TemplatePickerDialog from "./TemplatePickerDialog";

interface InvoicePDFButtonProps {
  invoice: InvoiceForPDF;
  user: UserCompany;
}

export default function TemplatePickerButton({
  invoice,
  user,
}: InvoicePDFButtonProps) {
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
        <TemplatePickerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </>
  );
}
