import { useLang } from "../lib/i18n";
import { svgNumProps } from "../lib/svgText";

/* ═══════════════════════ Fleet radar (Engine 02 · IoT Fleet) ═══════════════════════
   A PPI-style radar scope. The sweep is one rotating conic gradient (a single
   GPU transform), and each contact's flash is phase-locked to its own bearing,
   so a blip ignites exactly as the beam crosses it and then decays — the way a
   real persistence display behaves. Everything animates on transform/opacity
   only; no layout, no paint, no JS per frame.

   The scope is north-up in every language: a bearing of 090 must sit east of
   centre whether the page reads left-to-right or right-to-left, so the compass
   labels are pinned LTR while the surrounding readouts localise normally.
──────────────────────────────────────────────────────────────────────────────── */

const SWEEP_SECONDS = 4;

/* bearing = degrees clockwise from north; range = 0..1 of scope radius */
const CONTACTS = [
  { id: "IQ-4271", bearing: 38, range: 0.55, tone: "neon" },
  { id: "IQ-3188", bearing: 142, range: 0.78, tone: "sky" },
  { id: "IQ-5094", bearing: 214, range: 0.42, tone: "emerald" },
  { id: "IQ-7730", bearing: 300, range: 0.68, tone: "neon" },
] as const;

const TONE: Record<string, { dot: string; glow: string }> = {
  neon: { dot: "#22e4ff", glow: "rgba(34,228,255,0.95)" },
  sky: { dot: "#38bdf8", glow: "rgba(56,189,248,0.95)" },
  emerald: { dot: "#34d399", glow: "rgba(52,211,153,0.95)" },
};

/* Polar → cartesian in a 0..100 box, north-up. */
function place(bearing: number, range: number) {
  const rad = ((bearing - 90) * Math.PI) / 180;
  return { x: 50 + Math.cos(rad) * range * 46, y: 50 + Math.sin(rad) * range * 46 };
}

/* Corner readout. The value is always latin-digit and LTR — a range or a sweep
   period must not reorder under RTL — while the label follows the document. */
function Readout({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`radar-readout pointer-events-none absolute ${className ?? ""}`}>
      <div className="radar-readout-key">{label}</div>
      <div className="radar-readout-val" dir="ltr" style={{ unicodeBidi: "isolate" }}>
        {value}
      </div>
    </div>
  );
}

export default function FleetRadar() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.1.notes.${k}`);
  const bearing = svgNumProps("center");

  return (
    <div className="radar-scope card-inset relative h-64 overflow-hidden rounded-xl">
      {/* range grid, spokes, bearing ticks */}
      <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <defs>
          <radialGradient id="radarFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--c-neon)" stopOpacity="0.16" />
            <stop offset="60%" stopColor="var(--c-neon)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--c-neon)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="46" fill="url(#radarFloor)" />

        {[46, 34.5, 23, 11.5].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--c-neon)" strokeOpacity="0.22" strokeWidth="0.3" />
        ))}

        {/* spokes every 30°, longer ticks on the cardinals */}
        {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const cardinal = deg % 90 === 0;
          const inner = cardinal ? 0 : 40;
          return (
            <line
              key={deg}
              x1={50 + Math.cos(rad) * inner}
              y1={50 + Math.sin(rad) * inner}
              x2={50 + Math.cos(rad) * 46}
              y2={50 + Math.sin(rad) * 46}
              stroke="var(--c-neon)"
              strokeOpacity={cardinal ? 0.18 : 0.28}
              strokeWidth={cardinal ? 0.25 : 0.4}
            />
          );
        })}

        {/* fine bearing ticks every 7.5° */}
        {Array.from({ length: 48 }, (_, i) => i * 7.5).map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={50 + Math.cos(rad) * 43.5}
              y1={50 + Math.sin(rad) * 43.5}
              x2={50 + Math.cos(rad) * 46}
              y2={50 + Math.sin(rad) * 46}
              stroke="var(--c-neon)"
              strokeOpacity="0.3"
              strokeWidth="0.25"
            />
          );
        })}

        {/* centre reticle */}
        <circle cx="50" cy="50" r="1.1" fill="var(--c-neon)" />
        <circle cx="50" cy="50" r="3" fill="none" stroke="var(--c-neon)" strokeOpacity="0.5" strokeWidth="0.25" />

        {["000", "090", "180", "270"].map((lbl, i) => {
          const rad = ((i * 90 - 90) * Math.PI) / 180;
          return (
            <text
              key={lbl}
              x={50 + Math.cos(rad) * 40}
              y={50 + Math.sin(rad) * 40 + 1.2}
              fill="var(--c-muted)"
              fontSize="3"
              textAnchor={bearing.textAnchor}
              style={bearing.style}
            >
              {lbl}
            </text>
          );
        })}
      </svg>

      {/* sweep — one rotating conic gradient, GPU transform only */}
      <div
        className="radar-sweep absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ animationDuration: `${SWEEP_SECONDS}s` }}
        aria-hidden
      />

      {/* contacts — each phase-locked to its own bearing */}
      {CONTACTS.map((c) => {
        const { x, y } = place(c.bearing, c.range);
        const tone = TONE[c.tone];
        /* the beam reaches this bearing at this fraction of the revolution */
        const delay = `${(-(c.bearing / 360) * SWEEP_SECONDS).toFixed(2)}s`;
        return (
          <div
            key={c.id}
            className="pointer-events-none absolute"
            style={{
              left: `calc(50% + ${((x - 50) / 100) * 15}rem)`,
              top: `calc(50% + ${((y - 50) / 100) * 15}rem)`,
            }}
            aria-hidden
          >
            <span
              className="radar-trail absolute rounded-full"
              style={{ background: tone.glow, animationDuration: `${SWEEP_SECONDS}s`, animationDelay: delay }}
            />
            <span
              className="radar-blip absolute rounded-full"
              style={{
                background: tone.dot,
                boxShadow: `0 0 8px ${tone.glow}, 0 0 16px ${tone.glow}`,
                animationDuration: `${SWEEP_SECONDS}s`,
                animationDelay: delay,
              }}
            />
          </div>
        );
      })}

      {/* micro-telemetry — logical inset so it mirrors cleanly with the document */}
      <Readout label={n("sector")} value={n("sectorV")} className="start-3 top-3" />
      <Readout label={n("range")} value={n("rangeV")} className="end-3 top-3 text-end" />
      <Readout label={n("contacts")} value={String(CONTACTS.length)} className="start-3 bottom-3" />
      <Readout label={n("sweep")} value={`${SWEEP_SECONDS}.0 s`} className="end-3 bottom-3 text-end" />

      {/* corner brackets */}
      <span className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l border-t border-neon/40" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r border-t border-neon/40" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-neon/40" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-neon/40" />
    </div>
  );
}
