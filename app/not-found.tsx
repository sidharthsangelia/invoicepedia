import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
      {/* Background subtle glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      {/* Icon */}
      <div className="mb-6 flex items-center justify-center rounded-full bg-muted p-6 shadow-sm">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Big 404 */}
      <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
        404
      </h1>

      {/* Heading */}
      <h2 className="mt-4 text-2xl font-semibold text-foreground">
        This invoice doesn’t exist
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Looks like the page you’re trying to access has been moved, deleted, or
        never existed in the first place.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Subtle footer text */}
      <p className="mt-10 text-xs text-muted-foreground">
        Error code: 404_NOT_FOUND
      </p>
    </div>
  );
}
