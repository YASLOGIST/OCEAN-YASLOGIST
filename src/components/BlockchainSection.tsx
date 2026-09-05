import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";
import { GlassCard, ModelBadge } from "./ui";

/* ═══════════════════════ Engine 05 · Blockchain Smart Contracts ═══════════════════════
   Self-contained panel (own chrome, no cross-import from Pillars) so this file
   is the single source of truth for the Section-05 UI. Four ledger nodes with
   glowing cyan neon borders + dark cyan glass, joined by an animated
   data-transmission pulse; below, the auto-settling smart-contract steps.
──────────────────────────────────────────────────────────────────────────────────────── */

const CHAIN_HASHES = ["0x7F3A…E9", "0xB1C8…42", "0x9D04…A7", "0xE5F2…11"];

/* Crisp cube / block glyph. */
function BlockIcon({ bright }: { bright?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-6 w-6 transition-transform duration-500 group-hover:scale-110", bright && "drop-shadow-[0_0_6px_rgba(34,228,255,0.9)]")}
      fill="none"
      stroke={bright ? "#67e8f9" : "#22e4ff"}
      strokeWidth={1.9}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
      <path d="M12 22V12" />
      <path d="m3 7 9 5 9-5" />
    </svg>
  );
}

function Panel({ title, status, children }: { title: string; status: string; children: React.ReactNode }) {
  return (
    <GlassCard strong className="clip-angled card-pad relative overflow-hidden">
      <div className="card-head">
        <div className="card-head-title">{title}</div>
        <div className="live-eyebrow live-eyebrow-ok">
          <span className="live-dot live-dot-ok" />
          {status}
        </div>
      </div>
      {/* Ledger visuals settle no real transaction; say so on the panel. */}
      <ModelBadge />
      <div className="relative">{children}</div>
      <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t border-neon/30" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l border-neon/30" />
    </GlassCard>
  );
}

export default function BlockchainSection() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.4.notes.${k}`);
  const steps = [n("step1"), n("step2"), n("step3"), n("step4")];

  return (
    <Panel title={t("pillars.4.panel.title")} status={t("pillars.4.panel.status")}>
      {/* ── ledger nodes + animated transmission line ──
           Below 360px the four nodes cannot share one line at any legible size:
           they need 184px against the 158px the panel leaves at 320px, and the
           sizing steps that fixed 360px are already at their limit. Below that
           declared floor the chain becomes a 2 x 2 grid and the connectors are
           dropped — the line is decoration, the blocks and their hashes are the
           content, so this keeps everything and loses only the join. ≥360px is
           untouched. */}
      <div className="flex items-start pt-2 max-[360px]:grid max-[360px]:grid-cols-2 max-[360px]:justify-items-center max-[360px]:gap-y-4">
        {CHAIN_HASHES.map((h, i) => {
          const isFinal = i === CHAIN_HASHES.length - 1;
          return (
            <div key={h} className={cn("flex items-center", i > 0 && "flex-1")}>
              {i > 0 && (
                <div className="chain-link mx-1 mb-7 flex-1 sm:mx-2.5 max-[360px]:hidden" aria-hidden>
                  <span className="chain-pulse" style={{ animationDelay: `${(i - 1) * 0.5}s` }} />
                </div>
              )}
              <div className="group relative shrink-0">
                <div
                  className={cn(
                    /* Below `sm` the four nodes and their hashes are the row's
                       whole width budget: at 40px they total 184px against the
                       198px the panel leaves at a 360px viewport. At 56px they
                       needed 268px, so the row overflowed and pushed the final
                       node - and the VERIFIED chip hung off it - outside the
                       panel, where `overflow-hidden` clipped both. */
                    "grid h-10 w-10 place-items-center rounded-2xl border bg-cyan-950/30 backdrop-blur-sm transition-all duration-300 sm:h-16 sm:w-16",
                    "border-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.35)]",
                    "group-hover:-translate-y-1 group-hover:scale-[1.07] group-hover:border-cyan-300 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.65)]",
                    isFinal && "border-cyan-300/80 bg-cyan-900/40 shadow-[0_0_26px_rgba(34,211,238,0.55)]"
                  )}
                >
                  <BlockIcon bright={isFinal} />
                  <span
                    className={cn(
                      "absolute -bottom-1 -end-1 h-2.5 w-2.5 rounded-full border-2 border-abyss",
                      isFinal ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" : "bg-cyan-400/90 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    )}
                  />
                </div>
                {isFinal && (
                  <span className="absolute -end-2 -top-2 flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.15em] text-emerald-400">
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {n("verified")}
                  </span>
                )}
                {/* Ledger hashes are hex identifiers — pinned LTR so they never
                    reorder when the document flips to RTL. */}
                <div
                  className="mt-2.5 text-center font-mono text-[6px] leading-relaxed tracking-[0.04em] text-ghost transition-colors group-hover:text-cyan-300 sm:text-[8px] sm:tracking-[0.1em]"
                  dir="ltr"
                  style={{ unicodeBidi: "isolate" }}
                >
                  {h}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── auto-settling smart-contract steps ── */}
      <div className="mt-7 rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-4 backdrop-blur-sm">
        <div className="mb-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-ghost">{n("contract")}</div>
        {/* Same 360px floor as the ledger row above: 149px needed against 124px
            at 320px, so the four steps wrap to 2 x 2 and lose their connectors. */}
        <div className="flex items-start max-[360px]:grid max-[360px]:grid-cols-2 max-[360px]:justify-items-center max-[360px]:gap-y-4">
          {steps.map((s, i) => (
            <div key={s} className={cn("flex items-center", i > 0 && "flex-1")}>
              {i > 0 && (
                <div className="chain-link mx-1 mb-6 flex-1 sm:mx-2 max-[360px]:hidden" aria-hidden>
                  <span className="chain-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full border font-mono text-[9px] transition-all duration-300",
                    i === steps.length - 1
                      ? "animate-glow border-cyan-300 bg-cyan-400/25 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.6)]"
                      : "border-cyan-400/40 bg-cyan-950/40 text-cyan-100/80"
                  )}
                >
                  {i + 1}
                </span>
                {/* Below `sm` the four step columns are sized by these labels,
                    not by the 28px circles: in English they need 193.6px against
                    the 164px the inner box leaves at 360px. Tightening the
                    tracking is what closes that; the 8px size is kept so the
                    caps stay legible. Arabic labels are far narrower and already
                    fit, so `sm:` restores the original for both. */}
                <span className="max-w-[4.5rem] text-center font-mono text-[8px] uppercase leading-relaxed tracking-[0.06em] text-ghost sm:tracking-[0.16em]">
                  {s}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-ghost">{n("note")}</p>
      </div>
    </Panel>
  );
}
