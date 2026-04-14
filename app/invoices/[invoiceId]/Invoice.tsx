"use client";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import {
  ChevronDown,
  CreditCard,
  Ellipsis,
  Trash2,
  ArrowLeft,
  CalendarClock,
  Hash,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { useOptimistic, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
 
import { InvoiceStatus } from "@/generated/prisma/enums";
import { updateStatusAction } from "@/actions/updateInvoiceStatus";
import { deleteInvoiceAction } from "@/actions/deleteInvoice";
 

// -----------------------------------------------------------------------
// Types — mirror Prisma includes in page.tsx
// -----------------------------------------------------------------------

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number; // cents
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface Activity {
  id: string;
  createdAt: Date;
  type: string;
  note: string | null;
}

interface InvoiceData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  invoiceNumber: string | null;
  currency: string;
  notes: string | null;
  status: InvoiceStatus;
  customer: Customer;
  lineItems: LineItem[];
  activities: Activity[];
}

interface InvoiceProps {
  invoice: InvoiceData;
}

// -----------------------------------------------------------------------
// Status config
// -----------------------------------------------------------------------

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-300/40",
  },
  SENT: {
    label: "Sent",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-300/40",
  },
  VIEWED: {
    label: "Viewed",
    className: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-300/40",
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300/40",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-300/40",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-500 border-zinc-300/40 line-through",
  },
};

const AVAILABLE_STATUSES = Object.entries(STATUS_CONFIG).map(
  ([value, { label }]) => ({ value: value as InvoiceStatus, label })
);

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ACTIVITY_LABELS: Record<string, string> = {
  CREATED: "Invoice created",
  SENT: "Sent to customer",
  VIEWED: "Viewed by customer",
  PAID: "Marked as paid",
  OVERDUE: "Marked overdue",
  CANCELLED: "Cancelled",
  NOTE_ADDED: "Note added",
  PAYMENT_FAILED: "Payment failed",
};

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

export default function Invoice({ invoice }: InvoiceProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (_state, next: InvoiceStatus) => next
  );

  async function handleStatusUpdate(formData: FormData) {
    const next = formData.get("status") as InvoiceStatus;
    const previous = currentStatus;
    setCurrentStatus(next);
    try {
      await updateStatusAction(formData);
    } catch {
      setCurrentStatus(previous);
    }
  }

  const total = invoice.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  const statusCfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.DRAFT;

  return (
    <main className="min-h-screen py-8">
      <Container>

        {/* ── Back ── */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All invoices
        </Link>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">
                {invoice.invoiceNumber
                  ? `Invoice ${invoice.invoiceNumber}`
                  : `Invoice #${invoice.id.slice(-8).toUpperCase()}`}
              </h1>
              <Badge
                variant="outline"
                className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full", statusCfg.className)}
              >
                {statusCfg.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(invoice.createdAt)}
              {invoice.dueDate && (
                <> · Due {formatDate(invoice.dueDate)}</>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Change status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  Change Status
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  Set status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AVAILABLE_STATUSES.map(({ value, label }) => (
                  <DropdownMenuItem key={value} asChild>
                    <form action={handleStatusUpdate}>
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={value} />
                      <button
                        type="submit"
                        className={cn(
                          "w-full text-left flex items-center gap-2",
                          currentStatus === value && "font-medium"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            value === "DRAFT" && "bg-zinc-400",
                            value === "SENT" && "bg-blue-500",
                            value === "VIEWED" && "bg-violet-500",
                            value === "PAID" && "bg-emerald-500",
                            value === "OVERDUE" && "bg-red-500",
                            value === "CANCELLED" && "bg-zinc-400",
                          )}
                        />
                        {label}
                      </button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More actions */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/invoices/${invoice.id}/payment`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete invoice?</DialogTitle>
                  <DialogDescription>
                    This will permanently remove the invoice from your records.
                    Payments and history are preserved but the invoice will no
                    longer appear in your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <form action={deleteInvoiceAction}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <Button variant="destructive" type="submit" className="gap-2">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Invoice
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Line items + Notes */}
          <div className="lg:col-span-2 space-y-6">

            {/* Line Items */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold">Line Items</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Description</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground text-right w-20">Qty</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground text-right w-32">Unit Price</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-muted-foreground text-right w-32">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground text-sm py-8"
                      >
                        No line items
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoice.lineItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="text-sm">{item.description}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">{item.quantity}</TableCell>
                        <TableCell className="text-sm text-right tabular-nums">
                          {formatMoney(item.unitAmount, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-sm text-right tabular-nums font-medium">
                          {formatMoney(item.quantity * item.unitAmount, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-sm font-semibold text-right">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-base">
                      {formatMoney(total, invoice.currency)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-2">Notes</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Activity Timeline */}
            {invoice.activities.length > 0 && (
              <div className="rounded-xl border border-border p-5">
                <h2 className="text-sm font-semibold mb-4">Activity</h2>
                <ol className="relative border-l border-border space-y-4 ml-2">
                  {invoice.activities
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((activity) => (
                      <li key={activity.id} className="ml-4">
                        <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-muted-foreground/40" />
                        <p className="text-sm font-medium leading-snug">
                          {ACTIVITY_LABELS[activity.type] ?? activity.type}
                        </p>
                        {activity.note && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activity.note}
                          </p>
                        )}
                        <time className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </time>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </div>

          {/* Right: Customer + Invoice meta */}
          <div className="space-y-4">

            {/* Customer */}
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h2 className="text-sm font-semibold">Customer</h2>
              <div className="space-y-2.5">
                <DetailRow icon={<User className="h-3.5 w-3.5" />} value={invoice.customer.name} />
                <DetailRow icon={<Mail className="h-3.5 w-3.5" />} value={invoice.customer.email} href={`mailto:${invoice.customer.email}`} />
                {invoice.customer.phone && (
                  <DetailRow icon={<Phone className="h-3.5 w-3.5" />} value={invoice.customer.phone} />
                )}
                {invoice.customer.address && (
                  <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} value={invoice.customer.address} />
                )}
              </div>
            </div>

            {/* Invoice meta */}
            <div className="rounded-xl border border-border p-5 space-y-4">
              <h2 className="text-sm font-semibold">Details</h2>
              <dl className="space-y-3 text-sm">
                <MetaRow
                  label="Invoice ID"
                  value={invoice.id.slice(-12).toUpperCase()}
                />
                {invoice.invoiceNumber && (
                  <MetaRow label="Number" value={invoice.invoiceNumber} />
                )}
                <MetaRow label="Currency" value={invoice.currency} />
                <MetaRow
                  label="Issued"
                  value={formatDate(invoice.createdAt)}
                />
                {invoice.dueDate && (
                  <MetaRow
                    label="Due Date"
                    value={formatDate(invoice.dueDate)}
                    valueClassName={
                      new Date(invoice.dueDate) < new Date() &&
                      currentStatus !== "PAID" &&
                      currentStatus !== "CANCELLED"
                        ? "text-red-500 font-medium"
                        : undefined
                    }
                  />
                )}
                <Separator />
                <MetaRow
                  label="Status"
                  value={statusCfg.label}
                />
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

// -----------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------

function DetailRow({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
}) {
  const inner = (
    <span className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <span className="break-all">{value}</span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className="hover:text-primary transition-colors block">
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
}

function MetaRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className={cn("text-right font-medium truncate", valueClassName)}>
        {value}
      </dd>
    </div>
  );
}