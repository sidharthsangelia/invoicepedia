"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function AuthSection() {
  const { isSignedIn, isLoaded } = useUser();

  // Prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <>
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="rounded-md text-sm font-semibold"
          >
            Sign In
          </Button>
        </SignInButton>
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </>
  );
}