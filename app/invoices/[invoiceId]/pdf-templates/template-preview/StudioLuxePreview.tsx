// components/pdf-templates/template-preview/StudioLuxePreview.tsx
//
// Static thumbnail  → used in InvoicePDFDialog (no props, renders placeholders)
// Live full preview → used in the split-screen builder (data + size="full")
//
// Design: Consultant — amber top rule, FROM/TO split, stone palette, left-border total block.

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
  companyName: "Your Studio",
  companyEmail: "your@studio.com",
  customerName: "Acme Studio",
  customerEmail: "acme@client.com",
  invoiceNumber: "INV-2025-001",
  dueDate: "2025-01-31",
  currency: "USD",
  lineItems: [
    { description: "Brand Strategy", quantity: 1, unitAmount: 2000 },
    { description: "Web Design",     quantity: 1, unitAmount: 3000 },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function StudioLuxePreview({ data, size = "thumbnail" }: PreviewProps) {
  const companyName   = data?.companyName   || PH.companyName;
  const companyEmail  = data?.companyEmail  || PH.companyEmail;
  const customerName  = data?.customerName  || PH.customerName;
  const customerEmail = data?.customerEmail || PH.customerEmail;
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
    <div className="w-full h-[168px] rounded border border-[#DDD8CF] bg-[#FAFAF8] overflow-hidden select-none flex flex-col">
      {/* Amber top rule */}
      <div className="h-[2.5px] bg-[#8B6340] shrink-0" />

      <div className="flex-1 px-3 pt-2 pb-1.5 flex flex-col gap-1.5 min-h-0">
        {/* Letterhead */}
        <div className="flex justify-between items-end pb-1.5 border-b border-[#DDD8CF]">
          <div>
            <div className="text-[7.5px] font-bold text-[#1C1A17] leading-tight">
              {companyName}
            </div>
            <div className="text-[4px] text-[#7C7468] tracking-wide">
              {companyEmail}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[3px] tracking-[0.3em] text-[#8B6340] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[5.5px] font-bold text-[#1C1A17]">
              {invoiceNumber}
            </div>
          </div>
        </div>

        {/* Parties — FROM / BILLED TO */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              From
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">{companyName}</div>
            <div className="text-[3.5px] text-[#7C7468]">{companyEmail}</div>
          </div>
          <div className="w-px bg-[#DDD8CF]" />
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              Billed To
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">{customerName}</div>
            <div className="text-[3.5px] text-[#7C7468]">{customerEmail}</div>
          </div>
        </div>

        {/* Date chips */}
        <div className="flex gap-1">
          {[
            ["Due Date", dueDate],
            ["Currency", currency],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex-1 bg-[#F3EFE9] rounded-[2px] px-1.5 py-1 border-l-[1.5px] border-[#C8C3BA]"
            >
              <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
                {label}
              </div>
              <div className="text-[4px] font-bold text-[#1C1A17]">{value}</div>
            </div>
          ))}
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-0">
          <div className="flex pb-0.5 border-b border-[#1C1A17]">
            <span className="flex-1 text-[3px] tracking-widest text-[#7C7468] uppercase">
              Description
            </span>
            <span className="text-[3px] tracking-widest text-[#7C7468] uppercase">
              Amount
            </span>
          </div>

          {visibleItems.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-[#DDD8CF] py-0.5"
            >
              <span className="text-[4px] text-[#1C1A17]">
                {item.description || "—"}
              </span>
              <span className="text-[4px] font-bold text-[#1C1A17]">
                {formatAmount(item.quantity * item.unitAmount, currency)}
              </span>
            </div>
          ))}

          {hiddenCount > 0 && (
            <div className="text-[#7C7468] py-0.5" style={{ fontSize: "3px" }}>
              + {hiddenCount} more item{hiddenCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Total block */}
        <div className="flex justify-end mt-auto">
          <div className="bg-[#F7F1EA] border-l-[2px] border-[#8B6340] flex justify-between items-center gap-4 pl-2 pr-3 py-1">
            <span className="text-[3px] tracking-[0.2em] text-[#8B6340] uppercase">
              Total Due
            </span>
            <span className="text-[7px] font-bold text-[#1C1A17]">
              {formatAmount(total, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (size === "thumbnail") return card;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-[#DDD8CF] shadow-sm"
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