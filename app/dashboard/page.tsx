import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, FileText } from "lucide-react";
import { prisma } from "@/db/prisma";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InvoiceStatus } from "@/generated/prisma/enums";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute invoice total from its line items (stored in cents → displayed in dollars) */
function computeTotal(lineItems: { quantity: number; unitAmount: number }[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);
}

/** Map each status to a deterministic Tailwind bg class. DRAFT uses muted styling. */
function statusBadgeClass(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return "bg-muted text-muted-foreground border border-border";
    case InvoiceStatus.SENT:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case InvoiceStatus.VIEWED:
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    case InvoiceStatus.PAID:
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    case InvoiceStatus.OVERDUE:
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case InvoiceStatus.CANCELLED:
      return "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function DashboardPage() {
  const { userId, orgId, has } = await auth();

  // Unauthenticated — redirect rather than silently returning null
  if (!userId) {
    redirect("/sign-in");
  }

  // Plan gate — redirect to pricing instead of rendering a dead end
  const hasSilverPlan = has({ plan: "silver" });
  if (!hasSilverPlan) {
    redirect("/pricing");
  }

  // Fetch invoices with line items so we can compute totals
  const invoices = await prisma.invoice.findMany({
    where: {
      deletedAt: null,
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      lineItems: {
        select: { quantity: true, unitAmount: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <Button asChild className="inline-flex gap-2">
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>

        {/* Table card */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableCaption className="text-muted-foreground pb-4">
              A list of your recent invoices
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 w-[130px]">Date</TableHead>
                <TableHead className="p-4">Invoice #</TableHead>
                <TableHead className="p-4">Customer</TableHead>
                <TableHead className="p-4 hidden sm:table-cell">Email</TableHead>
                <TableHead className="p-4 text-center">Status</TableHead>
                <TableHead className="p-4 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <FileText className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No invoices yet.</p>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/invoices/new">Create your first invoice</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const total = computeTotal(invoice.lineItems);
                  const formattedDate = new Date(invoice.createdAt).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "short", day: "numeric" }
                  );

                  return (
                    <TableRow
                      key={invoice.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="p-4 text-foreground font-medium whitespace-nowrap">
                        <Link href={`/invoices/${invoice.id}`}>{formattedDate}</Link>
                      </TableCell>

                      <TableCell className="p-4 text-muted-foreground font-mono text-sm">
                        <Link href={`/invoices/${invoice.id}`}>
                          {invoice.invoiceNumber ?? "—"}
                        </Link>
                      </TableCell>

                      <TableCell className="p-4 font-medium text-foreground">
                        <Link href={`/invoices/${invoice.id}`}>
                          {invoice.customer.name}
                        </Link>
                      </TableCell>

                      <TableCell className="p-4 text-muted-foreground hidden sm:table-cell">
                        <Link href={`/invoices/${invoice.id}`}>
                          {invoice.customer.email}
                        </Link>
                      </TableCell>

                      <TableCell className="p-4 text-center">
                        <Badge
                          className={cn(
                            "capitalize px-3 py-1 rounded-full text-xs font-medium",
                            statusBadgeClass(invoice.status)
                          )}
                        >
                          {invoice.status.toLowerCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="p-4 text-right font-medium tabular-nums">
                        <Link href={`/invoices/${invoice.id}`}>
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: invoice.currency ?? "USD",
                          }).format(total / 100)}
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </main>
  );
}