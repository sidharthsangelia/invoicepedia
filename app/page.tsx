import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

import Link from "next/link";



export default function Home() {
  return (
    <main className="flex flex-col justify-center h-[100vh] text-center max-w-5xl gap-6 mx-auto">
      <Container>
      <h1 className="text-5xl font-bold">Invoicipedia</h1>
      <p>
      
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
      </Container>
    </main>
  );
}
