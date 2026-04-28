import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <Button asChild className="inline-flex gap-2 ">
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
        {children}
      </Container>
    </main>
  );
}
