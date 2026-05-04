// components/pdf-templates/template-preview/MinimalMonoPreview.tsx
//
// Static thumbnail  → used in InvoicePDFDialog (no props, renders placeholders)
// Live full preview → used in the split-screen builder (data + size="full")
//
// Design: Freelancer — full-bleed navy header, pale tint meta strip, navy total chip.

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
  companyName: "YOUR NAME",
  companyEmail: "your@email.com",
  customerName: "Client Name",
  customerEmail: "client@email.com",
  invoiceNumber: "INV-2025-001",
  dueDate: "2025-01-31",
  currency: "USD",
  lineItems: [
    { description: "Web Design",  quantity: 1, unitAmount: 1200 },
    { description: "Development", quantity: 3, unitAmount: 1200 },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function MinimalMonoPreview({ data, size = "thumbnail" }: PreviewProps) {
  const companyName   = (data?.companyName   || PH.companyName).toUpperCase();
  const companyEmail  = data?.companyEmail   || PH.companyEmail;
  const customerName  = data?.customerName   || PH.customerName;
  const customerEmail = data?.customerEmail  || PH.customerEmail;
  const invoiceNumber = data?.invoiceNumber  || PH.invoiceNumber;
  const dueDate       = formatDate(data?.dueDate || PH.dueDate);
  const currency      = data?.currency       || PH.currency;

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
    <div className="w-full h-[168px] rounded border border-gray-200 bg-[#FDFCFA] overflow-hidden select-none font-mono flex flex-col">
      {/* Full-bleed navy header */}
      <div className="bg-[#1E3A5F] px-3 pt-2.5 pb-2 flex justify-between items-end shrink-0">
        <div>
          <div className="text-[7px] font-bold text-white tracking-wide leading-tight">
            {companyName}
          </div>
          <div className="text-[4px] text-[#93B4D4] mt-0.5">{companyEmail}</div>
        </div>
        <div className="text-right">
          <div className="text-[3.5px] tracking-[0.25em] text-[#93B4D4] uppercase mb-0.5">
            Invoice
          </div>
          <div className="text-[8px] font-bold text-white">{invoiceNumber}</div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="bg-[#EEF3F9] px-3 py-1.5 flex gap-1 border-b border-gray-200 shrink-0">
        <div className="flex-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Billed To
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">{customerName}</div>
          <div className="text-[3.5px] text-[#71717A]">{customerEmail}</div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Due Date
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">{dueDate}</div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1 text-right">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Currency
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">{currency}</div>
        </div>
      </div>

      {/* Table body */}
      <div className="flex-1 px-3 pt-1.5 flex flex-col min-h-0">
        <div className="flex border-b-2 border-[#18181B] pb-0.5 mb-0.5">
          <span className="flex-1 text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Description
          </span>
          <span className="text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Amount
          </span>
        </div>

        {visibleItems.map((item, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-[#D4D4D8] py-0.5"
          >
            <span className="text-[4px] text-[#18181B]">
              {item.description || "—"}
            </span>
            <span className="text-[4px] font-bold text-[#18181B]">
              {formatAmount(item.quantity * item.unitAmount, currency)}
            </span>
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="text-[#71717A] py-0.5" style={{ fontSize: "3.5px" }}>
            + {hiddenCount} more item{hiddenCount > 1 ? "s" : ""}
          </div>
        )}

        {/* Total chip */}
        <div className="flex justify-end mt-auto pb-1.5">
          <div className="bg-[#1E3A5F] flex gap-3 items-center px-2 py-1">
            <span className="text-[3.5px] font-bold tracking-widest text-[#93B4D4] uppercase">
              Total Due
            </span>
            <span className="text-[6px] font-bold text-white">
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