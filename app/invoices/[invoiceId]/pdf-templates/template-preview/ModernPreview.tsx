// components/pdf-templates/template-preview/ModernPreview.tsx
//
// Static thumbnail  → used in InvoicePDFDialog (no props, renders placeholders)
// Live full preview → used in the split-screen builder (data + size="full")
//
// Design: Agency — muted sage accent bar on the left, airy white summary pill.

import { PreviewProps } from "@/types/invoice";

// ── Shared helpers ────────────────────────────────────────────────────────────

function formatAmount(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Placeholder values ────────────────────────────────────────────────────────

const PH = {
  companyName: "Your Company",
  companyEmail: "your@company.com",
  customerName: "Acme Corp",
  customerEmail: "acme@corp.com",
  invoiceNumber: "INV-2025-001",
  dueDate: "2025-01-31",
  currency: "USD",
  lineItems: [
    { description: "Web Design",  quantity: 1, unitAmount: 1200 },
    { description: "Development", quantity: 3, unitAmount: 1200 },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ModernPreview({ data, size = "thumbnail" }: PreviewProps) {
  const companyName   = data?.companyName   || PH.companyName;
  const companyEmail  = data?.companyEmail  || PH.companyEmail;
  const customerName  = data?.customerName  || PH.customerName;
  const invoiceNumber = data?.invoiceNumber || PH.invoiceNumber;
  const dueDate       = formatDate(data?.dueDate || PH.dueDate);
  const currency      = data?.currency      || PH.currency;

  const rawItems     = data?.lineItems?.length ? data.lineItems : PH.lineItems;
  const maxItems     = size === "full" ? 4 : 2;
  const visibleItems = rawItems.slice(0, maxItems);
  const hiddenCount  = rawItems.length - visibleItems.length;

  const total = rawItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  // ── Inner card ───────────────────────────────────────────────────────────────
  const card = (
    <div className="relative w-full h-[168px] rounded border border-gray-200 bg-[#F8F7F4] overflow-hidden select-none flex">
      {/* Left accent stripe */}
      <div className="w-[3px] shrink-0 bg-[#4A7C6F]" />

      <div className="flex-1 p-3 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-[7px] font-bold text-[#1C1C1A] leading-none">
              {companyName}
            </div>
            <div className="text-[4.5px] text-[#7A7A74] mt-0.5">
              {companyEmail}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[4px] tracking-widest text-[#4A7C6F] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[6px] font-bold text-[#1C1C1A]">
              {invoiceNumber}
            </div>
          </div>
        </div>

        {/* Summary pill */}
        <div className="bg-white rounded p-1.5 flex gap-1.5 mb-2 border border-gray-100">
          <div className="flex-1">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Billed To
            </div>
            <div className="text-[5px] font-semibold text-[#1C1C1A]">
              {customerName}
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Due
            </div>
            <div className="text-[5px] font-semibold text-[#1C1C1A]">
              {dueDate}
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-right">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Amount Due
            </div>
            <div className="text-[7px] font-bold text-[#4A7C6F]">
              {formatAmount(total, currency)}
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="bg-[#EAF0EE] rounded px-1.5 py-1 mb-1 flex">
          <span className="flex-1 text-[4px] tracking-widest text-[#3A6259] uppercase">
            Description
          </span>
          <span className="text-[4px] tracking-widest text-[#3A6259] uppercase">
            Total
          </span>
        </div>

        {/* Line items */}
        {visibleItems.map((item, i) => (
          <div
            key={i}
            className="flex justify-between px-1.5 py-0.5 border-b border-gray-200"
          >
            <span className="text-[4.5px] text-[#1C1C1A]">
              {item.description || "—"}
            </span>
            <span className="text-[4.5px] font-bold text-[#1C1C1A]">
              {formatAmount(item.quantity * item.unitAmount, currency)}
            </span>
          </div>
        ))}

        {/* Overflow indicator */}
        {hiddenCount > 0 && (
          <div className="px-1.5 text-[#7A7A74]" style={{ fontSize: "3.5px" }}>
            + {hiddenCount} more item{hiddenCount > 1 ? "s" : ""}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-end mt-1.5">
          <div className="border-t-2 border-[#4A7C6F] pt-0.5">
            <span className="text-[5px] font-bold text-[#4A7C6F]">
              TOTAL {formatAmount(total, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (size === "thumbnail") return card;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "scale(4.2)",
          transformOrigin: "top left",
          width: "calc(100% / 4.2)",
        }}
      >
        {card}
      </div>
    </div>
  );
}