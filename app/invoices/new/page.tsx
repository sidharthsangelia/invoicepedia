import { InvoiceForm } from "@/components/InvoiceForm";
import Container from "@/components/Container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create Invoice",
};

export default function NewInvoicePage() {
  return (
    <main className="min-h-full pb-16">
      <Container>
        {/* Page header */}
        <div className="flex items-center gap-4 py-6 border-b border-border">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0">
            <Link href="/invoices" aria-label="Back to invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create Invoice</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Fill in the details below. New invoices start as <strong>Draft</strong>.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 max-w-3xl">
          <InvoiceForm />
        </div>
      </Container>
    </main>
  );
}