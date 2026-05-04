// components/pdf-templates/template-preview/ClassicPreview.tsx
//
// Static thumbnail  → used in InvoicePDFDialog (no props, renders placeholders)
// Live full preview → used in the split-screen builder (data + size="full")

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

// ── Placeholder values (shown when no live data is provided) ──────────────────

const PH = {
  companyName: "Your Company",
  companyEmail: "your@company.com",
  customerName: "Client Name",
  customerEmail: "client@email.com",
  invoiceNumber: "INV-2025-001",
  dueDate: "2025-01-31",
  currency: "USD",
  lineItems: [
    { description: "Web Design", quantity: 1, unitAmount: 1200 },
    { description: "Development", quantity: 3, unitAmount: 1200 },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClassicPreview({ data, size = "thumbnail" }: PreviewProps) {
  // Resolve values: live data → fallback to placeholder
  const companyName   = data?.companyName   || PH.companyName;
  const companyEmail  = data?.companyEmail  || PH.companyEmail;
  const customerName  = data?.customerName  || PH.customerName;
  const customerEmail = data?.customerEmail || PH.customerEmail;
  const invoiceNumber = data?.invoiceNumber || PH.invoiceNumber;
  const dueDate       = formatDate(data?.dueDate || PH.dueDate);
  const currency      = data?.currency      || PH.currency;

  const rawItems      = data?.lineItems?.length ? data.lineItems : PH.lineItems;
  const maxItems      = size === "full" ? 4 : 2;
  const visibleItems  = rawItems.slice(0, maxItems);
  const hiddenCount   = rawItems.length - visibleItems.length;

  const total = rawItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  // ── Inner card — identical layout for both sizes ────────────────────────────
  const card = (
    <div
      className="relative w-full rounded border border-gray-200 bg-white select-none"
      style={{ height: 168, fontSize: 0 }}
    >
      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex justify-between mb-3">
          <div>
            <div className="font-bold tracking-widest text-black" style={{ fontSize: 11 }}>
              INVOICE
            </div>
            <div className="text-gray-500 mt-0.5" style={{ fontSize: 5.5 }}>
              {invoiceNumber}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-black" style={{ fontSize: 6.5 }}>
              {companyName}
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              {companyEmail}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between mb-3">
          <div>
            <div className="uppercase tracking-wider text-gray-500 mb-1" style={{ fontSize: 4.5 }}>
              Bill To
            </div>
            <div className="font-medium text-black" style={{ fontSize: 6 }}>
              {customerName}
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              {customerEmail}
            </div>
          </div>
          <div className="text-right">
            <div className="uppercase tracking-wider text-gray-500 mb-1" style={{ fontSize: 4.5 }}>
              Details
            </div>
            <div className="text-black" style={{ fontSize: 5 }}>
              Due {dueDate}
            </div>
            <div className="text-gray-500" style={{ fontSize: 5 }}>
              {currency}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-black mb-2" />

        {/* Table */}
        <div>
          {/* Header row */}
          <div className="flex pb-1 mb-1 border-b border-black">
            <span className="flex-1 font-semibold text-gray-700" style={{ fontSize: 4.5 }}>
              Description
            </span>
            <span className="w-5 text-center font-semibold text-gray-700" style={{ fontSize: 4.5 }}>
              Qty
            </span>
            <span className="w-10 text-right font-semibold text-gray-700" style={{ fontSize: 4.5 }}>
              Amount
            </span>
          </div>

          {/* Line item rows */}
          {visibleItems.map((item, i) => (
            <div key={i} className="flex py-0.5">
              <span className="flex-1 text-black" style={{ fontSize: 4.5 }}>
                {item.description || "—"}
              </span>
              <span className="w-5 text-center text-gray-500" style={{ fontSize: 4.5 }}>
                {item.quantity}
              </span>
              <span className="w-10 text-right text-black" style={{ fontSize: 4.5 }}>
                {formatAmount(item.quantity * item.unitAmount, currency)}
              </span>
            </div>
          ))}

          {/* Overflow indicator */}
          {hiddenCount > 0 && (
            <div className="text-gray-400 py-0.5" style={{ fontSize: 4 }}>
              + {hiddenCount} more item{hiddenCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-end mt-2">
          <div
            className="border-t border-black pt-1 font-semibold text-black"
            style={{ fontSize: 6 }}
          >
            TOTAL {formatAmount(total, currency)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-1 border-t border-gray-200">
        <span className="text-gray-500" style={{ fontSize: 4.5 }}>
          Thank you for your business | Invoice generated by Invoicepedia
        </span>
        <span className="text-gray-500" style={{ fontSize: 4.5 }}>
          {invoiceNumber}
        </span>
      </div>
    </div>
  );

  // ── Thumbnail mode — render as-is (original behaviour) ───────────────────────
  if (size === "thumbnail") return card;

  // ── Full mode — scale up inside an A4-ratio container ────────────────────────
  // The inner card is 168px tall at its native size.
  // We scale it up by ~4× so it fills a ~700px-wide panel naturally.
  // The outer container uses A4 aspect ratio (210 × 297mm = 1 : 1.4142).
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          // Scale the 168px card to fill the full-width container.
          // transformOrigin top-left so it anchors correctly.
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