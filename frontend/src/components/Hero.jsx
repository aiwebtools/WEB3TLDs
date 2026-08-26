import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Zap } from "lucide-react";

const Line = ({ children, delay, className = "" }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  </div>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1714548529197-537c1f0b6aa7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxkYXJrJTIwZnV0dXJpc3RpYyUyMGFic3RyYWN0JTIwbmV0d29ya3xlbnwwfHx8fDE3ODc3MDc1MDl8MA&ixlib=rb-4.1.0&q=85"
          className="w-full h-[130%] object-cover opacity-40"
          data-testid="hero-background-video"
        >
          <source src="/videos/hero-stock.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#CCFF00]/[0.07] blur-[140px] orb-float-1" />
        <div className="absolute bottom-0 right-1/5 w-[450px] h-[450px] rounded-full bg-[#CCFF00]/[0.05] blur-[120px] orb-float-2" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[100px] orb-float-3" />
      </motion.div>

      <motion.div style={{ y: yText, opacity }} className="max-w-[1600px] mx-auto w-full px-6 md:px-12 pb-16 md:pb-24 pt-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <Zap className="w-4 h-4 text-[#CCFF00]" strokeWidth={1.5} />
          <span className="font-mono2 text-xs md:text-sm tracking-[0.3em] uppercase text-[#CCFF00]" data-testid="hero-eyebrow">
            15 Premium Web3 TLDs — For Sale Now
          </span>
        </motion.div>

        <h1 className="font-display font-black uppercase tracking-tighter leading-[0.95] text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]" data-testid="hero-title">
          <Line delay={0.15}>Own the</Line>
          <Line delay={0.3}>
            <span className="text-outline-acid">Names</span> of the
          </Line>
          <Line delay={0.45}>
            New <span className="text-[#CCFF00]">Internet</span>
          </Line>
        </h1>

        <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-md text-base md:text-lg text-white/60 font-light leading-relaxed"
            data-testid="hero-subtitle"
          >
            Fifteen top-level domains across money transfer, AI, robotics and global trade.
            Minted on Polygon and Solana. One click takes you straight to checkout on Freename.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#chapter-01"
              data-testid="hero-cta-button"
              className="btn-acid inline-flex items-center gap-3 bg-[#CCFF00] text-[#050505] font-mono2 text-sm tracking-[0.15em] uppercase px-8 py-4 w-fit"
            >
              Browse Domains
              <ArrowDownRight className="w-4 h-4" strokeWidth={2} />
            </a>
            <a
              href="https://freename.com/home?ref=olive-ears-obey"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-make-tld-button"
              className="inline-flex items-center gap-3 border border-[#CCFF00]/40 text-[#CCFF00] hover:bg-[#CCFF00]/10 font-mono2 text-sm tracking-[0.15em] uppercase px-8 py-4 w-fit transition-colors"
            >
              Make Your Own TLD
              <ArrowDownRight className="w-4 h-4 -rotate-90" strokeWidth={2} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-px bg-white/15 mt-14"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-5 flex flex-wrap gap-x-10 gap-y-2 font-mono2 text-xs tracking-[0.2em] uppercase text-white/40"
          data-testid="hero-stats"
        >
          <span>15 TLDs</span>
          <span>2 Chains</span>
          <span>4 Categories</span>
          <span className="text-[#CCFF00]/80">Freename Certified</span>
        </motion.div>
      </motion.div>
    </section>
  );
};
