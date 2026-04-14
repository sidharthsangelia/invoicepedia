import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/Container";

export default function InvoiceLoading() {
  return (
    <main className="min-h-screen py-8">
      <Container>
        {/* ── Back link ── */}
        <Skeleton className="h-4 w-24 rounded-md mb-6" />

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Skeleton className="h-7 w-52 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* ── Body grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Line Items table */}
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Table header bar */}
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_128px_128px] gap-3 px-4 py-3 border-b border-border">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md ml-auto" />
                <Skeleton className="h-3 w-16 rounded-md ml-auto" />
                <Skeleton className="h-3 w-16 rounded-md ml-auto" />
              </div>

              {/* Rows */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_80px_128px_128px] gap-3 px-4 py-3.5 border-b border-border last:border-0"
                >
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-8 rounded-md ml-auto" />
                  <Skeleton className="h-4 w-16 rounded-md ml-auto" />
                  <Skeleton className="h-4 w-20 rounded-md ml-auto" />
                </div>
              ))}

              {/* Footer / total */}
              <div className="grid grid-cols-[1fr_80px_128px_128px] gap-3 px-4 py-3.5 bg-muted/30 border-t border-border">
                <span />
                <span />
                <Skeleton className="h-4 w-10 rounded-md ml-auto" />
                <Skeleton className="h-5 w-24 rounded-md ml-auto" />
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-5/6 rounded-md" />
              <Skeleton className="h-3.5 w-4/6 rounded-md" />
            </div>

            {/* Activity Timeline */}
            <div className="rounded-xl border border-border p-5 space-y-4">
              <Skeleton className="h-4 w-16 rounded-md" />
              <ol className="relative border-l border-border space-y-5 ml-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="ml-4 space-y-1.5">
                    <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-muted-foreground/30" />
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Customer card */}
            <div className="rounded-xl border border-border p-5 space-y-4">
              <Skeleton className="h-4 w-20 rounded-md" />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
                  <Skeleton className="h-4 w-44 rounded-md" />
                </div>
              </div>
            </div>

            {/* Invoice meta card */}
            <div className="rounded-xl border border-border p-5 space-y-4">
              <Skeleton className="h-4 w-14 rounded-md" />
              <div className="space-y-3">
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-14 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-12 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <Separator />
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-4 w-12 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}