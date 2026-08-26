import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DomainCard } from "./DomainCard";
import { CATEGORY_IMAGES } from "../data/domains";

export const CategorySection = ({ category, chainFilter, prices }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const image = CATEGORY_IMAGES[category.id];

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
      ref={sectionRef}
      data-testid={`category-section-${category.id}`}
      className="relative py-24 md:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#CCFF00]/[0.03] blur-[120px] pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-end mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
              data-testid={`chapter-image-${category.id}`}
            >
              <div className="absolute -inset-4 bg-[#CCFF00]/[0.06] blur-2xl pointer-events-none" />
              <div className="relative overflow-hidden border border-white/10 aspect-[4/3]">
                <motion.img
                  src={image.url}
                  alt={image.alt}
                  style={{ y: imgY }}
                  className="w-full h-[124%] object-cover opacity-80 saturate-[0.6] contrast-125"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono2 text-[10px] tracking-[0.3em] uppercase text-[#CCFF00]">
                  CH.{category.id} — {category.title}
                </span>
                <span className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#CCFF00]/60" />
                <span className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#CCFF00]/60" />
              </div>
            </motion.div>
          )}
        </div>

        <div className={`grid ${cols} gap-6`}>
          {visible.map((domain, i) => (
            <DomainCard key={domain.slug} domain={domain} index={i} defaultChain={category.chain} prices={prices} />
          ))}
        </div>
      </div>
    </section>
  );
};
