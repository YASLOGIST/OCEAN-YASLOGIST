import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useLang } from "../lib/i18n";
import { subscribeScroll } from "../lib/scroll";
import { useInView } from "../hooks/useInView";

/* ── Glass card ─────────────────────────────────────────────────────── */
export function GlassCard({
  children,
  className,
  strong,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div className={cn("gpu", strong ? "glass-strong" : "glass", "rounded-2xl", className)}>{children}</div>
  );
}

/* ── Scroll reveal wrapper (transform + opacity only → ultra light) ── */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "zoom";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  /* will-change costs a retained compositor layer per element. Hold it only
     while the reveal is actually animating, then release it. */
  const [settled, setSettled] = useState(false);
  const hidden = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-14",
    right: "-translate-x-14",
    zoom: "scale-95",
  }[from];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      onTransitionEnd={(e) => {
        /* transitionend bubbles — a child's hover transition must not retire
           this element's will-change while the reveal is still running. */
        if (e.target === e.currentTarget) setSettled(true);
      }}
      className={cn(
        "transition-all duration-1000 ease-[cubic-bezier(.16,1,.3,1)]",
        /* Hold the hint only while this reveal is actually in flight. Applying
           it from mount would pin a compositor layer per Reveal at page load. */
        inView && !settled ? "will-change-transform" : "will-change-auto",
        inView ? "translate-x-0 translate-y-0 scale-100 opacity-100" : cn("opacity-0", hidden),
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Scroll-linked parallax float (direct DOM writes) ───────────────────
   Two modes.

   Default (`anchor` unset): displacement is `f.y * speed` — driven by ABSOLUTE
   scroll offset. This grows without bound as the page scrolls, so it is only
   safe for an element that lives at the top of the document.

   `anchor`: displacement is measured from the element's own centre, so it is
   zero when the element is centred in the viewport and clamped to its on-screen
   travel. Required for anything repeated down the page. Two stacked sections
   with opposite `speed` signs converge under the default mode at a rate of
   `|2 · speed| · scrollY`, which at the foot of this document reached 405px —
   enough to drive each card through the shared section seam and, because the
   sections are `overflow: hidden` and exactly adjacent, slice ~200px off both.

   The anchor is derived from `offsetTop`, which is layout and therefore immune
   to this element's own transform — no feedback loop — and it is measured only
   outside the scroll callback, because the engine forbids layout reads inside
   the frame loop.

   BOTH modes are additionally bounded by the room the element has inside its
   nearest vertically-clipping ancestor. Without that, the default mode rides
   content past the clip edge and the ancestor slices it flat — a hard
   horizontal cut with no border and no radius, straight through whatever card
   happens to be there. The Hero hit exactly this on phones: its single-column
   stack leaves only `pb-36` (144px) of slack, while 0.22 × scroll reaches
   326px before the section leaves the viewport, severing the vessel card 24px
   above the stats card.
────────────────────────────────────────────────────────────────────────── */
/* Cards here carry a box-shadow reaching ~51px below their border box
   (--glass-sshadow is `0 30px 90px -24px`: 30 down, less 24 spread, plus half
   the 90px radius). Stopping the shift exactly at the clip edge keeps the card
   whole but shears that box-shadow off square, which trades a hard cut for a
   soft one rather than removing it. Hold this much of the slack back so the
   box-shadow lands inside the clip box too.

   Always write it hyphenated, never as the bare noun: Tailwind scans this file
   for class candidates, so a standalone occurrence of that word compiles a
   dead utility of the same name into the production sheet — 243 bytes of CSS
   that nothing references. Measured, not theorised. */
const CLIP_MARGIN = 52;

export function Parallax({
  speed = 0.15,
  anchor = false,
  className,
  children,
}: {
  speed?: number;
  anchor?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const centre = useRef(0);
  const halfHeight = useRef(0);
  const slackDown = useRef(Infinity);
  const slackUp = useRef(Infinity);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Layout offset of `node` within `stop` (or the document when stop is null). */
    const offsetWithin = (node: HTMLElement, stop: HTMLElement | null) => {
      let y = 0;
      for (let n: HTMLElement | null = node; n && n !== stop; n = n.offsetParent as HTMLElement | null) {
        y += n.offsetTop;
      }
      return y;
    };

    const measure = () => {
      halfHeight.current = el.offsetHeight / 2;
      centre.current = offsetWithin(el, null) + halfHeight.current;

      /* Nearest ancestor that clips vertically — the box that would slice us.
         `overflowY` rather than the `overflow` shorthand: the page wrapper sets
         only `overflow-x`, and the shorthand reads back as a two-axis value
         there, which a plain !== "visible" test would wrongly treat as a clip. */
      slackDown.current = Infinity;
      slackUp.current = Infinity;
      let clip: HTMLElement | null = el.parentElement;
      while (clip && clip !== document.body && getComputedStyle(clip).overflowY === "visible") {
        clip = clip.parentElement;
      }
      if (clip && clip !== document.body) {
        const top = offsetWithin(el, clip);
        /* Only trust the figure when the offset chain actually reaches the clip
           box; an unpositioned ancestor would otherwise yield a bogus origin. */
        if (top >= 0 && el.offsetHeight <= clip.clientHeight) {
          slackUp.current = Math.max(0, top - CLIP_MARGIN);
          slackDown.current = Math.max(0, clip.clientHeight - (top + el.offsetHeight) - CLIP_MARGIN);
        }
      }
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    /* `content-visibility` sections resolve their real height only as they
       approach the viewport, which shifts every anchor below them. */
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(document.documentElement);
    }

    const unsubscribe = subscribeScroll((f) => {
      if (!el) return;
      let d = f.y;
      if (anchor) {
        const vh = f.vh || window.innerHeight;
        /* Past this the element has fully left the viewport; freezing there
           keeps the offset bounded instead of accumulating with scroll depth. */
        const travel = vh / 2 + halfHeight.current;
        d = f.y + vh / 2 - centre.current;
        if (d > travel) d = travel;
        else if (d < -travel) d = -travel;
      }
      let shift = d * speed;
      /* Never displace past the clip box: the cut it would make is worse than
         the parallax is worth. Holding at the bound is what `anchor` already
         does at the end of its travel, so the motion still settles smoothly. */
      if (shift > slackDown.current) shift = slackDown.current;
      else if (shift < -slackUp.current) shift = -slackUp.current;
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [speed, anchor]);

  return (
    <div ref={ref} className={cn("gpu", className)}>
      {children}
    </div>
  );
}

/* ── Animated counter ───────────────────────────────────────────────── */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1900,
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const formatted = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ── Buttons ────────────────────────────────────────────────────────── */
export function NeonButton({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      {...props}
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-sm font-semibold tracking-wide",
        variant === "primary" ? "btn-primary" : "btn-ghost",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ── Mono section tag ───────────────────────────────────────────────── */
export function SectionTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "micro inline-flex items-center gap-2.5 rounded-full border border-neon/25 bg-neon/[0.06] px-4 py-1.5 font-mono text-neon",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
        <span className="glow-dot relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
      </span>
      {children}
    </span>
  );
}

/* ── Small icons ────────────────────────────────────────────────────── */
/* ── Calibration badge ───────────────────────────────────────────────────
   Marks a figure, panel or widget as an illustrative digital-twin model
   rather than a live operational feed. The Terms modal already carried that
   statement, but a disclaimer behind a click does not travel with the number
   it qualifies — a visitor reading "2,148 sensors" never sees it. This puts
   the same claim inline, in whichever language the page is in.
────────────────────────────────────────────────────────────────────────── */
export function ModelBadge({ short = false, className }: { short?: boolean; className?: string }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/[0.07]",
        "px-2.5 py-1 font-mono text-[8px] uppercase leading-none tracking-[0.16em] text-amber-200/85",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
      {short ? t("model.badgeShort") : t("model.badge")}
    </span>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        "h-4 w-4 transition-transform duration-300 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
        className
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-3 w-3", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
