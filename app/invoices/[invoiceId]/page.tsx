import { prisma } from "@/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Invoice from "./Invoice";

type InvoicePageProps = {
  params: Promise<{ invoiceId: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const { invoiceId } = await params;

  // IDs are now cuid strings — no parseInt needed
  if (!invoiceId || invoiceId.length < 1) {
    throw new Error("Invalid Invoice ID");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      deletedAt: null,
      ...(orgId
        ? { organizationId: orgId }
        : { userId, organizationId: null }),
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
      lineItems: {
        select: {
          id: true,
          description: true,
          quantity: true,
          unitAmount: true,
        },
        orderBy: { createdAt: "asc" },
      },
      activities: {
        select: {
          id: true,
          createdAt: true,
          type: true,
          note: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!invoice) notFound();

  return <Invoice invoice={invoice} />;
}