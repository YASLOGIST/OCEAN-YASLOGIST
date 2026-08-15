import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";

/* ═══════════════ Engine 04 · Low-Carbon Voyage Profile ═══════════════
   Comprehension first. One shared baseline, one direction of "good" (shorter =
   cleaner, stated once), direct labels on every bar so there is no legend to
   cross-reference, and a single headline figure that carries the story. No
   gridlines, no axis furniture, no chart junk.
──────────────────────────────────────────────────────────────────── */

const BARS = [
  { key: "fuel", pct: 61, tone: "from-cyan-400 to-emerald-400" },
  { key: "shore", pct: 100, tone: "from-emerald-400 to-emerald-300" },
  { key: "eco", pct: 76, tone: "from-cyan-400 to-emerald-400" },
] as const;

export default function VoyageProfile() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.3.notes.${k}`);

  return (
    <div>
      {/* headline — the one number that matters, with its direction spelled out */}
      <div className="flex items-baseline gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-4">
        <div className="tabular font-display text-4xl font-bold leading-none text-emerald-400">
          −42<span className="text-xl">%</span>
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-emerald-300/90">
            {n("co2")}
          </div>
          <div className="mt-1 text-[11px] leading-snug text-ghost">{n("since")}</div>
        </div>
      </div>

      {/* three drivers — directly labelled, shared baseline, value at the end */}
      <div className="mt-5 space-y-4">
        {BARS.map((b) => (
          <div key={b.key}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] leading-snug text-ice/85">{n(b.key)}</span>
              <span className="tabular shrink-0 font-mono text-[12px] text-emerald-300" dir="ltr">
                {b.key === "eco" ? n("ecoV") : `${b.pct}%`}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-chrome/10">
              <div
                className={cn("voyage-bar h-full rounded-full bg-gradient-to-r", b.tone)}
                style={{ width: `${b.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 flex items-center gap-2 border-t border-chrome/10 pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-emerald-400/90">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 22c4-3 7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 3 8 7 11Z" />
          <path d="M9.5 11.5c1 1.5 4 1.5 5-1.5" />
        </svg>
        {n("offset")}
      </p>
    </div>
  );
}
