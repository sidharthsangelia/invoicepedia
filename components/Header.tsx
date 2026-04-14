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
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:opacity-80 transition"
            >
              Invoicepedia
            </Link>

            <SignedIn>
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard"
                appearance={{
                  variables: {
                    colorText: "hsl(var(--foreground))",
                    colorTextSecondary: "hsl(var(--muted-foreground))",
                    colorBackground: "hsl(var(--background))",
                    colorInputBackground: "hsl(var(--background))",
                    colorNeutral: "hsl(var(--muted))",
                  },
                  elements: {
                    rootBox:
                      "rounded-md border border-border bg-background hover:bg-muted transition px-3  py-1.5 shadow-sm",

                    /* 👇 THIS fixes modal */
                    modalContent:
                      "bg-card text-foreground border border-border shadow-lg rounded-lg p-6 w-full max-w-md",

                    modalBackdrop:
                      "bg-black/50 backdrop-blur-sm fixed inset-0 z-40",

                    /* dropdown (also important) */
                    organizationSwitcherPopoverCard:
                      "bg-card text-foreground border border-border shadow-md rounded-md p-2 w-48",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggler />

            <SignedOut>
              <Button
                asChild
                variant="outline"
                className="rounded-md text-sm font-semibold"
              >
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
