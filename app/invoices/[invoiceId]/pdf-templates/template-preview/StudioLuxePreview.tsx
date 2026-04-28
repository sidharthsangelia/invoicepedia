 
// ── Studio Luxe → "Consultant" Preview ───────────────────────────────────
// Mirrors: amber top rule · from/to split · stone chips · left-border total block
export default function StudioLuxePreview() {
  return (
    <div className="w-full h-[168px] rounded border border-[#DDD8CF] bg-[#FAFAF8] overflow-hidden select-none flex flex-col">
      {/* Amber top rule */}
      <div className="h-[2.5px] bg-[#8B6340] shrink-0" />

      <div className="flex-1 px-3 pt-2 pb-1.5 flex flex-col gap-1.5 min-h-0">
        {/* Letterhead */}
        <div className="flex justify-between items-end pb-1.5 border-b border-[#DDD8CF]">
          <div>
            <div className="text-[7.5px] font-bold text-[#1C1A17] leading-tight">
              Your Studio
            </div>
            <div className="text-[4px] text-[#7C7468] tracking-wide">
              Independent Consulting
            </div>
          </div>
          <div className="text-right">
            <div className="text-[3px] tracking-[0.3em] text-[#8B6340] uppercase mb-0.5">
              Invoice
            </div>
            <div className="text-[5.5px] font-bold text-[#1C1A17]">
              INV-2025-001
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              From
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">
              Your Studio
            </div>
            <div className="text-[3.5px] text-[#7C7468]">your@studio.com</div>
          </div>
          <div className="w-px bg-[#DDD8CF]" />
          <div className="flex-1">
            <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
              Billed To
            </div>
            <div className="text-[4.5px] font-bold text-[#1C1A17]">
              Acme Studio
            </div>
            <div className="text-[3.5px] text-[#7C7468]">acme@client.com</div>
          </div>
        </div>

        {/* Date chips */}
        <div className="flex gap-1">
          {[
            ["Issue Date", "Jan 1, 2025"],
            ["Due Date", "Jan 31, 2025"],
            ["Currency", "USD"],
          ].map(([l, v]) => (
            <div
              key={l}
              className="flex-1 bg-[#F3EFE9] rounded-[2px] px-1.5 py-1 border-l-[1.5px] border-[#C8C3BA]"
            >
              <div className="text-[3px] tracking-widest text-[#7C7468] uppercase mb-0.5">
                {l}
              </div>
              <div className="text-[4px] font-bold text-[#1C1A17]">{v}</div>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-0">
          <div className="flex pb-0.5 border-b border-[#1C1A17]">
            <span className="flex-1 text-[3px] tracking-widest text-[#7C7468] uppercase">
              Description
            </span>
            <span className="text-[3px] tracking-widest text-[#7C7468] uppercase">
              Amount
            </span>
          </div>
          {[
            ["Brand Strategy", "$2,000"],
            ["Web Design", "$3,000"],
          ].map(([d, a]) => (
            <div
              key={d}
              className="flex justify-between border-b border-[#DDD8CF] py-0.5"
            >
              <span className="text-[4px] text-[#1C1A17]">{d}</span>
              <span className="text-[4px] font-bold text-[#1C1A17]">{a}</span>
            </div>
          ))}
        </div>

        {/* Total block */}
        <div className="flex justify-end mt-auto">
          <div className="bg-[#F7F1EA] border-l-[2px] border-[#8B6340] flex justify-between items-center gap-4 pl-2 pr-3 py-1">
            <span className="text-[3px] tracking-[0.2em] text-[#8B6340] uppercase">
              Total Due
            </span>
            <span className="text-[7px] font-bold text-[#1C1A17]">
              $5,000.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
