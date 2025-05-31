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

function Header() {
  return (
    <header className="mt-5 mb-8">
      <Container>
        <div className="flex justify-between items-center gap-4">
          <div className="flex justify-between items-center gap-4">
            <p className="font-bold">
              <Link href="/dashboard">Invoicipedia</Link>
            </p>

            <SignedIn>
              <span className="-ml-2">
                <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
              </span>
            </SignedIn>
          </div>
          <div className=" flex space-x-3 items-center">
            <ThemeToggler/>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
