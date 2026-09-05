import { useEffect, useRef } from "react";
import { useLang } from "../lib/i18n";

/**
 * Glassmorphism legal modal (Terms / Privacy / Security).
 * Accessible by construction: labelled dialog role, Escape to dismiss,
 * backdrop click to dismiss, focus moved in on open and restored on close,
 * background scroll locked while open, and focus kept inside the panel.
 */
export default function LegalModal({
  open,
  title,
  paragraphs,
  onClose,
}: {
  open: boolean;
  title: string;
  paragraphs: string[];
  onClose: () => void;
}) {
  const { t } = useLang();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    /* Lock background scroll without a layout jump from the vanishing bar. */
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingInlineEnd;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      /* Keep focus inside the dialog. */
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingInlineEnd = prevPad;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-5 sm:p-8"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "color-mix(in srgb, var(--c-bg) 72%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-strong gpu relative max-h-[82vh] w-full max-w-2xl overflow-hidden rounded-2xl"
        style={{ boxShadow: "0 0 60px rgba(0, 229, 255, 0.16), inset 0 1px 0 rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-start justify-between gap-6 border-b border-chrome/10 px-6 py-5 sm:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.28em] text-neon">
              YASLOGIST · NEW CAIRO, CAIRO
            </p>
            <h2 className="mt-2 font-display text-xl font-bold leading-snug text-ice sm:text-2xl">{title}</h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t("footer.close")}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-chrome/15 bg-chrome/[0.05] text-ghost transition-all duration-300 hover:border-neon/50 hover:text-neon"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[58vh] space-y-4 overflow-y-auto px-6 py-6 sm:px-8">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-ice/80">
              {p}
            </p>
          ))}
        </div>

        <div className="flex justify-end border-t border-chrome/10 px-6 py-4 sm:px-8">
          <button
            onClick={onClose}
            className="btn-ghost gpu cursor-pointer rounded-xl px-5 py-2.5 font-display text-xs font-semibold tracking-wide"
          >
            {t("footer.close")}
          </button>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-neon/30" />
        <div className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-neon/30" />
      </div>
    </div>
  );
}
