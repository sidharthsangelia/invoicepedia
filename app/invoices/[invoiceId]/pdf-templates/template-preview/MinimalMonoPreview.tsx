
// ── Minimal Mono → "Freelancer" Preview ───────────────────────────────────
// Mirrors: full-bleed navy header · pale tint meta strip · navy total chip
 export default function MinimalMonoPreview() {
  return (
    <div className="w-full h-[168px] rounded border border-gray-200 bg-[#FDFCFA] overflow-hidden select-none font-mono flex flex-col">
      {/* Full-bleed navy header */}
      <div className="bg-[#1E3A5F] px-3 pt-2.5 pb-2 flex justify-between items-end shrink-0">
        <div>
          <div className="text-[7px] font-bold text-white tracking-wide leading-tight">
            YOUR NAME
          </div>
          <div className="text-[4px] text-[#93B4D4] mt-0.5">your@email.com</div>
        </div>
        <div className="text-right">
          <div className="text-[3.5px] tracking-[0.25em] text-[#93B4D4] uppercase mb-0.5">
            Invoice
          </div>
          <div className="text-[8px] font-bold text-white">INV-2025-001</div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="bg-[#EEF3F9] px-3 py-1.5 flex gap-1 border-b border-gray-200 shrink-0">
        <div className="flex-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Billed To
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Client Name
          </div>
          <div className="text-[3.5px] text-[#71717A]">client@email.com</div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Issue Date
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Jan 1, 2025
          </div>
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mt-1 mb-0.5">
            Due Date
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">
            Jan 31, 2025
          </div>
        </div>
        <div className="w-px bg-[#D4D4D8]" />
        <div className="flex-1 px-1 text-right">
          <div className="text-[3px] tracking-widest text-[#71717A] uppercase mb-0.5">
            Currency
          </div>
          <div className="text-[4.5px] font-bold text-[#18181B]">USD</div>
        </div>
      </div>

      {/* Table body */}
      <div className="flex-1 px-3 pt-1.5 flex flex-col">
        <div className="flex border-b-2 border-[#18181B] pb-0.5 mb-0.5">
          <span className="flex-1 text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Description
          </span>
          <span className="text-[3.5px] font-bold tracking-widest text-[#71717A] uppercase">
            Amount
          </span>
        </div>
        {[
          ["Web Design", "$1,200.00"],
          ["Development", "$3,600.00"],
        ].map(([d, a]) => (
          <div
            key={d}
            className="flex justify-between border-b border-[#D4D4D8] py-0.5"
          >
            <span className="text-[4px] text-[#18181B]">{d}</span>
            <span className="text-[4px] font-bold text-[#18181B]">{a}</span>
          </div>
        ))}

        {/* Total chip */}
        <div className="flex justify-end mt-auto pb-1.5">
          <div className="bg-[#1E3A5F] flex gap-3 items-center px-2 py-1">
            <span className="text-[3.5px] font-bold tracking-widest text-[#93B4D4] uppercase">
              Total Due
            </span>
            <span className="text-[6px] font-bold text-white">$4,800.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

 