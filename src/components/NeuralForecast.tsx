import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n";
import { svgNumProps, svgTextProps } from "../lib/svgText";
import { cn } from "../utils/cn";

/* ═══════════════ Engine 01 · Neural Route Forecast ═══════════════
   A real feed-forward topology: 4 input signals (demand, weather, port
   pressure, fuel) → 5 hidden units → 3 route candidates, with the committed
   route resolved at the output. Packets travel the actual edges, so the motion
   depicts inference rather than decorating.

   Reading order is made explicit for a first-time viewer:
     · each column is captioned (signals → model → candidates), so the topology
       does not have to be inferred from the shape;
     · the edges that actually feed the committed route are drawn a second time
       in the committed colour, so "which way did the decision go" is visible
       rather than implied;
     · the confidence figure sits ON the committed node as well as in the metric
       band beneath, tying the headline number to the thing it describes.

   Budget: edges are static SVG paths; only the packets animate, via SVG
   `<animateMotion>` bound to each edge — the browser drives these off the main
   thread and they stop dead when the root `<svg>` is paused. Off-screen the
   whole component is unmounted from animation by `.nf-live`, and
   prefers-reduced-motion resolves to a fully composed static frame.

   Geometry stays left-to-right in both languages. Signal flow is a directed
   graph, not prose — mirroring it would invert the meaning of every edge while
   the packets kept travelling their original paths. Only the TEXT is
   direction-aware, via `svgTextProps`.
─────────────────────────────────────────────────────────────────── */

const INPUTS = [
  { y: 26, key: "demand" },
  { y: 68, key: "weather" },
  { y: 110, key: "port" },
  { y: 152, key: "fuel" },
] as const;

const HIDDEN = [30, 66, 100, 134, 168] as const;
const OUTPUTS = [56, 100, 144] as const;

const IN_X = 62;
const HID_X = 220;
const OUT_X = 380;

/** Index of the route the model commits to. */
const WINNER = 1;

/* Deterministic edge set — a fixed, sparse topology reads as a real network;
   a fully-connected mesh reads as noise. */
const E1: Array<[number, number]> = [
  [0, 0], [0, 1], [0, 2],
  [1, 1], [1, 3],
  [2, 0], [2, 2], [2, 4],
  [3, 3], [3, 4],
];
const E2: Array<[number, number]> = [
  [0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2], [4, 2],
];

const edge = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};

/* Hidden units feeding the committed route, and the inputs feeding those —
   derived from the edge set rather than hand-listed, so the highlight can never
   drift out of sync with the topology it is highlighting. */
const WIN_HIDDEN = E2.filter(([, b]) => b === WINNER).map(([a]) => a);
const WIN_E1 = E1.filter(([, b]) => WIN_HIDDEN.includes(b));
const WIN_E2 = E2.filter(([, b]) => b === WINNER);

export default function NeuralForecast() {
  const { t, dir } = useLang();
  const rtl = dir === "rtl";
  const n = (k: string) => t(`pillars.0.notes.${k}`);
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: "120px 0px",
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Input labels sit left of their node; route labels sit right of theirs.
     Sides are geometric — the anchor that produces them flips with direction. */
  const inLabel = svgTextProps("right", rtl);
  const outLabel = svgTextProps("left", rtl);
  const cap = svgTextProps("center", rtl, 0.8);
  /* The confidence figure is a numeral, not prose: it must stay LTR in both
     languages AND keep a geometric anchor. Deriving it from `outLabel` and
     overriding `direction` would mix an RTL-resolved anchor with an LTR run,
     which places the text on the wrong side of its own x and drives it into the
     node it labels. `svgNumProps` resolves both together. */
  const confidence = svgNumProps("left", 0);

  return (
    <div>
      <div
        ref={hostRef}
        className={cn("nf card-inset relative overflow-hidden rounded-xl", live && "nf-live")}
        role="img"
        aria-label={
          "Neural route forecast: four live signals feed a model layer that scores three candidate " +
          "routes, and the highest-confidence route is committed."
        }
      >
        <span className="nf-badge" aria-hidden>
          <i className="glow-dot" />
          {n("chart")}
        </span>

        {/* Top gutter carries the column captions; both side gutters absorb the
            localized end labels, whose length varies by language. Measured worst
            cases are "Committed" reaching 441.7 in English and the input labels
            reaching 1.6 in Arabic — both would clip against a flush viewBox. */}
        <svg viewBox="-8 -22 460 218" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="nfEdge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22e4ff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#22e4ff" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="nfWinEdge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="nfWin" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── column captions ── */}
          {[
            { x: IN_X, label: n("layerIn") },
            { x: HID_X, label: n("layerHidden") },
            { x: OUT_X, label: n("layerOut") },
          ].map((c) => (
            <text key={c.x} x={c.x} y={-10} fill="var(--c-muted)" fontSize="7.5" textAnchor={cap.textAnchor} style={cap.style}>
              {c.label}
            </text>
          ))}

          {/* ── base edges ── */}
          <g fill="none" stroke="url(#nfEdge)" strokeWidth="1">
            {E1.map(([a, b], i) => (
              <path key={`a${i}`} id={`nfe-a${i}`} d={edge(IN_X, INPUTS[a].y, HID_X, HIDDEN[b])} />
            ))}
            {E2.map(([a, b], i) => (
              <path key={`b${i}`} id={`nfe-b${i}`} d={edge(HID_X, HIDDEN[a], OUT_X, OUTPUTS[b])} />
            ))}
          </g>

          {/* ── the committed path, drawn over the base set ── */}
          <g className="nf-win-path" fill="none" stroke="url(#nfWinEdge)" strokeWidth="1.5" strokeLinecap="round">
            {WIN_E1.map(([a, b], i) => (
              <path key={`wa${i}`} d={edge(IN_X, INPUTS[a].y, HID_X, HIDDEN[b])} />
            ))}
            {WIN_E2.map(([a, b], i) => (
              <path key={`wb${i}`} d={edge(HID_X, HIDDEN[a], OUT_X, OUTPUTS[b])} />
            ))}
          </g>

          {/* ── packets riding the real edges ── */}
          <g className="nf-packets">
            {E1.map((_, i) => (
              <circle key={`pa${i}`} r="2.1" fill="#67e8f9">
                <animateMotion dur={`${2.6 + (i % 4) * 0.45}s`} begin={`${i * 0.28}s`} repeatCount="indefinite">
                  <mpath href={`#nfe-a${i}`} />
                </animateMotion>
              </circle>
            ))}
            {E2.map((_, i) => (
              <circle key={`pb${i}`} r="2.1" fill="#a5f3fc">
                <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${0.6 + i * 0.3}s`} repeatCount="indefinite">
                  <mpath href={`#nfe-b${i}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          {/* ── input layer ── */}
          {INPUTS.map((p, i) => (
            <g key={p.key}>
              <circle cx={IN_X} cy={p.y} r="5" fill="#0b2c5e" stroke="#22e4ff" strokeOpacity="0.75" />
              <circle cx={IN_X} cy={p.y} r="2" fill="#22e4ff" />
              <text x={IN_X - 12} y={p.y + 3.5} fill="var(--c-muted)" fontSize="8.5" textAnchor={inLabel.textAnchor} style={inLabel.style}>
                {n(`in${i}`)}
              </text>
            </g>
          ))}

          {/* ── model layer; units on the committed path read brighter ── */}
          {HIDDEN.map((y, i) => {
            const onPath = WIN_HIDDEN.includes(i);
            return (
              <circle
                key={y}
                cx={HID_X}
                cy={y}
                r={onPath ? 7 : 6.5}
                fill="#08183a"
                stroke={onPath ? "#34d399" : "#38bdf8"}
                strokeOpacity={onPath ? 0.85 : 0.6}
                className="nf-node"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            );
          })}

          {/* ── output layer: three candidates, one committed ── */}
          {OUTPUTS.map((y, i) => {
            const win = i === WINNER;
            return (
              <g key={y}>
                {win && <circle cx={OUT_X} cy={y} r="17" fill="url(#nfWin)" className="nf-halo" />}
                <circle cx={OUT_X} cy={y} r="7" fill="#0b2c5e" stroke={win ? "#34d399" : "#7dd3fc"} strokeOpacity={win ? 1 : 0.5} strokeWidth={win ? 1.8 : 1} />
                {/* The committed route carries two stacked lines. The gap is
                    sized for Arabic, not Latin: Cairo's glyph box measures 16.04
                    units at 8.5px — nearly twice the Latin box — because of
                    diacritic ascenders, and a Latin-sized gap collides. */}
                <text x={OUT_X + 15} y={win ? y - 5 : y + 3.5} fill={win ? "#34d399" : "var(--c-muted)"} fontSize="8.5" textAnchor={outLabel.textAnchor} style={outLabel.style}>
                  {n(`rt${i}`)}
                </text>
                {/* Confidence pinned to the node it belongs to. Same value as the
                    metric band below — one number, stated where it is earned. */}
                {win && (
                  <text x={OUT_X + 15} y={y + 13} fill="#5eead4" fontSize="9.5" textAnchor={confidence.textAnchor} style={confidence.style}>
                    {n("accuracyV")}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metric band — one dominant figure, two supporting. */}
      <div className="mt-4 space-y-3">
        <div className="hero-metric hero-metric-compact">
          <div className="stat-key">{n("accuracy")}</div>
          <div className="hero-metric-val tabular" dir="ltr" style={{ unicodeBidi: "isolate" }}>
            {n("accuracyV")}
          </div>
          <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-neon/70">{n("legend")}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { k: n("horizon"), v: n("horizonV") },
            { k: n("empty"), v: n("emptyV") },
          ].map((r) => (
            <div key={r.k} className="stat-tile">
              <div className="stat-key">{r.k}</div>
              <div className="stat-val tabular text-ice" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {r.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
