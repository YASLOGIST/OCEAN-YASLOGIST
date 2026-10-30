import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "../lib/scroll";
import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";
import GlobalClock from "./GlobalClock";

/* Observed for the active-section highlight. */
const SECTION_IDS = ["hero", "stats", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];

/* Dot nav. Must stay index-aligned with the `hud.dots` label array, which has
   no entry for `stats` — pairing it with SECTION_IDS shifted every label by one. */
const DOT_IDS = ["hero", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];

export default function Hud() {
  const { t, lang } = useLang();
  const sectionNavLabel = {
    en: "Page sections",
    ar: "أقسام الصفحة",
    zh: "页面章节",
    tr: "Sayfa bölümleri",
    fr: "Sections de la page",
  }[lang];
  const [active, setActive] = useState("hero");
  const flowRef = useRef<HTMLDivElement>(null);
  const flowLabelRef = useRef<HTMLSpanElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const botLeftRef = useRef<HTMLDivElement>(null);

  /* velocity + depth + top progress — direct DOM writes, no re-render */
  useEffect(
    () =>
      subscribeScroll((f) => {
        const v = Math.min(1, Math.abs(f.vel) * 0.5);
        if (flowRef.current) flowRef.current.style.width = `${(v * 100).toFixed(1)}%`;
        if (flowLabelRef.current) flowLabelRef.current.textContent = `×${(1 + v * 0.4).toFixed(2)}`;
        if (topBarRef.current) topBarRef.current.style.width = `${(f.progress * 100).toFixed(2)}%`;

        /* The corner readouts are ambient chrome for the hero video. They
           are fixed to the viewport, so anywhere past the hero they sit on top
           of section content and, at the end of the page, on the footer links.
           One fade curve retires the whole set as you enter content — measured
           collisions with the fleet table and the copyright line before this. */
        const vh = f.vh || window.innerHeight;
        const fade = Math.max(0, Math.min(1, 1 - (f.raw - vh * 0.25) / (vh * 0.55)));
        const o = fade.toFixed(3);
        if (topLeftRef.current) topLeftRef.current.style.opacity = o;
        if (topRightRef.current) topRightRef.current.style.opacity = o;
        if (botLeftRef.current) botLeftRef.current.style.opacity = o;
      }),
    []
  );

  /* active section for dot nav */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* top scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-chrome/10">
        <div
          ref={topBarRef}
          className="grad-bar h-full shadow-[0_0_12px_var(--glow)]"
          style={{ width: 0 }}
        />
      </div>

      {/* corner brackets */}
      <div className="pointer-events-none fixed inset-4 z-40 hidden lg:block">
        <div className="absolute left-0 top-0 h-9 w-9 border-l-2 border-t-2 border-neon/30" />
        <div className="absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-neon/30" />
        <div className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-neon/30" />
        <div className="absolute bottom-0 right-0 h-9 w-9 border-b-2 border-r-2 border-neon/30" />
      </div>

      {/* top-left telemetry. Desktop only: below `lg` the hero is a single
          column, so this fixed chrome sat on the hero copy — and the tag line
          repeated, word for word, the pill directly beneath it. */}
      <div ref={topLeftRef} className="hud-corner pointer-events-none fixed left-8 top-20 z-40 hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] lg:block">
        <p className="hud-accent">YASLOGIST OCEAN | DEMO</p>
        <p className="hud-dim">{t("hud.sys")}</p>
      </div>

      {/* top-right status and global logistics clock */}
      <div ref={topRightRef} className="hud-corner pointer-events-none fixed right-8 top-20 z-40 hidden text-end font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] lg:block">
        <GlobalClock className="flex justify-end gap-3.5 mb-2.5" />
        <p>{t("hud.utc")}</p>
        <p className="hud-dim">{t("hud.health")}</p>
      </div>

      {/* bottom-left: scroll velocity */}
      {/* Velocity readout. `.hud-flow` gates it on viewport width AND height
          (see index.css): it is fixed chrome drawn over the hero's copy column,
          and in Arabic the founder card grows three lines taller than it does
          in English — at 1024 × 768 that card's foot landed on this block. */}
      <div ref={botLeftRef} className="hud-corner hud-flow pointer-events-none fixed bottom-8 left-8 z-40 w-48">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em]">
          <span>{t("hud.flow")}</span>
          <span ref={flowLabelRef} className="hud-accent">
            ×1.00
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded bg-chrome/10">
          <div ref={flowRef} className="grad-bar h-full" style={{ width: 0 }} />
        </div>
        <p className="hud-dim mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em]">{t("hud.camNote")}</p>
      </div>

      {/* right dot navigation */}
      <nav aria-label={sectionNavLabel} className="hud-dot-rail hud-corner fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex 2xl:right-5">
        {DOT_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => jump(id)}
            className="group flex cursor-pointer items-center gap-3"
            aria-label={t(`hud.dots.${i}`)}
          >
            <span
              className={cn(
                "hud-dot-label hidden font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-300 2xl:block",
                active === id ? "translate-x-0 hud-accent opacity-100" : "translate-x-2 opacity-0"
              )}
            >
              {t(`hud.dots.${i}`)}
            </span>
            <span
              className={cn(
                "hud-dot block h-2.5 w-2.5 rounded-full border transition-all duration-300",
                active === id ? "glow-dot scale-125" : "bg-transparent"
              )}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
