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
import { CirclePlus } from "lucide-react";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) return;

  let results;
  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  const invoices =
    results?.map(({ invoices, customers }) => ({
      ...invoices,
      customer: customers,
    })) || [];

  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <Button asChild className="inline-flex gap-2">
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableCaption className="text-muted-foreground">
              A list of your recent invoices
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 w-[120px]">Date</TableHead>
                <TableHead className="p-4">Customer</TableHead>
                <TableHead className="p-4">Email</TableHead>
                <TableHead className="p-4 text-center">Status</TableHead>
                <TableHead className="p-4 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-6 text-center text-muted-foreground">
                    No invoices found. Create one to get started!
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((result) => (
                  <TableRow
                    key={result.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="p-4 text-foreground font-medium">
                      <Link href={`/invoices/${result.id}`}>
                        {new Date(result.createTs).toLocaleDateString()}
                      </Link>
                    </TableCell>
                    <TableCell className="p-4">
                      <Link href={`/invoices/${result.id}`}>
                        {result.customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      <Link href={`/invoices/${result.id}`}>
                        {result.customer.email}
                      </Link>
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      <Badge
                        className={cn(
                          "capitalize px-3 py-1 rounded-full text-white text-xs",
                          result.status === "open" && "bg-blue-500",
                          result.status === "paid" && "bg-green-600",
                          result.status === "void" && "bg-zinc-700",
                          result.status === "uncollectable" && "bg-red-600"
                        )}
                      >
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 text-right font-medium">
                      <Link href={`/invoices/${result.id}`}>
                        ${(result.value / 100).toFixed(2)}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </main>
  );
}
