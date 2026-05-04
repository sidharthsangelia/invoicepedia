import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
 
import { TemplateId } from "@/types/invoice";
import InvoiceBuilder from "@/components/invoice/InvoiceBuilder";
import { prisma } from "@/db/prisma";

export const metadata = {
  title: "Create Invoice",
};

// Valid template ids — used to sanitise the query param
const VALID_TEMPLATES = new Set<TemplateId>(["classic", "modern", "mono", "luxe"]);

function resolveTemplate(param: string | undefined): TemplateId {
  if (param && VALID_TEMPLATES.has(param as TemplateId)) {
    return param as TemplateId;
  }
  // Fall back to classic if the param is missing or tampered with
  return "classic";
}

interface NewInvoicePageProps {
  searchParams: Promise<{ template?: string }>;
}

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Resolve template from query param — sanitised, never throws
  const { template } = await searchParams;
  const templateId = resolveTemplate(template);

  // Fetch only what the preview needs — no over-fetching
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      companyName:  true,
      companyEmail: true,
    },
  });

  return (
    <InvoiceBuilder
      initialTemplate={templateId}
      userCompany={{
        companyName:  user?.companyName  ?? null,
        companyEmail: user?.companyEmail ?? null,
      }}
    />
  );
}