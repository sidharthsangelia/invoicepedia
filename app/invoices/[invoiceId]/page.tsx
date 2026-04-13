import { prisma } from "@/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Invoice from "./Invoice";

type InvoicePageProps = {
  params: Promise<{ invoiceId: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { userId, orgId } = await auth();
  if (!userId) return;

  const resolvedParams = await params;
  const invoiceId = parseInt(resolvedParams.invoiceId);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice Id");
  }

  const result = await prisma.invoice.findFirst({
    where: orgId
      ? { id: invoiceId, organizationId: orgId }
      : { id: invoiceId, userId, organizationId: null },
    include: {
      customer: true,
    },
  });

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: result.customer,
  };

  return <Invoice invoice={invoice} />;
}