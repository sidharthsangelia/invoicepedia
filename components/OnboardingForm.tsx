"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { onboardingAction } from "../actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useClerk();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const redirectTo =
      sessionStorage.getItem("pendingRedirect") ?? "/dashboard";
    formData.set("redirectTo", redirectTo);

    startTransition(async () => {
      const result = await onboardingAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      await session?.reload();

      sessionStorage.removeItem("pendingRedirect");
    
      window.location.href = result.redirectTo;
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-950 p-8 shadow-lg">
        <header className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="mx-auto mb-4 text-neutral-400"
            viewBox="0 0 24 24"
          >
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
          <h1 className="text-xl font-semibold text-white">
            Set up your company
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            This information appears on your invoices
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-sm text-neutral-300">
              Company name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              required
              placeholder="Acme Inc."
              className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="companyEmail" className="text-sm text-neutral-300">
              Billing email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyEmail"
              name="companyEmail"
              type="email"
              required
              placeholder="billing@acme.com"
              className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="companyWebsite"
              className="text-sm text-neutral-300"
            >
              Website{" "}
              <span className="text-neutral-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              placeholder="https://acme.com"
              className="border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500 focus:border-neutral-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
