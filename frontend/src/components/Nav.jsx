import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

export const Nav = () => {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10"
      data-testid="site-nav"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-3 group">
          <Hexagon className="w-5 h-5 text-[#CCFF00] animate-spin-slow" strokeWidth={1.5} />
          <span className="flex flex-col leading-none">
            <span className="font-mono2 text-sm tracking-[0.25em] uppercase text-white/90 group-hover:text-[#CCFF00] transition-colors">
              AIWEBTOOLS.AI
            </span>
            <span className="font-mono2 text-[9px] tracking-[0.3em] uppercase text-white/35 mt-1">
              Premium Web3 TLDs
            </span>
          </span>
        </a>
        <div className="hidden lg:flex items-center gap-2 font-mono2 text-[10px] tracking-[0.25em] uppercase text-white/40" data-testid="nav-live-pill">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]" />
          </span>
          15 Names Live — Pay Once, Own Forever
        </div>
        <nav className="hidden md:flex items-center gap-10">
          {[
            ["Learn", "#how-it-works"],
            ["Transfer", "#chapter-01"],
            ["AI", "#chapter-02"],
            ["Robotics", "#chapter-03"],
            ["World", "#chapter-04"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-testid={`nav-link-${label.toLowerCase()}`}
              className="font-mono2 text-xs tracking-[0.2em] uppercase text-white/50 hover:text-[#CCFF00] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#chapter-01"
            data-testid="nav-browse-button"
            className="hidden sm:inline-flex border border-white/20 text-white/70 hover:text-[#CCFF00] hover:border-[#CCFF00]/50 font-mono2 text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-colors"
          >
            Browse Names
          </a>
          <a
            href="https://freename.io?ref=olive-ears-obey"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-freename-button"
            className="btn-acid bg-[#CCFF00] text-[#050505] font-mono2 text-xs tracking-[0.15em] uppercase px-5 py-2.5"
          >
            Freename
          </a>
        </div>
      </div>
    </motion.header>
  );
};
