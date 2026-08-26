import { motion } from "framer-motion";
import { ArrowUpRight, Hexagon } from "lucide-react";
import { CATEGORIES, buyUrl } from "../data/domains";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden" data-testid="site-footer">
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-[#CCFF00]/[0.05] blur-[140px] pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono2 text-xs tracking-[0.3em] uppercase text-white/40 mb-6">
            Final Call
          </p>
          <h2 className="font-display font-black uppercase tracking-tighter leading-[0.95] text-4xl sm:text-5xl lg:text-7xl max-w-5xl">
            The namespace is <span className="text-[#CCFF00]">finite.</span>
            <br />
            Hesitation is <span className="text-outline">forever.</span>
          </h2>
          <a
            href={buyUrl(CATEGORIES[0].domains[0].slug)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-cta-button"
            className="btn-acid mt-12 inline-flex items-center gap-3 bg-[#CCFF00] text-[#050505] font-mono2 text-sm tracking-[0.15em] uppercase px-8 py-4"
          >
            Start with .transfermoney
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </a>
        </motion.div>

        <div className="mt-24 md:mt-32">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black uppercase tracking-tighter text-outline text-[16vw] leading-none text-center select-none whitespace-nowrap"
              data-testid="footer-brand-text"
            >
              AIWEBTOOLS
            </motion.div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Hexagon className="w-4 h-4 text-[#CCFF00]" strokeWidth={1.5} />
              <span className="font-mono2 text-xs tracking-[0.25em] uppercase text-white/60" data-testid="footer-presented-by">
                Presented by AIWEBTOOLS.AI
              </span>
            </div>
            <p className="font-mono2 text-[11px] tracking-[0.15em] uppercase text-white/30">
              All purchases secured via Freename.io — Polygon & Solana
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
