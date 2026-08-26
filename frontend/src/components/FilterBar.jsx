import { Handshake } from "lucide-react";

const FILTERS = ["All", "Polygon", "Solana"];

export const FilterBar = ({ chainFilter, setChainFilter, matchCount, onOffer }) => {
  return (
    <div
      className="sticky top-16 z-40 bg-[#050505]/85 backdrop-blur-xl border-b border-white/10"
      data-testid="chain-filter-bar"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => {
            const active = chainFilter === f;
            return (
              <button
                key={f}
                onClick={() => setChainFilter(f)}
                data-testid={`filter-${f.toLowerCase()}`}
                className={`font-mono2 text-[11px] md:text-xs tracking-[0.2em] uppercase px-4 md:px-5 py-2 border transition-colors duration-300 ${
                  active
                    ? "bg-[#CCFF00] text-[#050505] border-[#CCFF00]"
                    : "border-white/15 text-white/50 hover:text-white hover:border-white/40"
                }`}
              >
                {f}
              </button>
            );
          })}
          <span className="hidden md:inline font-mono2 text-xs tracking-[0.2em] uppercase text-white/35 ml-4" data-testid="filter-match-count">
            {matchCount} TLDs
          </span>
        </div>
        <button
          onClick={onOffer}
          data-testid="filter-bar-offer-button"
          className="btn-acid inline-flex items-center gap-2 bg-[#CCFF00] text-[#050505] font-mono2 text-[11px] md:text-xs tracking-[0.15em] uppercase px-4 md:px-5 py-2"
        >
          <Handshake className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Make a Bulk Offer</span>
          <span className="sm:hidden">Offer</span>
        </button>
      </div>
    </div>
  );
};
