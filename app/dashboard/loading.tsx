import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CirclePlus } from "lucide-react";

function RowSkeleton() {
  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      {/* Date */}
      <TableCell className="p-4 font-medium whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[14px] w-[90px]" />
        </div>
      </TableCell>

      {/* Invoice # */}
      <TableCell className="p-4 font-mono text-sm">
        <Skeleton className="h-[14px] w-[70px]" />
      </TableCell>

      {/* Customer */}
      <TableCell className="p-4 font-medium">
        <Skeleton className="h-[14px] w-[120px]" />
      </TableCell>

      {/* Email */}
      <TableCell className="p-4 hidden sm:table-cell">
        <Skeleton className="h-[14px] w-[180px]" />
      </TableCell>

      {/* Status (badge-like) */}
      <TableCell className="p-4 text-center">
        <div className="flex justify-center">
          <Skeleton className="h-[22px] w-[75px] rounded-full" />
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell className="p-4 text-right font-medium tabular-nums">
        <div className="flex justify-end">
          <Skeleton className="h-[14px] w-[80px]" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Loading() {
  return (
    <main className="min-h-[80vh] pb-16 pt-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Title */}
          <Skeleton className="h-[32px] w-[140px]" />

          {/* Button */}
          <Button disabled className="inline-flex gap-2 opacity-80">
            <CirclePlus className="h-4 w-4 opacity-40" />
            <span className="sr-only">Loading</span>
            <Skeleton className="h-[14px] w-[110px]" />
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            {/* Caption */}
            <TableCaption className="pb-4">
              <div className="flex justify-center">
                <Skeleton className="h-[14px] w-[220px]" />
              </div>
            </TableCaption>

            {/* Header */}
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 w-[130px]">
                  <Skeleton className="h-[12px] w-[40px]" />
                </TableHead>
                <TableHead className="p-4">
                  <Skeleton className="h-[12px] w-[70px]" />
                </TableHead>
                <TableHead className="p-4">
                  <Skeleton className="h-[12px] w-[80px]" />
                </TableHead>
                <TableHead className="p-4 hidden sm:table-cell">
                  <Skeleton className="h-[12px] w-[60px]" />
                </TableHead>
                <TableHead className="p-4 text-center">
                  <div className="flex justify-center">
                    <Skeleton className="h-[12px] w-[50px]" />
                  </div>
                </TableHead>
                <TableHead className="p-4 text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-[12px] w-[60px]" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </main>
  );
}