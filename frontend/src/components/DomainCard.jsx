import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { buyUrl } from "../data/domains";

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-testid={`domain-card-${domain.slug}`}
      className="card-glow group relative flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 p-7 min-h-[280px]"
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

      <p className="mt-5 text-sm text-white/50 font-light leading-relaxed flex-1">
        {domain.pitch}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4">
        <ChainBadge chain={chain} />
        <a
          href={buyUrl(domain.slug)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`buy-button-${domain.slug}`}
          className="btn-acid inline-flex items-center gap-2 bg-[#CCFF00] text-[#050505] font-mono2 text-[11px] tracking-[0.15em] uppercase px-4 py-2.5"
        >
          Buy Now
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
        </a>
      </div>

      <span className="absolute top-0 left-0 w-0 h-px bg-[#CCFF00] transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
};
