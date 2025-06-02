import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Container from "./Container";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function Header() {
  return (
    <header className="w-full py-5 border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex justify-between items-center gap-6">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-foreground hover:opacity-80 transition">
              Invoicepedia
            </Link>

            <SignedIn>
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "rounded-md border border-border px-2 py-1",
                    organizationSwitcherTrigger: "text-sm font-medium text-muted-foreground",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggler />

            <SignedOut>
              <Button asChild variant="outline" className="rounded-md text-sm font-semibold">
                <SignInButton />
              </Button>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
