import { motion } from "framer-motion";
import { Send, Wallet, Globe, PlugZap, UserCheck, Tag } from "lucide-react";

const UTILITIES = [
  {
    icon: Send,
    title: "Send money",
    text: "Friends and clients pay mike.cashtransfer instead of a 42-character wallet code.",
  },
  {
    icon: Wallet,
    title: "Receive money",
    text: "Works with major Web3 wallets as your universal payment name. One name, every coin.",
  },
  {
    icon: Globe,
    title: "Your website",
    text: "Point it at any site, store or landing page. It is a real address people can type.",
  },
  {
    icon: PlugZap,
    title: "Plug into apps",
    text: "Use it as your login, profile or deposit handle inside Web3 apps, games and platforms.",
  },
  {
    icon: UserCheck,
    title: "Digital identity",
    text: "One recognizable name across wallets, socials and storefronts. You are easy to find.",
  },
  {
    icon: Tag,
    title: "Sell it anytime",
    text: "It is an asset you fully own. Keep it, gift it, or resell it on the marketplace.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      data-testid="how-it-works-section"
      className="relative py-24 md:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="absolute -top-20 left-1/3 w-[500px] h-[400px] rounded-full bg-[#CCFF00]/[0.04] blur-[140px] pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <p className="font-mono2 text-sm tracking-[0.3em] uppercase text-[#CCFF00]">Start Here</p>
          <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl mt-4 max-w-4xl" data-testid="how-it-works-title">
            What exactly are you buying?
          </h2>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 md:p-12 flex flex-col justify-center"
            data-testid="ownership-explainer"
          >
            <span className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#CCFF00]/60" />
            <p className="font-mono2 text-[11px] tracking-[0.25em] uppercase text-white/40">
              The simple version
            </p>
            <div className="mt-6 font-mono2 text-2xl md:text-4xl font-medium leading-snug">
              <span className="text-[#CCFF00]">mike</span>
              <span className="text-white/40">.</span>
              <span className="text-white">cashtransfer</span>
            </div>
            <div className="mt-8 space-y-4 text-sm md:text-base text-white/55 font-light leading-relaxed">
              <p>
                <span className="text-white font-normal">We own the ending.</span> Names like
                .cashtransfer or .robotshop are top-level domains — ours, minted on Polygon and Solana.
              </p>
              <p>
                <span className="text-white font-normal">You buy the beginning.</span> Pick any name in
                front of the dot — your name, your brand, your idea. It becomes yours.
              </p>
              <p>
                <span className="text-[#CCFF00] font-normal">Pay once. Own it forever.</span> No yearly
                fees, no renewals, no landlord. It lives in your wallet like a collectible.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {UTILITIES.map((u, i) => (
              <motion.div
                key={u.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="card-glow group border border-white/10 bg-white/[0.02] backdrop-blur-md p-6"
                data-testid={`utility-card-${u.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <u.icon className="w-6 h-6 text-[#CCFF00]" strokeWidth={1.5} />
                <h3 className="font-mono2 text-sm font-medium text-white mt-4 uppercase tracking-[0.1em]">
                  {u.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 font-light leading-relaxed">{u.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex flex-wrap items-center gap-x-12 gap-y-4 border border-white/10 bg-white/[0.02] px-8 py-6"
          data-testid="how-it-works-steps"
        >
          {[
            ["01", "Pick your name in front of the dot"],
            ["02", "Buy once on Freename — own it forever"],
            ["03", "Use it for payments, sites, apps & identity"],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-4">
              <span className="font-mono2 text-sm text-[#CCFF00]">{num}</span>
              <span className="font-mono2 text-xs md:text-sm tracking-[0.1em] uppercase text-white/60">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
