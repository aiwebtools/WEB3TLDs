import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data/domains";

const CHAIN_OF = {};
CATEGORIES.forEach((c) => c.domains.forEach((d) => (CHAIN_OF[d.slug] = d.chain || c.chain)));
const SLUGS = CATEGORIES.flatMap((c) => c.domains.map((d) => d.slug));

const fmt = (p) =>
  p == null ? null : `$${Number(p).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const ClaimYourName = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    const clean = name.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "").slice(0, 30);
    if (!clean) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/name-preview?name=${encodeURIComponent(clean)}`
        );
        const d = await r.json();
        setResults(d.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer.current);
  }, [name]);

  const display = results.length
    ? results
    : SLUGS.map((slug) => ({ slug, fqdn: `${name || "yourname"}.${slug}`, price: null, status: null, buyUrl: null }));

  return (
    <section
      id="claim"
      data-testid="claim-section"
      className="relative py-24 md:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/[0.05] blur-[130px] orb-float-2 pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono2 text-sm tracking-[0.3em] uppercase text-cyan-300">Try It Right Now</p>
          <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl mt-4" data-testid="claim-title">
            Type your name.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] via-cyan-300 to-fuchsia-400">
              See it come alive.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/55 font-light leading-relaxed">
            Enter your name or brand below and watch it appear across all 15 endings — with the real,
            live price to claim it. One of each exists. First come, first served.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-2xl"
        >
          <div className="claim-glow">
            <div className="relative bg-[#0A0A0A] border border-white/10 flex items-center">
              <Sparkles className="w-5 h-5 text-[#CCFF00] ml-5 shrink-0" strokeWidth={1.5} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="yourname"
                data-testid="claim-name-input"
                className="w-full bg-transparent outline-none px-5 py-5 font-mono2 text-xl md:text-2xl text-[#CCFF00] placeholder:text-white/25"
                maxLength={30}
                autoComplete="off"
                spellCheck={false}
              />
              {loading && <Loader2 className="w-5 h-5 text-white/40 animate-spin mr-5 shrink-0" strokeWidth={1.5} />}
            </div>
          </div>
          <AnimatePresence>
            {name && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 font-mono2 text-xs tracking-[0.2em] uppercase text-white/50"
                data-testid="claim-greeting"
              >
                Hey <span className="text-[#CCFF00]">{name.toLowerCase().replace(/[^a-z0-9-]/g, "")}</span> — these are yours for the taking. Tap any card to claim it.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" data-testid="claim-results">
          {display.map((r, i) => {
            const available = r.status === "AVAILABLE";
            const taken = r.status && r.status !== "AVAILABLE";
            const inner = (
              <>
                <div className="font-mono2 text-sm md:text-base break-all leading-snug">
                  <span className="text-[#CCFF00]">{r.fqdn.split(".")[0]}</span>
                  <span className="text-white/40">.</span>
                  <span className="text-white">{r.slug}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  {r.price != null ? (
                    <span className="font-mono2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-cyan-300" data-testid={`claim-price-${r.slug}`}>
                      {fmt(r.price)}
                    </span>
                  ) : taken ? (
                    <span className="font-mono2 text-xs text-fuchsia-400/80 uppercase tracking-widest">Taken</span>
                  ) : (
                    <span className="font-mono2 text-xs text-white/30 uppercase tracking-widest">
                      {r.status === null ? "· · ·" : "Check on Freename"}
                    </span>
                  )}
                  <ArrowUpRight className={`w-4 h-4 shrink-0 transition-all duration-300 ${r.buyUrl ? "text-[#CCFF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "text-white/20"}`} strokeWidth={2} />
                </div>
                <div className="mt-2 font-mono2 text-[9px] tracking-[0.2em] uppercase text-white/30">
                  Minted on {CHAIN_OF[r.slug]}
                  {available && <span className="text-[#CCFF00]/80"> — Available now</span>}
                </div>
              </>
            );
            return (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                {r.buyUrl ? (
                  <a
                    href={r.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`claim-card-${r.slug}`}
                    className="group block border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 transition-all duration-300 hover:border-[#CCFF00]/60 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(204,255,0,0.25)]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div data-testid={`claim-card-${r.slug}`} className="border border-white/[0.06] bg-white/[0.01] p-5 text-white/30">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
