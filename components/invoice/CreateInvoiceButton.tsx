"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

// Lazy-load the dialog — it imports 4 preview components and useRouter.
// Not needed until the user actually clicks the button.
const TemplatePickerDialog = dynamic(
  () => import("@/components/invoice/TemplatePickerDialog"),
  { ssr: false }
);

export default function CreateInvoiceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="inline-flex gap-2" onClick={() => setOpen(true)}>
        <CirclePlus className="h-4 w-4" />
        Create Invoice
      </Button>

      {/* Mount only after first click — avoids loading preview components on page load */}
      {open && (
        <TemplatePickerDialog open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}