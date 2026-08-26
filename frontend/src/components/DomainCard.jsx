import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Copy } from "lucide-react";
import { toast } from "sonner";
import { buyUrl, FROM_PRICES } from "../data/domains";

const ChainBadge = ({ chain }) => {
  const isPolygon = chain === "Polygon";
  return (
    <span
      data-testid={`chain-badge-${chain.toLowerCase()}`}
      className={`font-mono2 text-[10px] tracking-[0.2em] uppercase px-3 py-1 border ${
        isPolygon
          ? "border-purple-400/40 text-purple-300/90 bg-purple-400/[0.06]"
          : "border-emerald-400/40 text-emerald-300/90 bg-emerald-400/[0.06]"
      }`}
    >
      {chain}
    </span>
  );
};

export const DomainCard = ({ domain, index, defaultChain }) => {
  const chain = domain.chain || defaultChain;
  const price = FROM_PRICES[domain.slug];
  const url = buyUrl(domain.slug);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Referral link copied", { description: url });
    } catch {
      toast.error("Copy failed — clipboard unavailable");
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`domain-card-${domain.slug}`}
      className="card-glow group relative flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 p-7 min-h-[300px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono2 text-lg md:text-xl font-medium text-white break-all" data-testid={`domain-name-${domain.slug}`}>
          {domain.name}
        </h3>
        {domain.verified && (
          <span className="inline-flex items-center gap-1.5 font-mono2 text-[10px] tracking-[0.15em] uppercase text-[#CCFF00]" data-testid={`verified-badge-${domain.slug}`}>
            <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            Live
          </span>
        )}
      </div>

      {price && (
        <div className="mt-3 flex items-baseline gap-2" data-testid={`domain-price-${domain.slug}`}>
          <span className="font-mono2 text-[10px] tracking-[0.2em] uppercase text-white/35">From</span>
          <span className="font-mono2 text-lg font-medium text-[#CCFF00]">${price.toFixed(2)}</span>
        </div>
      )}

      <p className="mt-4 text-sm text-white/50 font-light leading-relaxed flex-1">
        {domain.pitch}
      </p>

      <div className="mt-8 flex items-center justify-between gap-3">
        <ChainBadge chain={chain} />
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            data-testid={`copy-button-${domain.slug}`}
            aria-label={`Copy referral link for ${domain.name}`}
            className="p-2.5 border border-white/15 text-white/50 hover:text-[#CCFF00] hover:border-[#CCFF00]/50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`buy-button-${domain.slug}`}
            className="btn-acid inline-flex items-center gap-2 bg-[#CCFF00] text-[#050505] font-mono2 text-[11px] tracking-[0.15em] uppercase px-4 py-2.5"
          >
            Buy Now
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      <span className="absolute top-0 left-0 w-0 h-px bg-[#CCFF00] transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
};
