import { Check, CreditCard } from "lucide-react";
import Stripe from "stripe";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createPayment, updateStatusAction } from "@/app/actions";
import { prisma } from "@/db/prisma";
import { notFound } from "next/navigation";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ status?: string; session_id?: string }>;
}

export default async function InvoicePage({ params, searchParams }: InvoicePageProps) {
  const { invoiceId } = await params;
  const { session_id, status } = await searchParams;

  const id = parseInt(invoiceId);
  if (isNaN(id)) throw new Error("Invalid invoice ID");

  const isSuccess = status === "success" && session_id;
  const isCanceled = status === "canceled";
  let isError = status === "success" && !session_id;

  if (isSuccess) {
    const session = await stripe.checkout.sessions.retrieve(session_id!);
    if (session.payment_status === "paid") {
      const formData = new FormData();
      formData.append("id", invoiceId);
      formData.append("status", "PAID");
      await updateStatusAction(formData);
    } else {
      isError = true;
    }
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      createTs: true,
      description: true,
      value: true,
      customer: {
        select: { name: true },
      },
    },
  });

  if (!invoice) notFound();

  return (
    <main className="min-h-[80vh] py-10">
      <Container>
        {isError && (
          <AlertMessage type="error" message="Something went wrong, please try again." />
        )}
        {isCanceled && (
          <AlertMessage type="warning" message="Payment was canceled, please try again." />
        )}

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <h1 className="text-3xl font-semibold flex items-center gap-4 mb-4">
              Invoice #{invoice.id}
              <Badge
                className={cn(
                  "capitalize px-3 py-1 text-white text-sm rounded-full",
                  invoice.status === "PENDING" && "bg-blue-500",
                  invoice.status === "PAID" && "bg-green-600",
                  invoice.status === "OVERDUE" && "bg-red-600"
                )}
              >
                {invoice.status}
              </Badge>
            </h1>

            <p className="text-4xl font-bold mb-2">${(invoice.value / 100).toFixed(2)}</p>
            <p className="text-muted-foreground text-lg">{invoice.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Invoice</h2>
            {invoice.status === "PENDING" ? (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay Invoice
                </Button>
              </form>
            ) : invoice.status === "PAID" ? (
              <div className="flex items-center gap-3 text-green-700 font-semibold text-lg">
                <Check className="w-6 h-6 bg-green-200 rounded-full p-1" />
                Invoice Paid
              </div>
            ) : null}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <ul className="grid gap-3 text-sm text-foreground">
            <Detail label="Invoice ID" value={invoice.id} />
            <Detail
              label="Invoice Date"
              value={new Date(invoice.createTs).toLocaleDateString()}
            />
            <Detail label="Billing Name" value={invoice.customer.name} />
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

function AlertMessage({ type, message }: { type: "error" | "warning"; message: string }) {
  const bg = {
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <p className={cn("text-sm text-center px-3 py-2 rounded-lg mb-6", bg[type])}>
      {message}
    </p>
  );
}