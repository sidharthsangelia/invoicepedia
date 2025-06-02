"use client";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import { ChevronDown, CreditCard, Ellipsis, Trash2 } from "lucide-react";
import { useOptimistic } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";

import { Customers, Invoices } from "@/db/schema";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => String(newStatus)
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const original = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      await updateStatusAction(formData);
    } catch {
      setCurrentStatus(original);
    }
  }

  return (
    <main className="min-h-[80vh] py-10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-semibold flex items-center gap-4">
            Invoice #{invoice.id}
            <Badge
              className={cn(
                "capitalize px-3 py-1 text-white text-sm rounded-full",
                currentStatus === "open" && "bg-blue-500",
                currentStatus === "paid" && "bg-green-600",
                currentStatus === "void" && "bg-zinc-700",
                currentStatus === "uncollectable" && "bg-red-600"
              )}
            >
              {currentStatus}
            </Badge>
          </h1>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Change Status
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {AVAILABLE_STATUSES.map((status) => (
                  <DropdownMenuItem key={status.id} asChild>
                    <form action={handleOnUpdateStatus}>
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={status.id} />
                      <button type="submit" className="w-full text-left">
                        {status.label}
                      </button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Ellipsis className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 w-full">
                        <Trash2 className="w-4 h-4" />
                        Delete Invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/invoices/${invoice.id}/payment`}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Delete Invoice?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the invoice and remove it from your records.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <form action={deleteInvoiceAction}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <Button variant="destructive" type="submit" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Confirm Delete
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <section className="mb-10">
          <p className="text-4xl font-bold mb-2 text-foreground">
            ${(invoice.value / 100).toFixed(2)}
          </p>
          <p className="text-muted-foreground text-lg">
            {invoice.description || "No description provided."}
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-xl mb-4">Billing Details</h2>
          <ul className="grid gap-3 text-sm text-foreground">
            <Detail label="Invoice ID" value={invoice.id} />
            <Detail
              label="Invoice Date"
              value={new Date(invoice.createTs).toLocaleDateString()}
            />
            <Detail label="Billing Name" value={invoice.customer.name} />
            <Detail label="Billing Email" value={invoice.customer.email} />
          </ul>
        </section>
      </Container>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <strong className="w-32 text-muted-foreground">{label}</strong>
      <span>{value}</span>
    </li>
  );
}
