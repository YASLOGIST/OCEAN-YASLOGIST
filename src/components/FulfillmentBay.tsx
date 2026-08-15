import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";

/* ═══════════════════ Engine 03 · Autonomous Fulfillment Bay 07 ═══════════════════
   A top-down floor plan read left→right: INBOUND dock → storage racks → pick
   stations → OUTBOUND. Autonomous units run the aisles carrying totes; each
   drops its tote at a pick station and continues empty, so the motion states
   what is actually happening rather than decorating.

   Motion budget: every animated element is transform/opacity only. Each runner
   is a full-width track child translated 0→100%, so one compositor transform
   moves a unit the whole length of its aisle — no layout, no paint. The whole
   bay is paused by an IntersectionObserver when off-screen and by
   prefers-reduced-motion, which resolves to a composed static frame.
─────────────────────────────────────────────────────────────────────────────── */

const AISLES = [
  { top: "26%", dur: 11, delay: 0 },
  { top: "52%", dur: 13, delay: 2.6 },
  { top: "78%", dur: 12, delay: 5.1 },
] as const;

/* Rack slots: `true` = occupied bin. Fixed pattern, not random, so the bay
   looks like inventory rather than noise and never re-renders differently. */
const RACK_ROWS = [
  [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
] as const;

function Rack({ top, cells }: { top: string; cells: readonly number[] }) {
  return (
    <div className="pointer-events-none absolute flex gap-[3px]" style={{ top, insetInlineStart: "15%", width: "46%" }}>
      {cells.map((c, i) => (
        <span
          key={i}
          className={cn(
            "h-3 flex-1 rounded-[2px] border",
            c
              ? "border-cyan-400/45 bg-cyan-400/20 shadow-[0_0_6px_rgba(34,211,238,0.35)]"
              : "border-chrome/12 bg-chrome/[0.04]"
          )}
        />
      ))}
    </div>
  );
}

export default function FulfillmentBay() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.2.notes.${k}`);
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  /* Zero CPU when the bay is not on screen. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={hostRef}
        className={cn("bay card-inset relative h-56 overflow-hidden rounded-xl", live && "bay-live")}
        role="img"
        aria-label={
          "Top-down view of an autonomous fulfillment bay: units carry totes from the inbound dock " +
          "along three storage aisles to pick stations, then continue to outbound."
        }
      >
        {/* floor grid */}
        <div className="bay-floor pointer-events-none absolute inset-0" aria-hidden />

        {/* ── INBOUND dock ── */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-[11%] border-e border-cyan-400/25 bg-cyan-400/[0.05]" aria-hidden>
          <span className="bay-edge-label absolute start-1.5 top-2">{n("inbound")}</span>
          {["22%", "48%", "74%"].map((top) => (
            <span key={top} className="absolute inset-x-2 h-2.5 rounded-[2px] border border-cyan-400/40 bg-cyan-400/15" style={{ top }} />
          ))}
        </div>

        {/* ── storage racks ── */}
        {RACK_ROWS.map((cells, i) => (
          <Rack key={i} top={`${16 + i * 26}%`} cells={cells} />
        ))}

        {/* ── aisles: runners carrying totes ── */}
        {AISLES.map((a, i) => (
          <div key={i} className="pointer-events-none absolute" style={{ top: a.top, insetInlineStart: "11%", width: "78%" }} aria-hidden>
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/12" />
            <div
              className="bay-runner"
              style={{ animationDuration: `${a.dur}s`, animationDelay: `${a.delay}s` }}
            >
              <span className="bay-agv">
                <span className="bay-tote" style={{ animationDuration: `${a.dur}s`, animationDelay: `${a.delay}s` }} />
              </span>
            </div>
          </div>
        ))}

        {/* ── pick stations, pulsing as a unit arrives ── */}
        {AISLES.map((a, i) => (
          <span
            key={i}
            className="bay-pick"
            style={{ top: `calc(${a.top} - 10px)`, animationDuration: `${a.dur}s`, animationDelay: `${a.delay}s` }}
            aria-hidden
          />
        ))}

        {/* ── OUTBOUND dock ── */}
        <div className="pointer-events-none absolute inset-y-0 end-0 w-[9%] border-s border-emerald-400/30 bg-emerald-400/[0.06]" aria-hidden>
          <span className="bay-edge-label absolute end-1.5 top-2 text-emerald-300/80">{n("outbound")}</span>
        </div>

        {/* ── charge dock ── */}
        <div className="pointer-events-none absolute bottom-2 start-[13%] flex items-center gap-1.5" aria-hidden>
          <span className="bay-charge" />
          <span className="bay-edge-label">{n("charge")}</span>
        </div>

        {/* legend — makes state unambiguous */}
        <div className="pointer-events-none absolute end-[11%] bottom-2 flex items-center gap-3" aria-hidden>
          <span className="bay-key"><i className="bay-key-dot bg-cyan-300" />{n("laden")}</span>
          <span className="bay-key"><i className="bay-key-dot bg-chrome/40" />{n("empty")}</span>
        </div>

        <span className="pointer-events-none absolute start-[13%] top-2 font-mono text-[9px] uppercase tracking-[0.22em] text-neon" aria-hidden>
          {n("sort")}
        </span>
      </div>

      {/* Process ribbon. The floor plan shows the mechanism; this states the
          sequence in words, so an outsider reads the card without having to
          decode the animation. Connectors are ::after pseudo-elements, so four
          steps cost four nodes rather than seven. */}
      <ol className="bay-flow" aria-label="Inbound to storage to pick to outbound">
        {[n("inbound"), n("zoneStorage"), n("zonePick"), n("outbound")].map((s, i) => (
          <li key={s} className={cn("bay-flow-step", i === 3 && "bay-flow-step-end")}>
            {s}
          </li>
        ))}
      </ol>

      {/* Metric band — throughput is the figure this bay exists to produce, so
          it dominates; the two reliability figures qualify it. */}
      <div className="mt-4 space-y-3">
        <div className="hero-metric hero-metric-compact">
          <div className="stat-key">{n("throughput")}</div>
          <div className="hero-metric-val tabular" dir="ltr" style={{ unicodeBidi: "isolate" }}>
            12,480
            <span className="hero-metric-unit">{n("perHr")}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { k: n("pick"), v: "99.98", s: n("pct") },
            { k: n("downtime"), v: "0.02", s: n("pct") },
          ].map((r) => (
            <div key={r.k} className="stat-tile">
              <div className="stat-key">{r.k}</div>
              <div className="stat-val tabular text-ice" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {r.v}
                <span className="ms-1 font-mono text-[9px] text-ghost">{r.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
