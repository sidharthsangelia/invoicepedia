import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Container from "@/components/Container";

export default function NewInvoiceLoading() {
  return (
    <main className="min-h-full pb-16">
      <Container>
        {/* Page header */}
        <div className="flex items-center gap-4 py-6 border-b border-border">
          {/* Back button */}
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </div>

        {/* Form skeleton */}
        <div className="mt-8 max-w-3xl space-y-6">

          {/* ── Customer Details ── */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md mt-1" />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              {/* Email */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              {/* Phone */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-14 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              {/* Address */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* ── Invoice Details ── */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md mt-1" />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {/* Invoice Number */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
              {/* Currency */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              {/* Due Date */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* ── Line Items ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
                {/* Add Item button */}
                <Skeleton className="h-8 w-24 rounded-md shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Column headers (desktop) */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_40px] gap-3 px-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <span />
              </div>

              {/* Line item row 1 */}
              <div className="sm:grid sm:grid-cols-[1fr_100px_120px_40px] gap-3 items-start space-y-3 sm:space-y-0">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              {/* Line item row 2 */}
              <div className="sm:grid sm:grid-cols-[1fr_100px_120px_40px] gap-3 items-start space-y-3 sm:space-y-0">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              <Separator className="my-2" />

              {/* Totals */}
              <div className="flex justify-end">
                <div className="space-y-2 min-w-[200px]">
                  <div className="flex justify-between gap-8">
                    <Skeleton className="h-4 w-14 rounded-md" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                  <div className="flex justify-between gap-8 border-t border-border pt-2">
                    <Skeleton className="h-5 w-10 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Notes ── */}
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md mt-1" />
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-3 w-72 rounded-md" />
            </CardContent>
          </Card>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>
        </div>
      </Container>
    </main>
  );
}