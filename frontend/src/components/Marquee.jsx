import FastMarquee from "react-fast-marquee";

const ITEMS = [
  "Presented by AIWEBTOOLS.AI",
  "Premium Web3 Domains",
  "Minted on Polygon & Solana",
  "Direct Checkout via Freename",
  "One Name. One Owner. Forever.",
];

export const Marquee = () => {
  return (
    <div className="border-y border-white/10 bg-[#0A0A0A] py-5 overflow-hidden" data-testid="editorial-marquee">
      <FastMarquee speed={28} gradient={false} pauseOnHover>
        {ITEMS.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono2 text-sm md:text-base tracking-[0.3em] uppercase text-white/45 px-8">
              {item}
            </span>
            <span className="text-[#CCFF00] text-xs px-2">◆</span>
          </span>
        ))}
      </FastMarquee>
    </div>
  );
};
