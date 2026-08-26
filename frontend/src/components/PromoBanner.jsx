import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgePercent, Copy } from "lucide-react";
import { toast } from "sonner";
import { chime } from "../utils/celebrate";

export const PromoBanner = () => {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/promo`)
      .then((r) => r.json())
      .then((d) => d.code && setPromo(d))
      .catch(() => {});
  }, []);

  if (!promo) return null;

  const copyCode = async (e) => {
    chime();
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success(`Promo code ${promo.code} copied`, {
        description: "Paste it at Freename checkout",
      });
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = promo.code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        toast.success(`Promo code ${promo.code} copied`, {
          description: "Paste it at Freename checkout",
        });
      } catch {
        toast.error(`Code: ${promo.code} — long-press to copy`);
      }
    }
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 45,
      spread: 55,
      startVelocity: 25,
      origin: e && e.clientX != null
        ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
        : { x: 0.5, y: 0.2 },
      colors: ["#CCFF00", "#22d3ee", "#ffffff"],
      scalar: 0.8,
      ticks: 120,
      zIndex: 9999,
      disableForReducedMotion: true,
    });
  };

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 border-b border-[#CCFF00]/20 bg-[#CCFF00]/[0.05]"
      data-testid="promo-banner"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-2.5 flex items-center justify-center gap-3 flex-wrap text-center">
        <BadgePercent className="w-4 h-4 text-[#CCFF00] shrink-0" strokeWidth={1.5} />
        <span className="font-mono2 text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/60">
          {promo.title || "Freename Deal"}
        </span>
        <button
          onClick={copyCode}
          data-testid="promo-copy-button"
          title="Copy promo code"
          className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#050505] font-mono2 text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase px-3 py-1 hover:bg-white transition-colors"
        >
          {promo.code}
          <Copy className="w-3 h-3" strokeWidth={2} />
        </button>
        <span className="font-mono2 text-[10px] md:text-xs tracking-[0.1em] text-white/70" data-testid="promo-description">
          {promo.description}
        </span>
      </div>
    </motion.div>
  );
};
