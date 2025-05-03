import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./Invoice";

// ✅ This signature exactly matches what Next.js expects
export default async function InvoicePage({
  params,
}: { params: { invoiceId: string } }) {
  const { userId, orgId } = await auth();
  if (!userId) return;

  const invoiceId = parseInt(params.invoiceId);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice Id");
  }

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organizationId, orgId))
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
