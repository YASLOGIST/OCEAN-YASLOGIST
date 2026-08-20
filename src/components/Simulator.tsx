import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLang } from "../lib/i18n";
import { svgTextProps } from "../lib/svgText";
import { cn } from "../utils/cn";
import { GlassCard, Reveal, SectionTag } from "./ui";

/* ── Real-time math engine ──────────────────────────────────────────────
   Baselines (IMO DCS-calibrated, conservative):
   · CO₂  = 31.5 g per TEU per nautical mile  →  AI uplift cuts 18%
   · Speed ≈ 17.5 kn  →  weather routing + port sync saves ~7% + 12h
   · Freight+op cost ≈ $0.42 per TEU·NM  →  AI optimisation saves 6%
────────────────────────────────────────────────────────────────────────── */

const CO2_G_PER_TEU_NM = 31.5;
const AI_CO2_CUT = 0.18;
const AVG_SPEED_KN = 17.5;
const AI_TIME_GAIN = 0.07;
const PORT_SYNC_HRS = 12;
const COST_PER_TEU_NM = 0.42;
const AI_COST_GAIN = 0.06;
const FUEL_PER_CO2 = 1 / 3.15;

/* ── Counterfactual profile ─────────────────────────────────────────────
   A second operating point for the SAME formulas above: a corridor weighted
   for transit time rather than carbon. Nothing above this block is re-tuned —
   the committed route's figures are untouched, and this only ever renders as a
   comparison beside them.

   HONESTY: unlike the baselines above (IMO DCS-calibrated), these three
   coefficients are INVENTED to express a plausible trade — buy days, pay in
   burn. They are surfaced in the UI as a "modelled scenario" for exactly that
   reason and must not be presented as calibrated. If real corridor data ever
   arrives, replace these three numbers and delete this note.                */
const ALT_TIME_GAIN = 0.13; // vs AI_TIME_GAIN 0.07 — faster
const ALT_CO2_CUT = 0.09; // vs AI_CO2_CUT 0.18 — dirtier
const ALT_COST_GAIN = 0.04; // vs AI_COST_GAIN 0.06 — less reclaimed

/* Returns the eased display value AND whether it is still converging. The
   settling flag is what lets the UI show that a number is being *recomputed*
   rather than merely being different — the causal link between moving a slider
   and the engine responding. The arithmetic is untouched. */
function useAnimatedNumber(target: number, duration = 700): [number, boolean] {
  const [display, setDisplay] = useState(target);
  const [settling, setSettling] = useState(false);
  const rafRef = useRef(0);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    /* Clearing here matters: dragging away and back to the previous value before
       the ease completes lands on this branch with `settling` still true, and
       without the reset the card would advertise "computing" forever. */
    if (from === target) {
      setSettling(false);
      return;
    }
    setSettling(true);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * e;
      setDisplay(v);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else {
        fromRef.current = target;
        setSettling(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return [display, settling];
}

const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
const fmtMoney = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(0)}K` : `$${v.toFixed(0)}`);

const TEU_VALUES = [5000, 40000, 120000, 240000, 500000];
const NM_VALUES = [1500, 5700, 9900, 12000];

function SliderRow({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label className="stat-key">{label}</label>
        <div className="text-end">
          <span className="tabular font-display text-2xl font-bold tracking-tight text-ice" dir="ltr" style={{ unicodeBidi: "isolate" }}>
            {fmtInt(value)}
          </span>
          <span className="ms-1.5 font-mono text-[10px] text-neon">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        dir="ltr"
        className="oq-range mt-3"
        style={{ "--fill": `${pct}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={label}
      />
      <div className="tabular mt-1 flex justify-between font-mono text-[8px] text-ghost/50" dir="ltr">
        <span>{fmtInt(min)}</span>
        <span>{fmtInt(max)}</span>
      </div>
    </div>
  );
}

/* Preset chips. One row per axis, keyboard-operable, active state carries the
   accent so the current scenario is never ambiguous. */
function PresetRow({
  heading,
  labels,
  values,
  active,
  onPick,
}: {
  heading: string;
  labels: string[];
  values: number[];
  active: number;
  onPick: (v: number) => void;
}) {
  return (
    <div>
      <p className="stat-key mb-2">{heading}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <button
            key={v}
            onClick={() => onPick(v)}
            aria-pressed={active === v}
            className={cn("preset-chip", active === v && "preset-chip-on")}
          >
            {labels[i] ?? String(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* The headline figure. One number carries the card; everything else supports it.
   `computing` drives a brief luminance lift while the value converges — the
   number visibly *responds* instead of merely being different next frame. */
function HeroMetric({ label, value, unit, computing }: { label: string; value: string; unit: string; computing: boolean }) {
  return (
    <div className={cn("hero-metric", computing && "is-computing")}>
      <div className="stat-key">{label}</div>
      <div className="hero-metric-val tabular" dir="ltr" style={{ unicodeBidi: "isolate" }}>
        {value}
      </div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neon/70">{unit}</div>
    </div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  unit,
  computing,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  computing: boolean;
}) {
  return (
    <div className={cn("metric-tile", computing && "is-computing")}>
      <span className="metric-icon">{icon}</span>
      <div className="metric-tile-val tabular">{value}</div>
      <div className="stat-key mt-1">{label}</div>
      <div className="mt-0.5 font-mono text-[8px] text-neon/70">{unit}</div>
    </div>
  );
}

function RouteMap({ computing }: { computing: boolean }) {
  const { t, dir } = useLang();
  const rtl = dir === "rtl";
  const origin = svgTextProps("center", rtl, 1);
  const dest = svgTextProps("center", rtl, 1);

  return (
    <svg viewBox="0 0 400 230" className={cn("route-map w-full", computing && "is-computing")}>
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22e4ff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <pattern id="routeGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="230" fill="url(#routeGrid)" />
      <ellipse cx="200" cy="230" rx="260" ry="60" fill="color-mix(in srgb, var(--c-neon) 6%, transparent)" />

      {/* route arc */}
      <path d="M40 190 Q 200 40 360 70" fill="none" stroke="url(#routeGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="640" className="animate-dash" />
      <path d="M40 190 Q 200 40 360 70" fill="none" stroke="url(#routeGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.1" />

      {/* origin */}
      <circle cx="40" cy="190" r="6" fill="#22e4ff" className="glow-dot" />
      <circle cx="40" cy="190" r="11" fill="none" stroke="#22e4ff" strokeOpacity="0.5" className="animate-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <text x="40" y="215" fill="var(--c-muted)" fontSize="10" textAnchor={origin.textAnchor} style={origin.style}>
        {t("sim.origin")}
      </text>

      {/* destination */}
      <circle cx="360" cy="70" r="6" fill="#a78bfa" />
      <circle cx="360" cy="70" r="11" fill="none" stroke="#a78bfa" strokeOpacity="0.5" className="animate-ping" style={{ animationDelay: "0.8s", transformBox: "fill-box", transformOrigin: "center" }} />
      <text x="360" y="46" fill="var(--c-muted)" fontSize="10" textAnchor={dest.textAnchor} style={dest.style}>
        {t("sim.dest")}
      </text>

      {/* vessel under way */}
      <g className="animate-floaty" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M200 85 l-7 -6 v-4 h14 v4 z" fill="#fff" />
        <rect x="192" y="72" width="16" height="4" rx="1" fill="#22e4ff" opacity="0.85" />
      </g>
      <circle cx="200" cy="85" r="14" fill="none" stroke="#22e4ff" strokeOpacity="0.35" className="animate-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
    </svg>
  );
}

export default function Simulator() {
  const { t, ta, lang } = useLang();
  const [teu, setTeu] = useState(120000);
  const [nm, setNm] = useState(5700);

  /* ── live math ── */
  const baselineCo2 = (teu * nm * CO2_G_PER_TEU_NM) / 1_000_000; // tonnes
  const co2Saved = baselineCo2 * AI_CO2_CUT;
  const fuelSaved = co2Saved * FUEL_PER_CO2;
  const baseHours = nm / AVG_SPEED_KN;
  const hoursSaved = baseHours * AI_TIME_GAIN + PORT_SYNC_HRS;
  const costSaved = teu * nm * COST_PER_TEU_NM * AI_COST_GAIN;
  const greenScore = Math.min(99, Math.round(60 + (teu / 500000) * 20 + (nm / 12000) * 20));
  const optEtaHrs = baseHours - hoursSaved;
  const etaDays = Math.floor(optEtaHrs / 24);
  const etaHrs = Math.round(optEtaHrs % 24);

  /* ── animated outputs ── */
  const [aCo2, sCo2] = useAnimatedNumber(co2Saved);
  const [aFuel, sFuel] = useAnimatedNumber(fuelSaved);
  const [aHours, sHours] = useAnimatedNumber(hoursSaved);
  const [aCost, sCost] = useAnimatedNumber(costSaved);
  const [aScore] = useAnimatedNumber(greenScore, 500);

  /* True while any output is still converging on its new value. Drives the
     "recomputing" affordance across the card so a slider drag visibly
     propagates to the readouts and the route. */
  const computing = sCo2 || sFuel || sHours || sCost;

  /* ── Counterfactual: the same formulas at the speed-priority operating point.
     Pure, derived from the identical (teu, nm) inputs, and never fed back into
     the committed figures above — this only produces the deltas shown in the
     comparison strip. */
  const altHoursSaved = baseHours * ALT_TIME_GAIN + PORT_SYNC_HRS;
  const altCo2Saved = baselineCo2 * ALT_CO2_CUT;
  const altCostSaved = teu * nm * COST_PER_TEU_NM * ALT_COST_GAIN;

  /* Signed against the committed route: hours gained, carbon given back, money
     forgone. All three are positive in the intended trade. */
  const cfHours = altHoursSaved - hoursSaved;
  const cfCo2 = co2Saved - altCo2Saved;
  const cfCost = costSaved - altCostSaved;

  /* English abbreviates tight ("1d 11h"); Arabic units are words, not letter
     suffixes, so they need the space ("1 يوم 11 س"). */
  const u = lang === "ar" ? " " : "";
  const dur = (d: number, h: number) =>
    d > 0
      ? `${fmtInt(d)}${u}${t("sim.day")} ${fmtInt(h)}${u}${t("sim.hour")}`
      : `${fmtInt(h)}${u}${t("sim.hour")}`;

  const timeText = dur(Math.floor(aHours / 24), Math.round(aHours % 24));
  const etaText = dur(etaDays, etaHrs);

  return (
    <section id="simulator" className="section-iso cv-auto section-pad relative scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal>
            <SectionTag>{t("sim.tag")}</SectionTag>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h2-display mt-6 font-display text-ice">
              {t("sim.title1")} <span className="text-accent-grad text-glow">{t("sim.title2")}</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="sub-text mx-auto mt-5">{t("sim.sub")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* controls + results */}
          <div className="lg:col-span-7">
            <Reveal from="up">
              <GlassCard strong className="card-pad relative overflow-hidden">
                <div className="relative space-y-8">
                  <SliderRow label={t("sim.teuLabel")} unit={t("sim.teuUnit")} min={1000} max={500000} step={1000} value={teu} onChange={setTeu} />
                  <SliderRow label={t("sim.nmLabel")} unit={t("sim.nmUnit")} min={1000} max={12000} step={50} value={nm} onChange={setNm} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <PresetRow heading={t("sim.presetsTeu")} labels={ta("sim.teuPresets")} values={TEU_VALUES} active={teu} onPick={setTeu} />
                    <PresetRow heading={t("sim.presetsNm")} labels={ta("sim.nmPresets")} values={NM_VALUES} active={nm} onPick={setNm} />
                  </div>

                  {/* results — one headline figure, three supporting */}
                  <div>
                    <p className={cn("live-eyebrow mb-3", computing && "is-computing")}>
                      <span className="live-dot" />
                      {t("sim.outputs")}
                    </p>

                    <HeroMetric label={t("sim.cost")} value={fmtMoney(aCost)} unit={t("sim.costUnit")} computing={sCost} />

                    <div className="mt-3 grid grid-cols-3 gap-3 max-[360px]:grid-cols-1">
                      <MetricTile
                        icon={
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.5 19a4.5 4.5 0 1 0-1.3-8.8 6 6 0 1 0-9.8 5.6" />
                            <path d="M7 16h13" />
                          </svg>
                        }
                        label={t("sim.co2")}
                        value={fmtInt(aCo2)}
                        unit={t("sim.co2Unit")}
                        computing={sCo2}
                      />
                      <MetricTile
                        icon={
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3.5 2" />
                          </svg>
                        }
                        label={t("sim.time")}
                        value={timeText}
                        unit={t("sim.reroute")}
                        computing={sHours}
                      />
                      <MetricTile
                        icon={
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3 5 9v12h14V9l-7-6Z" />
                            <path d="M9 15h6" />
                          </svg>
                        }
                        label={t("sim.fuel")}
                        value={fmtInt(aFuel)}
                        unit={t("sim.fuelUnit")}
                        computing={sFuel}
                      />
                    </div>
                  </div>

                  {/* Counterfactual. States what the SAME engine returns at a
                      different corridor weighting, so the committed route reads
                      as a decision with a cost rather than a single number.
                      Deltas are direction-coded: the gain in green, what it is
                      paid for in amber. */}
                  <div className="cf-strip">
                    <p className="cf-head">
                      <span className="cf-swap" aria-hidden>
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 4 3 8l4 4" />
                          <path d="M3 8h13" />
                          <path d="m17 20 4-4-4-4" />
                          <path d="M21 16H8" />
                        </svg>
                      </span>
                      {t("sim.cfTitle")}
                    </p>

                    <div className="cf-row">
                      {[
                        /* Same duration formatter as the committed metric, so a
                           sub-day gain reads as hours instead of rounding to a
                           misleading whole day. */
                        { v: `+${dur(Math.floor(cfHours / 24), Math.round(cfHours % 24))}`, k: t("sim.cfTime"), good: true },
                        /* Bare tonnes, NOT `sim.co2Unit` — that unit reads
                           "avoided", which is the opposite of what this delta is. */
                        { v: `+${fmtInt(cfCo2)} ${t("sim.cfTonne")}`, k: t("sim.cfCo2"), good: false },
                        { v: `−${fmtMoney(cfCost)}`, k: t("sim.cfCost"), good: false },
                      ].map((d) => (
                        <div key={d.k} className="cf-cell">
                          <span className={cn("cf-val tabular", d.good ? "cf-val-good" : "cf-val-cost")} dir="ltr" style={{ unicodeBidi: "isolate" }}>
                            {d.v}
                          </span>
                          <span className="cf-key">{d.k}</span>
                        </div>
                      ))}
                    </div>

                    <p className="cf-note">{t("sim.cfNote")}</p>
                  </div>

                  {/* Provenance for the numbers above. Framed as capability —
                      the engine is real and simulated data is what it is being
                      fed here — rather than as a disclaimer of weakness. */}
                  <p className="sim-demo-note">
                    <span className="sim-demo-dot" aria-hidden />
                    {t("sim.demoNote")}
                  </p>

                  <p className="card-footnote">{t("sim.note")}</p>
                </div>
              </GlassCard>
            </Reveal>
          </div>

          {/* route visualization */}
          <div className="lg:col-span-5">
            <Reveal from="up" delay={150}>
              <GlassCard strong className="card-pad relative flex h-full flex-col overflow-hidden">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">{t("sim.eta")}</p>
                  <span className="live-eyebrow live-eyebrow-ok">
                    <span className="live-dot live-dot-ok" />
                    {t("hero.telemetry.live")}
                  </span>
                </div>

                <RouteMap computing={computing} />

                {/* Fixed 3-row template per cell so row height is identical in every
                    language; numerals pinned dir="ltr" with tabular figures so digits
                    neither reorder nor re-measure when the document flips to RTL. */}
                <div className="mt-4 grid grid-cols-3 gap-3 max-[360px]:grid-cols-1">
                  {[
                    { label: t("sim.nmLabel"), value: fmtInt(nm), unit: t("sim.nmUnit"), hero: false },
                    { label: t("sim.eta"), value: etaText, unit: t("sim.reroute"), hero: true },
                    { label: t("sim.esg"), value: String(Math.round(aScore)), unit: "", hero: false },
                  ].map((c, i) => (
                    <div key={c.label} className="stat-tile grid grid-rows-[auto_1.75rem_auto]">
                      <div className="stat-key">{c.label}</div>
                      <div
                        className={cn("stat-val tabular self-center", c.hero ? "stat-val-hero" : "text-ice")}
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        {c.value}
                      </div>
                      {i === 2 ? (
                        <div className="mt-1.5 h-1 self-end overflow-hidden rounded-full bg-chrome/10">
                          <div className="grad-bar h-full rounded-full" style={{ width: `${aScore}%` }} />
                        </div>
                      ) : (
                        <div className="font-mono text-[8px] leading-relaxed text-neon/70">{c.unit}</div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="card-footnote mt-4">{t("sim.note")}</p>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
