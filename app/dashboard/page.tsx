import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, FileText, TrendingUp, Clock, AlertTriangle } from "lucide-react";
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

/** Format currency without trailing zeros where possible */
function formatCurrency(amountInCents: number, currency: string): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Map each status to a deterministic Tailwind bg class. */
function statusBadgeClass(status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return "bg-zinc-800 text-zinc-300 border border-zinc-700";
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

  if (!userId) {
    redirect("/sign-in");
  }

  const hasSilverPlan = has({ plan: "silver" });
  if (!hasSilverPlan) {
    redirect("/pricing");
  }

  const whereClause = {
    deletedAt: null,
    ...(orgId
      ? { organizationId: orgId }
      : { userId, organizationId: null }),
  };

  // Fetch invoices + compute metrics in parallel
  const [invoices, allInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: whereClause,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        lineItems: { select: { quantity: true, unitAmount: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: whereClause,
      include: {
        lineItems: { select: { quantity: true, unitAmount: true } },
      },
    }),
  ]);

  // Metric calculations
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const paidThisMonth = allInvoices
    .filter(
      (inv) =>
        inv.status === InvoiceStatus.PAID &&
        new Date(inv.updatedAt) >= startOfMonth
    )
    .reduce((sum, inv) => sum + computeTotal(inv.lineItems), 0);

  const outstanding = allInvoices
    .filter((inv) =>
      [InvoiceStatus.SENT, InvoiceStatus.VIEWED].includes(inv.status)
    )
    .reduce((sum, inv) => sum + computeTotal(inv.lineItems), 0);

  const overdueCount = allInvoices.filter(
    (inv) => inv.status === InvoiceStatus.OVERDUE
  ).length;

  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <Button
            asChild
            className="inline-flex gap-2 "
          >
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Paid This Month */}
          <div className="rounded-lg border border-border bg-card p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid this month</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {formatCurrency(paidThisMonth, "USD")}
              </p>
            </div>
            <div className="rounded-md bg-green-900/30 p-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </div>

          {/* Outstanding */}
          <div className="rounded-lg border border-border bg-card p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {formatCurrency(outstanding, "USD")}
              </p>
            </div>
            <div className="rounded-md bg-blue-900/30 p-2">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {/* Overdue */}
          <div className="rounded-lg border border-border bg-card p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overdue</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {overdueCount} {overdueCount === 1 ? "invoice" : "invoices"}
              </p>
            </div>
            <div className="rounded-md bg-red-900/30 p-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 w-[130px]">Date</TableHead>
                <TableHead className="p-4">Invoice #</TableHead>
                <TableHead className="p-4">Customer</TableHead>
                <TableHead className="p-4 hidden sm:table-cell">Due Date</TableHead>
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
                  const formattedDueDate = invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

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
                          {formattedDueDate}
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
                          {formatCurrency(total, invoice.currency ?? "USD")}
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