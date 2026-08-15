import { brandLogo, founderPhoto } from "../assets/brand";
import { cn } from "../utils/cn";

/* ── Fallback platform glyph ─────────────────────────────────────────────
   Used only when no `yaslogist-logo` asset is present in src/assets/brand/.
   A stylised cargo mark: hull, containers, uplink arc. */
function BrandGlyph({ id, className }: { id: string; className?: string }) {
  const gid = `ylGrad-${id}`;
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-label="YASLOGIST">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22e4ff" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" stroke={`url(#${gid})`} strokeWidth="2" />
      <circle cx="24" cy="24" r="17.5" stroke={`url(#${gid})`} strokeWidth="1" strokeDasharray="2.5 3" opacity="0.65" />
      {/* uplink mast */}
      <path d="M24 11v11" stroke={`url(#${gid})`} strokeWidth="2.4" strokeLinecap="round" />
      <path d="m18.5 15.5 5.5-5 5.5 5" stroke={`url(#${gid})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* container tiers */}
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="M15 25h18" />
        <path d="M17.5 29.5h13" />
      </g>
      {/* swell */}
      <path d="M12 34c2.6 1.7 5 1.7 8 0s5.4-1.7 8 0 5-1.7 8 0" stroke={`url(#${gid})`} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}

/* ── Platform mark — glassmorphic container, cyan neon rim ──────────── */
export function BrandMark({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cn("brand-mark grid shrink-0 place-items-center overflow-hidden rounded-full p-1.5", className)}>
      {brandLogo ? (
        <img
          src={brandLogo}
          alt="YASLOGIST"
          width={44}
          height={44}
          decoding="async"
          className="brand-mark-img h-full w-full object-contain"
          draggable={false}
        />
      ) : (
        <BrandGlyph id={id} className="h-full w-full" />
      )}
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
