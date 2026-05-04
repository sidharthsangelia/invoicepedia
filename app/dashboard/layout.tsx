import Container from "@/components/Container";
import CreateInvoiceButton from "@/components/invoice/CreateInvoiceButton";


export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <CreateInvoiceButton />
        </div>
        {children}
      </Container>
    </main>
  );
}