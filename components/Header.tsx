import Container from "./Container";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import AuthSection from "./AuthSection";

export default function Header() {
  return (
    <header className="w-full py-5 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex justify-between items-center gap-6">
          
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition"
          >
            Invoicepedia
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggler />
            <AuthSection />
          </div>

        </div>
      </Container>
    </header>
  );
}