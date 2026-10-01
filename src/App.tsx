import { useEffect } from "react";
import { startScrollLoop } from "./lib/scroll";
import { ThemeProvider } from "./lib/theme";
import { LangProvider } from "./lib/i18n";
import Background from "./components/Background";
import Hud from "./components/Hud";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Solutions from "./components/Solutions";
import Simulator from "./components/Simulator";
import Pillars from "./components/Pillars";
import Closing from "./components/Closing";
import CrossModalHandoff from "./components/CrossModalHandoff";
import Footer from "./components/Footer";

export default function App() {
  /* startScrollLoop returns its own disposer — cancels the rAF, the watchdog,
     the ResizeObserver and every listener, so a StrictMode remount or an HMR
     module swap cannot leave a second engine running. */
  useEffect(() => startScrollLoop(), []);

  /* Precision interaction layer for the ten showcase surfaces. It is attached
     only on fine pointers; touch devices keep the exact static composition and
     avoid continuous pointer work. Updates are rAF-throttled and write CSS
     custom properties only, so React never re-renders while the pointer moves. */
  /* Suspend decorative instrumentation when a showcase surface is well outside
     the viewport. This preserves the premium motion when it matters while
     avoiding continuous compositor work across ten off-screen panels. */
  useEffect(() => {
    const selector = [
      ".vessel-console",
      ".founder-signature-card",
      ".eta-console",
      ".engine-panel",
      ".handoff-console",
      ".founder-connect-console",
    ].join(",");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!("IntersectionObserver" in window)) {
      panels.forEach((panel) => panel.classList.add("showcase-active"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("showcase-active", entry.isIntersecting)),
      { rootMargin: "22% 0px", threshold: 0.01 },
    );
    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = [
      ".vessel-console",
      ".founder-signature-card",
      ".eta-console",
      ".engine-panel",
      ".handoff-console",
      ".founder-connect-console",
    ].join(",");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const cleanups: Array<() => void> = [];

    panels.forEach((panel) => {
      let raf = 0;
      let event: PointerEvent | null = null;
      const paint = () => {
        raf = 0;
        if (!event) return;
        const rect = panel.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        panel.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
        panel.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
        panel.style.setProperty("--tilt-x", `${((0.5 - y) * 0.9).toFixed(3)}deg`);
        panel.style.setProperty("--tilt-y", `${((x - 0.5) * 0.9).toFixed(3)}deg`);
      };
      const move = (e: PointerEvent) => {
        event = e;
        if (!raf) raf = requestAnimationFrame(paint);
      };
      const leave = () => {
        event = null;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        panel.style.setProperty("--pointer-x", "50%");
        panel.style.setProperty("--pointer-y", "24%");
        panel.style.setProperty("--tilt-x", "0deg");
        panel.style.setProperty("--tilt-y", "0deg");
      };

      panel.addEventListener("pointermove", move, { passive: true });
      panel.addEventListener("pointerleave", leave, { passive: true });
      cleanups.push(() => {
        if (raf) cancelAnimationFrame(raf);
        panel.removeEventListener("pointermove", move);
        panel.removeEventListener("pointerleave", leave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <ThemeProvider>
      <LangProvider>
        <div className="relative min-h-screen overflow-x-clip font-sans text-ice antialiased">
          <Background />
          <Navbar />
          <Hud />
          <main className="relative z-10">
            <Hero />
            <Stats />
            <Solutions />
            <Simulator />
            <Pillars />
          </main>
          <CrossModalHandoff />
          <Closing />
          <Footer />
        </div>
      </LangProvider>
    </ThemeProvider>
  );
}
