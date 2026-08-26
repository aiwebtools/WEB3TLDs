import { motion } from "framer-motion";
import { DomainCard } from "./DomainCard";

export const CategorySection = ({ category, chainFilter }) => {
  const visible =
    chainFilter === "All"
      ? category.domains
      : category.domains.filter((d) => (d.chain || category.chain) === chainFilter);

  if (!visible.length) return null;

  const cols =
    visible.length >= 5
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : visible.length === 4
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        : visible.length === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2";

  return (
    <section
      id={`chapter-${category.id}`}
      data-testid={`category-section-${category.id}`}
      className="relative py-24 md:py-32 border-b border-white/10"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#CCFF00]/[0.03] blur-[120px] pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-baseline gap-6 flex-wrap">
            <span className="font-mono2 text-sm tracking-[0.3em] text-[#CCFF00]" data-testid={`chapter-number-${category.id}`}>
              {category.id} //
            </span>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl" data-testid={`chapter-title-${category.id}`}>
              {category.title}
            </h2>
            <span className="font-mono2 text-xs tracking-[0.2em] uppercase text-white/35">
              {category.kicker}
            </span>
          </div>
          <div className="mt-6 h-px bg-white/10 w-full" />
          <p className="mt-8 max-w-2xl text-base md:text-lg text-white/55 font-light leading-relaxed" data-testid={`chapter-manifesto-${category.id}`}>
            {category.manifesto}
          </p>
        </motion.div>

        <div className={`grid ${cols} gap-6`}>
          {visible.map((domain, i) => (
            <DomainCard key={domain.slug} domain={domain} index={i} defaultChain={category.chain} />
          ))}
        </div>
      </div>
    </section>
  );
};
