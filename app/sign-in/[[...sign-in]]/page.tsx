"use client";

import { Button } from "@/components/ui/button";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center flex-grow px-4 sm:px-6 md:px-8 lg:px-10">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-950 p-8 shadow-lg"
        >
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
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            <h1 className="text-xl font-semibold text-white">
              Sign in to Invoicipedia
            </h1>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-500" />

          <Clerk.Field name="identifier">
            <Clerk.Label className="sr-only">Email</Clerk.Label>
            <Clerk.Input
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
            <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
          </Clerk.Field>

          <SignIn.Action submit asChild>
            <Button className="w-full font-semibold">Sign In</Button>
          </SignIn.Action>

          <div>
            <p className="mb-3 text-center text-sm text-neutral-500">
              Or sign in with
            </p>
            <div className="space-y-2">
              <Clerk.Connection name="google" asChild>
                <Button
                  className="w-full justify-center gap-2 border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
                  variant="outline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                  >
                    <path
                      fill="currentColor"
                      d="M8.32 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.498.96 10.756 0 8.32 0 3.91 0 .205 3.591.205 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.32Z"
                    />
                  </svg>
                  Google
                </Button>
              </Clerk.Connection>
            </div>
          </div>

          <p className="text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Clerk.Link
              navigate="sign-up"
              className="underline underline-offset-2 text-neutral-300 hover:text-white"
            >
              Sign up
            </Clerk.Link>
          </p>
        </SignIn.Step>

        {/* Updated styling for verification steps */}
        <SignIn.Step
          name="verifications"
          className="w-full max-w-md space-y-6 rounded-xl border border-neutral-800 bg-neutral-950 p-8 shadow-lg"
        >
          {/* The following changes apply to both strategies */}
          <SignIn.Strategy name="email_code">
            <header className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                className="mx-auto mb-4 text-neutral-400"
              >
                <circle cx="20" cy="20" r="20" fill="#0A0A0A" />
              </svg>
              <h1 className="text-xl font-semibold text-white">
                Verify Email Code
              </h1>
            </header>
            <Clerk.GlobalError className="text-sm text-red-500" />
            <Clerk.Field name="code">
              <Clerk.Input
                type="otp"
                required
                placeholder="Code"
                className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
              <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
            </Clerk.Field>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-gradient-to-r from-neutral-600 to-neutral-800 py-2 text-sm text-white hover:opacity-90"
            >
              Continue
            </SignIn.Action>
          </SignIn.Strategy>

          <SignIn.Strategy name="phone_code">
            <header className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                className="mx-auto mb-4 text-neutral-400"
              >
                <circle cx="20" cy="20" r="20" fill="#0A0A0A" />
              </svg>
              <h1 className="text-xl font-semibold text-white">
                Verify Phone Code
              </h1>
            </header>
            <Clerk.GlobalError className="text-sm text-red-500" />
            <Clerk.Field name="code">
              <Clerk.Input
                type="otp"
                required
                placeholder="Code"
                className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
              <Clerk.FieldError className="mt-2 block text-xs text-red-500" />
            </Clerk.Field>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-gradient-to-r from-neutral-600 to-neutral-800 py-2 text-sm text-white hover:opacity-90"
            >
              Login
            </SignIn.Action>
          </SignIn.Strategy>

          <p className="text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Clerk.Link
              navigate="sign-up"
              className="underline underline-offset-2 text-neutral-300 hover:text-white"
            >
              Sign up
            </Clerk.Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
