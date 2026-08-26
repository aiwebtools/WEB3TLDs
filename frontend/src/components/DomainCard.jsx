import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Copy, Globe, MessageCircle, PlugZap, Send, Share2, Store, Tag, Twitter, Wallet } from "lucide-react";
import { toast } from "sonner";
import { buyUrl, EXAMPLES, FROM_PRICES, UTILITIES } from "../data/domains";

const ICONS = { send: Send, wallet: Wallet, globe: Globe, plug: PlugZap, store: Store, tag: Tag };

const ChainBadge = ({ chain }) => {
  const isPolygon = chain === "Polygon";
  return (
    <span
      data-testid={`chain-badge-${chain.toLowerCase()}`}
      className={`font-mono2 text-[10px] tracking-[0.2em] uppercase px-3 py-1 border whitespace-nowrap ${
        isPolygon
          ? "border-purple-400/40 text-purple-300/90 bg-purple-400/[0.06]"
          : "border-emerald-400/40 text-emerald-300/90 bg-emerald-400/[0.06]"
      }`}
    >
      Minted on {chain}
    </span>
  );
};

export const DomainCard = ({ domain, index, defaultChain, prices }) => {
  const chain = domain.chain || defaultChain;
  const price = (prices && prices[domain.slug]) || FROM_PRICES[domain.slug];
  const url = buyUrl(domain.slug);
  const examples = EXAMPLES[domain.slug] || [];
  const utilities = UTILITIES[domain.slug] || [];

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(tiltY, { stiffness: 200, damping: 20 });

  const onTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const openBuy = () => window.open(url, "_blank", "noopener,noreferrer");

  const copyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Referral link copied", { description: url });
    } catch {
      toast.error("Copy failed — clipboard unavailable");
    }
  };

  const shareText = encodeURIComponent(
    `Claim your Web3 name on ${domain.name} — minted on ${chain}. Pay once, own it forever.`
  );
  const shareUrl = encodeURIComponent(url);
  const shareLinks = [
    { id: "x", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, hover: "hover:text-cyan-300 hover:border-cyan-300/50" },
    { id: "telegram", icon: Share2, href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`, hover: "hover:text-sky-400 hover:border-sky-400/50" },
    { id: "whatsapp", icon: MessageCircle, href: `https://wa.me/?text=${shareText}%20${shareUrl}`, hover: "hover:text-emerald-300 hover:border-emerald-300/50" },
  ];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onTilt}
      onMouseLeave={resetTilt}
      data-testid={`domain-card-${domain.slug}`}
      onClick={openBuy}
      onKeyDown={(e) => e.key === "Enter" && openBuy()}
      role="link"
      tabIndex={0}
      title={`Buy a name on ${domain.name} at Freename`}
      className="card-glow group relative flex flex-col bg-white/[0.02] backdrop-blur-md border border-white/10 overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#0A0A0A]">
        <img
          src={`/images/domains/${domain.slug}.png`}
          alt={`${domain.name} artwork`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.parentElement.style.display = "none";
          }}
          className="w-full h-full object-cover opacity-90 saturate-[0.85] transition-transform duration-700 ease-out group-hover:scale-105"
          data-testid={`domain-image-${domain.slug}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent pointer-events-none" />
        {domain.verified && (
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-[#050505]/80 backdrop-blur px-2.5 py-1 font-mono2 text-[10px] tracking-[0.15em] uppercase text-[#CCFF00]"
            data-testid={`verified-badge-${domain.slug}`}
          >
            <BadgeCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            Live
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-mono2 text-lg md:text-xl font-medium text-white break-all group-hover:text-[#CCFF00] transition-colors" data-testid={`domain-name-${domain.slug}`}>
            {domain.name}
          </h3>
          <ChainBadge chain={chain} />
        </div>

        {price && (
          <div className="mt-3 flex items-baseline gap-2" data-testid={`domain-price-${domain.slug}`}>
            <span className="font-mono2 text-[10px] tracking-[0.2em] uppercase text-white/35">From</span>
            <span className="font-mono2 text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-cyan-300">${price.toFixed(2)}</span>
            <span className="font-mono2 text-[10px] tracking-[0.15em] uppercase text-white/35">— once, forever · tap card to buy</span>
          </div>
        )}

        <p className="mt-4 text-[13px] text-white/45 font-light leading-relaxed">{domain.pitch}</p>

        <p className="mt-5 font-mono2 text-[10px] tracking-[0.25em] uppercase text-white/35">
          Your name could be
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5" data-testid={`domain-examples-${domain.slug}`}>
          {examples.map((ex) => (
            <span key={ex} className="font-mono2 text-[11px] text-white/65 border border-white/10 bg-white/[0.03] px-2 py-1">
              {ex}
            </span>
          ))}
        </div>

        <ul className="mt-5 space-y-2 flex-1" data-testid={`domain-utilities-${domain.slug}`}>
          {utilities.map(([icon, text]) => {
            const Icon = ICONS[icon];
            return (
              <li key={text} className="flex items-start gap-2.5 text-[13px] text-white/50 font-light leading-snug">
                <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#CCFF00]/80" strokeWidth={1.5} />
                {text}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" data-testid={`share-row-${domain.slug}`}>
            {shareLinks.map(({ id, icon: Icon, href, hover }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                data-testid={`share-${id}-${domain.slug}`}
                aria-label={`Share ${domain.name} on ${id}`}
                className={`p-2 border border-white/10 text-white/35 transition-colors ${hover}`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
          <button
            onClick={copyLink}
            data-testid={`copy-button-${domain.slug}`}
            aria-label={`Copy referral link for ${domain.name}`}
            className="p-2.5 border border-white/15 text-white/50 hover:text-fuchsia-400 hover:border-fuchsia-400/50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            data-testid={`buy-button-${domain.slug}`}
            className="btn-acid flex-1 inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#050505] font-mono2 text-[11px] tracking-[0.15em] uppercase px-4 py-3"
          >
            Buy on Freename
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </a>
        </div>
      </div>

      <span className="absolute top-0 left-0 w-0 h-px bg-[#CCFF00] transition-all duration-500 group-hover:w-full z-10" />
    </motion.article>
  );
};
