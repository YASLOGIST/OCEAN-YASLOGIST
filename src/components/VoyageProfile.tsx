import { useLang } from "../lib/i18n";

/* ═══════════════ Engine 04 · ACID & B/L Reference Reconciliation ═══════════════
   The references a shipment carries — booking, B/L, container, ACID, gate pass —
   stitched onto one record and cross-checked before the vessel sails. Four line
   up; the ACID filing is rejected, and it surfaces here at booking rather than
   at the gate. The customer or their licensed broker files the declaration; this
   panel only watches the references line up (its ModelBadge says so).

   NOTE: the file keeps its original name/export (VoyageProfile) so the Pillars
   import is untouched; the low-carbon voyage chart it used to render was removed
   — YASLOGIST is not a carrier and makes no emissions claim.
──────────────────────────────────────────────────────────────────────────── */

export default function VoyageProfile() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.3.notes.${k}`);

  const refs = [
    { label: n("ref0"), bad: false },
    { label: n("ref1"), bad: false },
    { label: n("ref2"), bad: false },
    { label: n("ref3"), bad: true },
    { label: n("ref4"), bad: false },
  ];

  return (
    <div>
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ice">{n("head")}</div>

      <div className="card-inset rounded-xl p-4">
        <ol className="relative space-y-2.5 border-s border-dashed border-neon/25 ps-4">
          {refs.map((r) => (
            <li
              key={r.label}
              className="relative flex items-center justify-between gap-3 rounded-lg border border-chrome/5 bg-chrome/[0.03] px-3 py-2"
            >
              <span
                className={
                  "absolute -start-[9px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-abyss " +
                  (r.bad ? "bg-rose-400" : "bg-emerald-400")
                }
              />
              <span className="min-w-0 font-mono text-[11px] text-ice/90">{r.label}</span>
              {r.bad ? (
                <span className="inline-flex max-w-[52%] items-center justify-end gap-1.5 text-end font-mono text-[8px] uppercase leading-snug tracking-[0.12em] text-rose-300">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  {n("flag")}
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-300/90">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {n("ok")}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-xl border border-neon/20 bg-neon/[0.05] px-4 py-3">
        <span className="tabular font-display text-3xl font-bold leading-none text-neon">{n("countV")}</span>
        <span className="font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-ghost">{n("countK")}</span>
      </div>

      <p className="mt-3 border-t border-chrome/10 pt-3 text-[11px] leading-relaxed text-ghost">{n("foot")}</p>
    </div>
  );
}
