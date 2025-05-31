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
            <ThemeToggler />
            <SignedOut>
              <div className="bg-slate-200 cursor-pointer text-black hover:bg-zinc-900 hover:text-white hover:border-slate-200 py-1 px-4 rounded-4xl">
                <SignInButton />
              </div>
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
