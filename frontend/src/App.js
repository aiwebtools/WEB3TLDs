import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { CategorySection } from "./components/CategorySection";
import { Footer } from "./components/Footer";
import { CATEGORIES } from "./data/domains";

function App() {
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
      <Nav />
      <main>
        <Hero />
        <Marquee />
        {CATEGORIES.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default App;
