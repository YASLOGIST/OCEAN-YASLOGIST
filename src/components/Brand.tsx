import { founderPhoto } from "../assets/brand";
import { cn } from "../utils/cn";

/* ── Canonical platform mark ─────────────────────────────────────────────
   The YASLOGIST monogram, identical to main/media/logo.svg, main's inline
   header mark and land's navbar mark: a ruled globe behind a "YL" ligature.

   This replaced two competing marks. `yaslogist-logo.png` was a 192×192
   raster inlined as a data URI, and behind it sat `BrandGlyph`, a bespoke
   mast-and-swell cargo glyph used whenever that file was absent — so the
   surface could render either of two logos, neither of which was the one on
   the corporate hub. Vector, currentColor, one definition.
────────────────────────────────────────────────────────────────────────── */
function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      role="img"
      aria-label="YASLOGIST"
    >
      <g strokeWidth="1.6" opacity="0.55">
        <ellipse cx="32" cy="32" rx="12.5" ry="29" />
        <path d="M3 32h58M8 17.5h48M8 46.5h48" />
      </g>
      <circle cx="32" cy="32" r="29" strokeWidth="2.2" />
      <g strokeWidth="5" strokeLinecap="square">
        <path d="M16 16 L27.5 31.5 L27.5 49" />
        <path d="M39 16 L30 28" />
        <path d="M40.5 20 L40.5 48 L53 48" />
      </g>
    </svg>
  );
}

/* ── Platform mark — glassmorphic container, cyan neon rim ──────────── */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("brand-mark grid shrink-0 place-items-center overflow-hidden rounded-full p-1.5 text-ice", className)}>
      <BrandGlyph className="h-full w-full" />
    </span>
  );
}

/* ── Founder avatar — circular, cover-cropped, cyan rim ─────────────── */
export function FounderAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span className={cn("founder-avatar relative block shrink-0 overflow-hidden rounded-full", className)}>
      {founderPhoto ? (
        <img
          src={founderPhoto}
          alt=""
          width={112}
          height={112}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full rounded-full object-cover"
          style={{ objectPosition: "50% 18%" }}
          draggable={false}
        />
      ) : (
        <span className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 font-display text-sm font-bold text-[#02101f]">
          {initials}
        </span>
      )}
    </span>
  );
}
