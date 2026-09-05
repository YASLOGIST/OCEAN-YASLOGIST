import { useLang } from "../lib/i18n";

/* ═══════════════════ Engine 03 · Pharma Cold-Chain Monitor ═══════════════════
   A temperature trace across the voyage read against the 2–8°C pharma band.
   Most of the run sits inside the band; one reading breaks above it and is
   flagged the moment it starts — the point this card exists to make. The panel
   observes a reading that travels with the shipment reference; it does not
   operate a cold store. Points are deterministic and the motion budget is a
   single pulsing dot, so nothing here depends on a live feed (the panel's
   ModelBadge says as much).

   NOTE: the file keeps its original name/export (FulfillmentBay) so the
   Pillars import is untouched; the warehouse floor-plan it used to render was
   removed — YASLOGIST observes cold-chain data, it does not run a fulfilment bay.
──────────────────────────────────────────────────────────────────────────── */

const TEMPS = [5, 5.5, 4.8, 6, 5.2, 6.6, 5.8, 7, 10.8, 9.3, 6.2, 5, 5.4, 5.7];
const X0 = 12;
const X1 = 308;
const Y0 = 14;
const Y1 = 106;
const TMAX = 12;

const ty = (t: number) => Y1 - (t / TMAX) * (Y1 - Y0);
const tx = (i: number) => X0 + (i / (TEMPS.length - 1)) * (X1 - X0);

const yHi = ty(8);
const yLo = ty(2);
const points = TEMPS.map((t, i) => `${tx(i).toFixed(1)},${ty(t).toFixed(1)}`).join(" ");
const exIdx = TEMPS.indexOf(Math.max(...TEMPS));

export default function FulfillmentBay() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.2.notes.${k}`);
  const exX = tx(exIdx);
  const exY = ty(TEMPS[exIdx]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em]">
        <span className="text-ice" dir="ltr" style={{ unicodeBidi: "isolate" }}>{n("head")}</span>
        <span className="text-ghost/80">{n("logged")}</span>
      </div>

      <div className="card-inset relative overflow-hidden rounded-xl p-3">
        <svg
          viewBox="0 0 320 120"
          className="w-full"
          role="img"
          aria-label="Container temperature across the voyage against the 2 to 8 degree pharma band, with one excursion flagged"
        >
          {/* safe band 2–8°C */}
          <rect
            x={X0}
            y={yHi}
            width={X1 - X0}
            height={yLo - yHi}
            fill="rgba(52,211,153,0.10)"
            stroke="rgba(52,211,153,0.35)"
            strokeDasharray="3 3"
          />
          <text x={X1} y={yHi - 3} textAnchor="end" fontSize="8" fontFamily="monospace" fill="rgba(148,163,184,0.9)">
            {n("hi")}
          </text>
          <text x={X1} y={yLo + 10} textAnchor="end" fontSize="8" fontFamily="monospace" fill="rgba(148,163,184,0.9)">
            {n("lo")}
          </text>

          {/* excursion guide + reading */}
          <line x1={exX} y1={Y0} x2={exX} y2={Y1} stroke="rgba(251,113,133,0.35)" strokeWidth="1" strokeDasharray="2 2" />
          <polyline points={points} fill="none" stroke="var(--c-neon)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={exX} cy={exY} r="3.4" fill="#fb7185" />
        </svg>

        <span className="absolute right-3 top-2 inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-rose-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
          </span>
          {n("excursion")}
        </span>
        <span className="absolute bottom-2 left-3 font-mono text-[8px] uppercase tracking-[0.16em] text-emerald-300/80">
          {n("band")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { k: n("rangeK"), v: n("rangeV") },
          { k: n("intervalK"), v: n("intervalV") },
          { k: n("statusK"), v: n("statusV") },
        ].map((r) => (
          <div key={r.k} className="rounded-lg border border-chrome/5 bg-chrome/[0.03] px-2.5 py-2 text-center">
            <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-ghost/70">{r.k}</div>
            <div className="tabular mt-1 font-mono text-[11px] text-ice" dir="ltr" style={{ unicodeBidi: "isolate" }}>
              {r.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
