import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Toaster } from "./components/ui/sonner";
import { Nav } from "./components/Nav";
import { PromoBanner } from "./components/PromoBanner";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { HowItWorks } from "./components/HowItWorks";
import { ClaimYourName } from "./components/ClaimYourName";
import { FilterBar } from "./components/FilterBar";
import { CategorySection } from "./components/CategorySection";
import { Footer } from "./components/Footer";
import { CATEGORIES } from "./data/domains";

const countMatches = (filter) =>
  CATEGORIES.reduce(
    (sum, c) =>
      sum + c.domains.filter((d) => filter === "All" || (d.chain || c.chain) === filter).length,
    0
  );

function App() {
  const [chainFilter, setChainFilter] = useState("All");
  const [prices, setPrices] = useState(null);
  const [examples, setExamples] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/prices`)
      .then((r) => r.json())
      .then((d) => {
        if (d.prices) setPrices(d.prices);
        if (d.examples) setExamples(d.examples);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a) {
        const el = document.querySelector(a.getAttribute("href"));
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -64 });
        }
      }
    };
    document.addEventListener("click", onAnchor);
    return () => {
      document.removeEventListener("click", onAnchor);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white min-h-screen" data-testid="app-root">
      <div className="noise-overlay" />
      <div className="aurora-bg" />
      <Nav />
      <main className="relative z-10">
        <PromoBanner />
        <Hero />
        <Marquee />
        <HowItWorks />
        <ClaimYourName examples={examples} />
        <FilterBar
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
          matchCount={countMatches(chainFilter)}
        />
        {CATEGORIES.map((category) => (
          <CategorySection key={category.id} category={category} chainFilter={chainFilter} prices={prices} />
        ))}
      </main>
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            border: "1px solid rgba(204,255,0,0.3)",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}

export default App;
