"use server";

import { prisma } from "@/db/prisma";
import { Status } from "@/generated/prisma/enums";
 
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const value = Math.floor(parseFloat(String(formData.get("value")))) * 100;
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      userId,
      organizationId: orgId || null,
    },
    select: {
      id: true,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      value,
      description,
      userId,
      customerId: customer.id,
      status: Status.PENDING, // Default new invoices to PENDING
      organizationId: orgId || null,
    },
    select: {
      id: true,
    },
  });

  redirect(`/invoices/${invoice.id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const id = Number(formData.get("id"));
  const status = formData.get("status") as Status;

  if (orgId) {
    await prisma.invoice.updateMany({
      where: {
        id,
        organizationId: orgId,
      },
      data: {
        status,
      },
    });
  } else {
    await prisma.invoice.updateMany({
      where: {
        id,
        userId,
        organizationId: null,
      },
      data: {
        status,
      },
    });
  }

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const id = Number(formData.get("id"));

  if (orgId) {
    await prisma.invoice.deleteMany({
      where: {
        id,
        organizationId: orgId,
      },
    });
  } else {
    await prisma.invoice.deleteMany({
      where: {
        id,
        userId,
        organizationId: null,
      },
    });
  }

  redirect("/dashboard");
}

export async function createPayment(formData: FormData) {
  const headersList = await headers();
  const origin = headersList.get("origin");

  const id = Number(formData.get("id"));

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: {
      status: true,
      value: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product: "prod_SEljwTBkWRQXjo",
          unit_amount: invoice.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid Session");
  }

  redirect(session.url);
}