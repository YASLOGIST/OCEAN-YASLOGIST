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

  /* Hash targets can drift when the browser resolves an anchor against
     content-visibility placeholders before the real section heights are known.
     Materialize the target and all preceding lazy sections for one layout pass,
     then re-scroll once their intrinsic sizes have been learned. */
  useEffect(() => {
    const settleHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      const materialized = Array.from(document.querySelectorAll<HTMLElement>(".cv-auto")).filter(
        (el) => el === target || Boolean(el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING),
      );
      materialized.forEach((el) => el.style.setProperty("content-visibility", "visible", "important"));

      // Give the browser two layout frames with real content, then persist each
      // measured height as the section's intrinsic placeholder before restoring
      // content-visibility. That keeps the target's document offset stable.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          materialized.forEach((el) => {
            const height = Math.ceil(el.getBoundingClientRect().height);
            if (height > 0) el.style.setProperty("--cv-h", `${height}px`);
          });
          materialized.forEach((el) => el.style.removeProperty("content-visibility"));
          const alignTarget = () => {
            const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
            window.scrollTo(0, Math.max(0, top));
          };
          alignTarget();
          requestAnimationFrame(alignTarget);
        });
      });
    };

    settleHash();
    window.addEventListener("hashchange", settleHash);
    return () => window.removeEventListener("hashchange", settleHash);
  }, []);

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
      ".sim-command-deck",
      ".engine-panel",
      ".handoff-chapter",
      ".handoff-console",
      ".founder-connect-console",
    ].join(",");
    const panels = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const lite = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nearby = new Set<Element>();
    const syncPanel = (panel: Element) => {
      const visible = nearby.has(panel) && !document.hidden;
      panel.classList.toggle("showcase-active", visible);
      panel.querySelectorAll<SVGSVGElement>("svg").forEach((svg) => {
        if (typeof svg.pauseAnimations !== "function") return;
        // CSS animation rules do not stop SVG animateMotion timelines.
        if (visible && !lite.matches && !reduced.matches) svg.unpauseAnimations();
        else svg.pauseAnimations();
      });
    };
    const syncAll = () => panels.forEach(syncPanel);
    let observer: IntersectionObserver | undefined;
    if (!("IntersectionObserver" in window)) {
      panels.forEach((panel) => nearby.add(panel));
    } else {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) nearby.add(entry.target);
          else nearby.delete(entry.target);
          syncPanel(entry.target);
        }),
        { rootMargin: "22% 0px", threshold: 0.01 },
      );
      panels.forEach((panel) => observer!.observe(panel));
    }
    syncAll();
    lite.addEventListener("change", syncAll);
    reduced.addEventListener("change", syncAll);
    document.addEventListener("visibilitychange", syncAll);
    return () => {
      observer?.disconnect();
      lite.removeEventListener("change", syncAll);
      reduced.removeEventListener("change", syncAll);
      document.removeEventListener("visibilitychange", syncAll);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = [
      ".vessel-console",
      ".founder-signature-card",
      ".eta-console",
      ".sim-command-deck",
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
            <CrossModalHandoff />
            <Closing />
          </main>
          <Footer />
        </div>
      </LangProvider>
    </ThemeProvider>
  );
}
