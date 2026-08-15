import { useEffect, useRef, useState } from "react";
import { subscribeScroll } from "../lib/scroll";
import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";

/* Observed for the active-section highlight. */
const SECTION_IDS = ["hero", "stats", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];

/* Dot nav. Must stay index-aligned with the `hud.dots` label array, which has
   no entry for `stats` — pairing it with SECTION_IDS shifted every label by one. */
const DOT_IDS = ["hero", "solutions", "simulator", "p1", "p2", "p3", "p4", "p5", "connect"];

export default function Hud() {
  const { t } = useLang();
  const [active, setActive] = useState("hero");
  const flowRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const flowLabelRef = useRef<HTMLSpanElement>(null);
  const depthLabelRef = useRef<HTMLSpanElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const botLeftRef = useRef<HTMLDivElement>(null);
  const botRightRef = useRef<HTMLDivElement>(null);

  /* velocity + depth + top progress — direct DOM writes, no re-render */
  useEffect(
    () =>
      subscribeScroll((f) => {
        const v = Math.min(1, Math.abs(f.vel) * 0.5);
        if (flowRef.current) flowRef.current.style.width = `${(v * 100).toFixed(1)}%`;
        if (flowLabelRef.current) flowLabelRef.current.textContent = `×${(1 + v * 0.4).toFixed(2)}`;
        if (depthRef.current) depthRef.current.style.width = `${(f.progress * 100).toFixed(1)}%`;
        if (depthLabelRef.current) depthLabelRef.current.textContent = `${Math.round(f.progress * 100)}%`;
        if (topBarRef.current) topBarRef.current.style.width = `${(f.progress * 100).toFixed(2)}%`;

        /* All four corner readouts are ambient chrome for the hero video. They
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
        if (botRightRef.current) botRightRef.current.style.opacity = o;
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

      {/* top-left telemetry */}
      <div ref={topLeftRef} className="pointer-events-none fixed left-8 top-20 z-40 hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ghost md:block">
        <p className="text-neon/80">YASLOGIST CORE | CAIRO OPS</p>
        <p>{t("hero.tag")}</p>
        <p className="text-ice/40">{t("hud.sys")}</p>
      </div>

      {/* top-right status — the clock moved to the header (GlobalClock), so this
          block carries only fleet health, no duplicated timekeeping. */}
      <div ref={topRightRef} className="pointer-events-none fixed right-8 top-20 z-40 hidden text-end font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ghost md:block">
        <p>{t("hud.utc")}</p>
        <p className="text-ice/40">{t("hud.health")}</p>
      </div>

      {/* bottom-left: scroll velocity */}
      <div ref={botLeftRef} className="pointer-events-none fixed bottom-8 left-8 z-40 hidden w-48 md:block">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-ghost">
          <span>{t("hud.flow")}</span>
          <span ref={flowLabelRef} className="text-neon">
            ×1.00
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded bg-chrome/10">
          <div ref={flowRef} className="grad-bar h-full" style={{ width: 0 }} />
        </div>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-ice/40">{t("hud.camNote")}</p>
      </div>

      {/* bottom-right: depth */}
      <div ref={botRightRef} className="pointer-events-none fixed bottom-8 right-8 z-40 hidden w-48 text-end md:block">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-ghost">
          <span>{t("hud.depth")}</span>
          <span ref={depthLabelRef} className="text-neon">
            0%
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded bg-chrome/10">
          <div ref={depthRef} className="ms-auto h-full grad-bar" style={{ width: 0 }} />
        </div>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-ice/40">{t("hud.depthNote")}</p>
      </div>

      {/* right dot navigation */}
      <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
        {DOT_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => jump(id)}
            className="group flex cursor-pointer items-center gap-3"
            aria-label={t(`hud.dots.${i}`)}
          >
            <span
              className={cn(
                "font-mono text-[9px] uppercase tracking-[0.25em] text-ghost/70 transition-all duration-300 group-hover:text-neon",
                active === id ? "translate-x-0 text-neon opacity-100" : "translate-x-2 opacity-0"
              )}
            >
              {t(`hud.dots.${i}`)}
            </span>
            <span
              className={cn(
                "block h-2.5 w-2.5 rounded-full border transition-all duration-300",
                active === id
                  ? "glow-dot scale-125 border-neon bg-neon"
                  : "border-neon/40 bg-transparent group-hover:border-neon/80"
              )}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
