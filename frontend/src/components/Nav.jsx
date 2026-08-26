import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Menu, X } from "lucide-react";

const NAV_LINKS = [
  ["Learn", "#how-it-works"],
  ["Transfer", "#chapter-01"],
  ["AI", "#chapter-02"],
  ["Robotics", "#chapter-03"],
  ["World", "#chapter-04"],
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10"
      data-testid="site-nav"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
        <a
          href="https://aiwebtools.app"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="nav-logo"
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
          title="AIWEBTOOLS.AI — visit aiwebtools.app for free AI tools"
        >
          <Hexagon className="w-5 h-5 text-[#CCFF00] animate-spin-slow shrink-0" strokeWidth={1.5} />
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-mono2 text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] uppercase text-white/90 group-hover:text-[#CCFF00] transition-colors whitespace-nowrap">
              AIWEBTOOLS.AI
            </span>
            <span className="hidden sm:block font-mono2 text-[9px] tracking-[0.3em] uppercase text-white/35 mt-1">
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
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-testid={`nav-link-${label.toLowerCase()}`}
              className="font-mono2 text-xs tracking-[0.2em] uppercase text-white/50 hover:text-[#CCFF00] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="https://aiwebtools.app"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-link-free-ai-tools"
            className="font-mono2 text-xs tracking-[0.2em] uppercase text-[#CCFF00]/80 hover:text-[#CCFF00] transition-colors border border-[#CCFF00]/30 hover:border-[#CCFF00]/60 px-3 py-1.5"
          >
            Free AI Tools ↗
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://freename.com/home?ref=olive-ears-obey"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-make-tld-button"
            className="hidden lg:inline-flex border border-[#CCFF00]/40 text-[#CCFF00] hover:bg-[#CCFF00]/10 font-mono2 text-xs tracking-[0.15em] uppercase px-4 py-2.5 transition-colors whitespace-nowrap"
          >
            Make Your Own TLD
          </a>
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
            className="btn-acid bg-[#CCFF00] text-[#050505] font-mono2 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase px-3 sm:px-5 py-2.5 whitespace-nowrap"
          >
            Freename
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden p-2 text-white/70 hover:text-[#CCFF00] transition-colors"
          >
            {open ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#050505]/95"
            data-testid="nav-mobile-menu"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV_LINKS.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  data-testid={`nav-mobile-link-${label.toLowerCase()}`}
                  className="font-mono2 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-[#CCFF00] transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="https://aiwebtools.app"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-mobile-link-free-ai-tools"
                className="font-mono2 text-xs tracking-[0.2em] uppercase text-[#CCFF00] hover:text-white transition-colors"
              >
                Free AI Tools ↗
              </a>
              <a
                href="https://freename.com/home?ref=olive-ears-obey"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-mobile-link-make-tld"
                className="font-mono2 text-xs tracking-[0.2em] uppercase text-[#CCFF00] hover:text-white transition-colors"
              >
                Make Your Own TLD ↗
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
