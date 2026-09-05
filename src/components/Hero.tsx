import { useEffect, useRef } from "react";
import { useLang } from "../lib/i18n";
import { subscribeScroll } from "../lib/scroll";
import { FounderAvatar } from "./Brand";
import { GlassCard, ModelBadge, NeonButton, Parallax, Reveal, SectionTag, ArrowRight } from "./ui";

/* ══════════════════ 2 · PLATFORM FOUNDER — authority through restraint ══════════════════
   Four rows and nothing else: portrait, role, name, discipline, and the
   commercial office that stands behind them. The prestige here comes from scale
   and negative space, not decoration. */
function FounderBadge() {
  const { t } = useLang();
  return (
    <div className="glass card-lift gpu flex max-w-md items-center gap-5 rounded-2xl p-5">
      <FounderAvatar initials="AY" className="h-16 w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="micro font-mono text-neon">{t("founder.lead")}</p>
        <p className="type-serif mt-2 text-lg font-bold leading-tight text-ice">{t("founder.name")}</p>
        <p className="mt-1.5 text-[12px] leading-snug text-ghost">{t("founder.title")}</p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neon/70">{t("founder.org")}</p>
      </div>
    </div>
  );
}

/* ══════════════════ 1 · VESSEL — instrument-grade telemetry ══════════════════
   Hierarchy is identifier → live state → primary metric → secondary readouts,
   on a strict 8pt rhythm. Every numeral is tabular so digits cannot jitter, and
   secondary labels are pushed into a quieter tier so the primary metric reads
   in well under a second. */
function VesselCard() {
  const { t, dir } = useLang();

  const readouts = [
    { k: t("hero.telemetry.heading"), v: "212°" },
    { k: t("hero.telemetry.draft"), v: dir === "rtl" ? "14.8 م" : "14.8 M" },
    { k: t("hero.telemetry.cargo"), v: "24,108" },
    { k: t("hero.telemetry.eta"), v: "14:32" },
  ];

  return (
    <GlassCard strong className="relative p-6 sm:p-8">
      {/* tier 1 — identifier + live state */}
      <header className="flex items-center justify-between gap-4 border-b border-chrome/10 pb-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-neon">
          {t("hero.telemetry.vessel")}
        </span>
        <span className="flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {t("hero.telemetry.live")}
        </span>
      </header>

      {/* The card carries a vessel identifier, a speed and an ETA, all of which
          read as a live AIS feed. It is a model; the badge says so beside them. */}
      <div className="mt-4 flex justify-start">
        <ModelBadge />
      </div>

      {/* tier 2 — the primary metric, highest contrast on the card */}
      <div className="mt-6 flex items-end justify-between gap-4 max-[360px]:flex-col max-[360px]:items-start max-[360px]:gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ghost/80">
            {t("hero.telemetry.speed")}
          </div>
          <div className="tabular mt-2 font-display text-[3.25rem] font-bold leading-none tracking-tight text-ice">
            18.6
            <span className="ms-2 align-baseline text-lg font-semibold text-neon">KN</span>
          </div>
        </div>
        <div className="shrink-0 text-end font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-ghost/70">
          <p>{t("hero.telemetry.flag")}</p>
          <p className="tabular text-ice/50">IMO · sample</p>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-chrome/10">
        <div className="animate-beam h-full w-full rounded-full bg-gradient-to-r from-cyan-300/80 to-blue-500/80" />
      </div>

      {/* tier 3 — secondary readouts, quieter. 2-up on narrow so nothing truncates. */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {readouts.map((r) => (
          <div key={r.k} className="rounded-lg border border-chrome/5 bg-chrome/[0.03] px-2 py-2.5 text-center">
            <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-ghost/70">{r.k}</div>
            <div className="tabular mt-1 font-mono text-[12px] text-ice">{r.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-neon/20 bg-neon/[0.05] p-4">
        <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ghost/80">
          <span>{t("hero.telemetry.route")}</span>
          <span className="shrink-0 text-neon">SHA → SUZ → PSD</span>
        </div>
        <div className="mt-3 h-1 rounded-full bg-chrome/10">
          <div className="grad-bar h-full w-[64%] rounded-full" />
        </div>
        <p className="mt-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-ice/45">
          {t("hero.telemetry.etaNote")}
        </p>
      </div>
    </GlassCard>
  );
}

/* ══════════════════ 4 · SCROLL CUE — collision-proof ══════════════════
   Sits on the section-content layer (never above cards), and retires on the
   first meaningful scroll rather than competing with content for space. Its
   own row is reserved by the section's padding, and it is suppressed entirely
   on short viewports where there is no room for it. */
function ScrollCue() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      subscribeScroll((f) => {
        const el = ref.current;
        if (!el) return;
        const vh = f.vh || window.innerHeight;
        /* fully gone within a quarter viewport of scrolling */
        const o = Math.max(0, 1 - f.raw / (vh * 0.25));
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      }),
    []
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-cue pointer-events-none absolute inset-x-0 bottom-6 z-[var(--z-section-content)] flex flex-col items-center gap-3"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-ghost">{t("hero.scroll")}</span>
      <div className="h-10 w-6 rounded-full border border-neon/40 p-1">
        <div className="animate-scrolldot mx-auto h-2 w-1 rounded-full bg-neon" />
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, ta, dir } = useLang();
  const badges = ta("hero.badges");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pb-36 pt-32"
    >
      <Parallax speed={0.22} className="w-full">
        <div className="relative z-[var(--z-section-content)] mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-10">
          {/* copy */}
          <div>
            <Reveal>
              <SectionTag>{t("hero.tag")}</SectionTag>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="h1-hero mt-6 text-ice">
                {t("hero.title1")}
                <br />
                <span className="text-accent-grad text-glow">{t("hero.title2")}</span>
              </h1>
            </Reveal>

            <Reveal delay={240}>
              <p className="sub-text mt-6">{t("hero.sub")}</p>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <NeonButton variant="primary" onClick={() => document.getElementById("p1")?.scrollIntoView({ behavior: "smooth" })}>
                  {t("hero.cta1")} <ArrowRight />
                </NeonButton>
                <NeonButton variant="ghost" onClick={() => document.getElementById("p2")?.scrollIntoView({ behavior: "smooth" })}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                  {t("hero.cta2")}
                </NeonButton>
              </div>
            </Reveal>

            <Reveal delay={480}>
              <div className="micro mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-ghost">
                {badges.map((b) => (
                  <span key={b} className="flex items-center gap-2.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
                      <span className="glow-dot relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
                    </span>
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={560}>
              <div className="mt-8">
                <FounderBadge />
              </div>
            </Reveal>
          </div>

          <Reveal from={dir === "rtl" ? "left" : "right"} delay={320}>
            <VesselCard />
          </Reveal>
        </div>
      </Parallax>

      <ScrollCue />
    </section>
  );
}
