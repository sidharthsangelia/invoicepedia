"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

// Dynamically import the dialog (and transitively @react-pdf/renderer)
// with ssr: false so the PDF engine never runs on the server.
const InvoicePDFDialog = dynamic(() => import("./InvoicePdfDialog"), {
  ssr: false,
});

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

interface InvoicePDFButtonProps {
  invoice: InvoiceData;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function InvoicePDFButton({ invoice }: InvoicePDFButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        
        Generate PDF
      </Button>

      {/* Only mount the dialog (and load the PDF bundle) once opened */}
      {dialogOpen && (
        <InvoicePDFDialog
          invoice={invoice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}