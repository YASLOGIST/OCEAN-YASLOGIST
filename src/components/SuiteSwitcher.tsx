import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";
import { SURFACES, SUITE_LABEL, type SurfaceId } from "../lib/suite";

/* ── Multi-modal suite switcher ───────────────────────────────────────────
   Two presentations of one table:

   · `variant="bar"`  — a compact frosted segmented control for the header.
   · `variant="grid"` — a four-card grid for the mobile drawer.

   The bar is icon-only and deliberately small. This header is width-capped and
   has form: the "Connect Directly" CTA was removed from it because 159px
   pushed the row 108px over budget at 1200px and the browser paid by crushing
   the theme toggle (see the note at Navbar.tsx). The bar is therefore ~112px,
   `shrink-0`, and hidden below `xl` — at `lg` the row has only ~50px of slack.
   Everything narrower gets the grid inside the drawer instead, which is where
   phone visitors were always going to look.
────────────────────────────────────────────────────────────────────────── */

function SurfaceIcon({ id, className }: { id: SurfaceId; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: "false" as const,
  };
  switch (id) {
    case "hub": // stacked layers — the surface every other one reports into
      return (
        <svg {...common}>
          <path d="m12 2 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 17 9 5 9-5" />
        </svg>
      );
    case "land": // truck
      return (
        <svg {...common}>
          <path d="M2 8.5h11v8H2z" />
          <path d="M13 11h4l3 3v2.5h-7" />
          <circle cx="6.5" cy="18" r="1.8" />
          <circle cx="16.5" cy="18" r="1.8" />
        </svg>
      );
    case "ocean": // hull on a swell
      return (
        <svg {...common}>
          <path d="M3 17.5c2 1.3 3.6 1.3 6 0s4-1.3 6 0 3.4 1.1 5 0" />
          <path d="M4.5 14 6 9.5h12L19.5 14" />
          <path d="M12 9.5V5" />
          <path d="M9.5 5h5" />
        </svg>
      );
    case "air": // plane
      return (
        <svg {...common}>
          <path d="M21 15.5 12.5 11V5.2a1.7 1.7 0 0 0-3.4 0V11L1 15.5v2l8.1-2.3.6 3.6-2.2 1.6v1.1l3.8-.9 3.8.9v-1.1l-2.2-1.6.6-3.6L21 17.5Z" />
        </svg>
      );
  }
}

export default function SuiteSwitcher({
  current,
  variant = "bar",
  onNavigate,
  className,
}: {
  current: SurfaceId;
  variant?: "bar" | "grid";
  onNavigate?: () => void;
  className?: string;
}) {
  const { lang } = useLang();

  if (variant === "grid") {
    return (
      /* A labelled landmark, not a bare div: this is the only way off the
         surface on a phone, and a screen-reader user should be able to jump
         straight to it. */
      <nav aria-label={SUITE_LABEL[lang]} className={className}>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-neon">
          {SUITE_LABEL[lang]}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SURFACES.map((s) => {
            const active = s.id === current;
            const copy = s[lang];
            const disabled = !s.live;

            const inner = (
              <>
                <SurfaceIcon id={s.id} className="h-4 w-4" />
                <span className="mt-1.5 text-[11px] font-semibold leading-none">{copy.name}</span>
              </>
            );

            const base =
              "flex flex-col items-center justify-center rounded-xl border px-1 py-2.5 text-center transition-all duration-300";

            if (disabled) {
              return (
                <span
                  key={s.id}
                  aria-disabled="true"
                  title={copy.note}
                  className={cn(base, "cursor-not-allowed border-chrome/10 bg-chrome/[0.02] text-ghost/45")}
                >
                  {inner}
                </span>
              );
            }

            return (
              <a
                key={s.id}
                href={active ? undefined : s.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                title={copy.note}
                className={cn(
                  base,
                  active
                    ? "cursor-default border-transparent text-ice"
                    : "border-chrome/10 bg-chrome/[0.04] text-ghost hover:text-ice"
                )}
                style={
                  active
                    ? { borderColor: s.accent, background: `${s.accent}1f`, boxShadow: `0 0 16px ${s.glow}` }
                    : undefined
                }
              >
                {inner}
              </a>
            );
          })}
        </div>
      </nav>
    );
  }

  /* bar */
  return (
    <nav
      aria-label={SUITE_LABEL[lang]}
      className={cn(
        "glass-strong shrink-0 flex items-center gap-0.5 rounded-full p-1",
        className
      )}
    >
      {SURFACES.map((s) => {
        const active = s.id === current;
        const copy = s[lang];

        if (!s.live) {
          return (
            <span
              key={s.id}
              aria-disabled="true"
              title={`${copy.name} — ${copy.note}`}
              className="grid h-7 w-7 cursor-not-allowed place-items-center rounded-full text-ghost/35"
            >
              <SurfaceIcon id={s.id} className="h-3.5 w-3.5" />
              <span className="sr-only">{`${copy.name} — ${copy.note}`}</span>
            </span>
          );
        }

        return (
          <a
            key={s.id}
            href={active ? undefined : s.href}
            aria-current={active ? "page" : undefined}
            aria-label={`${copy.name} — ${copy.note}`}
            title={`${copy.name} — ${copy.note}`}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full transition-all duration-300",
              active ? "cursor-default" : "text-ghost hover:text-ice hover:bg-chrome/10"
            )}
            style={
              active
                ? { background: `${s.accent}26`, color: s.accent, boxShadow: `0 0 12px ${s.glow}` }
                : undefined
            }
          >
            <SurfaceIcon id={s.id} className="h-3.5 w-3.5" />
          </a>
        );
      })}
    </nav>
  );
}
