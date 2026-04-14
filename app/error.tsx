"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
      
      {/* Background layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      {/* Icon */}
      <div className="mb-6 flex items-center justify-center rounded-full bg-destructive/10 p-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-foreground">
        Something went wrong
      </h1>

      {/* Message */}
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while processing your request.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>

        <Button variant="outline" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>

      {/* Dev-friendly error (only visible in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-10 max-w-lg rounded-md border border-border bg-muted p-4 text-left text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Error details:</p>
          <p className="break-words">{error.message}</p>
        </div>
      )}
    </div>
  );
}