import { prisma } from "@/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { InvoiceStatus } from "@/generated/prisma/enums";
import { InvoiceForm } from "@/components/InvoiceForm";
import Container from "@/components/Container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type EditInvoicePageProps = {
  params: Promise<{ invoiceId: string }>;
};

export async function generateMetadata({ params }: EditInvoicePageProps) {
  const { invoiceId } = await params;
  return { title: `Edit Invoice · ${invoiceId.slice(-8).toUpperCase()}` };
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const { invoiceId } = await params;
  if (!invoiceId) throw new Error("Invalid Invoice ID");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      status: InvoiceStatus.DRAFT, // hard gate — non-draft invoices return 404
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
      lineItems: {
        select: {
          description: true,
          quantity: true,
          unitAmount: true, // cents
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Non-draft or not found → 404 (prevents editing via direct URL)
  if (!invoice) notFound();

  // Convert line items from cents → dollars for the form
  const defaultValues = {
    customerName: invoice.customer.name,
    customerEmail: invoice.customer.email,
    customerPhone: invoice.customer.phone ?? "",
    customerAddress: invoice.customer.address ?? "",
    invoiceNumber: invoice.invoiceNumber ?? "",
    currency: invoice.currency,
    dueDate: invoice.dueDate
      ? new Date(invoice.dueDate).toISOString().split("T")[0]
      : "",
    notes: invoice.notes ?? "",
    lineItems: invoice.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitAmount: item.unitAmount / 100, // cents → dollars
    })),
  };

  return (
    <main className="min-h-full pb-16">
      <Container>
        <div className="flex items-center gap-4 py-6 border-b border-border">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0">
            <Link href={`/invoices/${invoiceId}`} aria-label="Back to invoice">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Invoice</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Update the draft invoice details below.
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-3xl">
          <InvoiceForm
            mode="edit"
            invoiceId={invoiceId}
            defaultValues={defaultValues}
          />
        </div>
      </Container>
    </main>
  );
}