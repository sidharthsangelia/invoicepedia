  
// ── Modern → "Agency" Preview ─────────────────────────────────────────────
// Muted sage accent bar on the left, airy white summary pill, clean sans.
// Target: boutique creative agencies & design studios.
export default function ModernPreview() {
  return (
    <div className="relative w-full h-[168px] rounded border border-gray-200 bg-[#F8F7F4] overflow-hidden select-none flex">
      {/* Left accent stripe */}
      <div className="w-[3px] shrink-0 bg-[#4A7C6F]" />

      <div className="flex-1 p-3 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-[7px] font-bold text-[#1C1C1A] leading-none">
              Your Company
            </div>
            <div className="text-[4.5px] text-[#7A7A74] mt-0.5">
              your@company.com
            </div>
          </div>
          <div className="text-right">
            <div className="text-[4px] tracking-widest text-[#4A7C6F] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[6px] font-bold text-[#1C1C1A]">
              INV-2025-001
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
              Acme Corp
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Due
            </div>
            <div className="text-[5px] font-semibold text-[#1C1C1A]">
              Jan 31, 2025
            </div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-right">
            <div className="text-[3.5px] tracking-widest text-[#7A7A74] uppercase mb-0.5">
              Amount Due
            </div>
            <div className="text-[7px] font-bold text-[#4A7C6F]">$4,800</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#EAF0EE] rounded px-1.5 py-1 mb-1 flex">
          <span className="flex-1 text-[4px] tracking-widest text-[#3A6259] uppercase">
            Description
          </span>
          <span className="text-[4px] tracking-widest text-[#3A6259] uppercase">
            Total
          </span>
        </div>
        {[
          ["Web Design", "$1,200"],
          ["Development", "$3,600"],
        ].map(([desc, amt]) => (
          <div
            key={desc}
            className="flex justify-between px-1.5 py-0.5 border-b border-gray-200"
          >
            <span className="text-[4.5px] text-[#1C1C1A]">{desc}</span>
            <span className="text-[4.5px] font-bold text-[#1C1C1A]">{amt}</span>
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-end mt-1.5">
          <div className="border-t-2 border-[#4A7C6F] pt-0.5">
            <span className="text-[5px] font-bold text-[#4A7C6F]">
              TOTAL $4,800.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}