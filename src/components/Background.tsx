import { useEffect, useRef } from "react";
import { subscribeScroll } from "../lib/scroll";
import { useTheme } from "../lib/theme";
import poster from "../assets/poster.jpg";

/**
 * Scroll-scrubbed background — canvas frame sequence, no <video> element.
 *
 * WHY NO VIDEO: driving `video.currentTime` from scroll forces the media
 * decoder to seek on every tick. Safari serialises those seeks against the
 * compositor, which is what produced the scrub stutter. Here the footage is
 * pre-decoded to a JPEG frame sequence and blitted to a canvas, so a scroll
 * frame costs one image draw and never touches a decoder.
 *
 * · The canvas backing store is EXACTLY the frame size, so every draw is a
 *   1:1 blit with no scaling. CSS `object-fit: cover` does the viewport fit on
 *   the GPU — draw cost is constant on a phone or a 5K display.
 * · Frame index is a pure function of the engine's LERPed `scrub` value, so
 *   frames advance only while scrolling (either direction) and stop dead the
 *   instant scrolling stops — the engine sleeps and no draw is issued.
 * · Adjacent frames are alpha-blended by the fractional index, so 100 frames
 *   read smoother than a hard frame switch would at twice the count.
 */

const FRAME_COUNT = 60;

/* Two encodes of the same footage. The canvas is a full-viewport COVER layer,
   so the pixels it genuinely needs are (viewport width × DPR) — nothing more.
   Shipping the 1280×720 master to a 375pt phone measured 2,902 KB of transfer
   and ~211 MB of retained decoded bitmap (60 × 1280 × 720 × 4 B), which is the
   dominant cost on mobile. The small set is a straight 640×360 re-encode. */
const FRAME_SETS = {
  sm: { w: 640, h: 360, suffix: "-sm" },
  lg: { w: 1280, h: 720, suffix: "" },
} as const;
type FrameSetKey = keyof typeof FRAME_SETS;

/* Chosen once per load, not per resize: swapping mid-session would throw away a
   warm sequence and re-download the other one. DPR is capped at 2 because past
   that the extra density is invisible under the veil while bitmap memory keeps
   growing linearly. */
function pickFrameSet(): FrameSetKey {
  if (typeof window === "undefined") return "lg";
  const needed = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  return needed <= 900 ? "sm" : "lg";
}

/* Frames fetched before the page has painted. Enough that the canvas has
   something to show immediately; `nearestLoaded` covers the rest of the range
   until the deferred batch arrives, so the picture sharpens rather than
   appearing late. */
const EAGER_FRAMES = 6;

/* Scroll distance that plays the whole sequence, in viewport heights. Kept in
   screen units rather than document percent so the mapping is identical no
   matter how the page's measured height fluctuates. */
const SCRUB_SCREENS = 10;

const seqBase = (name: "night" | "day", set: FrameSetKey) =>
  `${import.meta.env.BASE_URL}frames/${name}${FRAME_SETS[set].suffix}/`;

/* Defer until the page has had its first paint, then until the main thread is
   idle. This is what keeps the remaining 54 frames off the critical path. */
function whenIdle(fn: () => void) {
  const go = () => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 200);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
}

const frameUrl = (base: string, i: number) => `${base}${String(i + 1).padStart(3, "0")}.jpg`;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

type Seq = {
  imgs: HTMLImageElement[];
  loaded: boolean[];
  anyLoaded: boolean;
  started: boolean;
};

function newSeq(): Seq {
  return { imgs: [], loaded: [], anyLoaded: false, started: false };
}

/** Nearest already-decoded frame to `i`, searching outward. -1 if none yet. */
function nearestLoaded(seq: Seq, i: number): number {
  if (seq.loaded[i]) return i;
  for (let d = 1; d < FRAME_COUNT; d++) {
    if (seq.loaded[i - d]) return i - d;
    if (seq.loaded[i + d]) return i + d;
  }
  return -1;
}

function FrameCanvas({
  base,
  active,
  width,
  height,
  className,
}: {
  base: string;
  active: boolean;
  width: number;
  height: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seqRef = useRef<Seq>(newSeq());
  const scrubRef = useRef(0);

  /* Paint the frame pair for the current scrub position. */
  const draw = useRef((scrub: number) => {
    const canvas = canvasRef.current;
    const seq = seqRef.current;
    if (!canvas || !seq.anyLoaded) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const pos = clamp01(scrub) * (FRAME_COUNT - 1);
    const i0 = Math.floor(pos);
    const i1 = Math.min(FRAME_COUNT - 1, i0 + 1);
    const t = pos - i0;

    const a = nearestLoaded(seq, i0);
    if (a < 0) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(seq.imgs[a], 0, 0);

    /* Blend toward the next frame by the fractional index — this is what makes
       a discrete sequence read as continuous motion. */
    if (t > 0.01) {
      const b = nearestLoaded(seq, i1);
      if (b >= 0 && b !== a) {
        ctx.globalAlpha = t;
        ctx.drawImage(seq.imgs[b], 0, 0);
        ctx.globalAlpha = 1;
      }
    }
  });

  /* Begin (or resume) loading this sequence once its theme is actually shown —
     the inactive theme's frames are never fetched. */
  useEffect(() => {
    if (!active) return;
    const seq = seqRef.current;
    if (seq.started) {
      draw.current(scrubRef.current);
      return;
    }
    seq.started = true;
    seq.imgs = new Array(FRAME_COUNT);
    seq.loaded = new Array(FRAME_COUNT).fill(false);

    /* No cancellation flag here on purpose. StrictMode mounts, unmounts and
       remounts this effect; a flag captured by these onload handlers would be
       set during that throwaway unmount and permanently silence the only
       Image objects we create, since `started` short-circuits the remount.
       Recording a load after unmount is harmless — draw() no-ops on a null
       canvas ref. The deferred batch below is scheduled without a flag for the
       same reason. */
    const load = (i: number, priority: "high" | "low") => {
      const img = new Image();
      img.decoding = "async";
      /* setAttribute rather than the property: fetchPriority is not in this
         TS lib's HTMLImageElement, and the attribute form is what ships. */
      img.setAttribute("fetchpriority", priority);
      img.onload = () => {
        seq.loaded[i] = true;
        seq.anyLoaded = true;
        /* Redraw as frames arrive so the picture sharpens progressively even
           if the loop is asleep. */
        draw.current(scrubRef.current);
      };
      img.src = frameUrl(base, i);
      seq.imgs[i] = img;
    };

    /* Enough to paint the opening of the sequence right away… */
    const eager = Math.min(EAGER_FRAMES, FRAME_COUNT);
    for (let i = 0; i < eager; i++) load(i, "high");

    /* …and the remainder only once the page has painted and gone idle, at low
       priority so it never competes with the document or the fonts. */
    whenIdle(() => {
      for (let i = eager; i < FRAME_COUNT; i++) load(i, "low");
    });
  }, [active, base]);

  /* One subscription to the shared scroll engine. No own rAF loop. */
  useEffect(
    () =>
      subscribeScroll((f) => {
        /* Position is derived from SMOOTHED SCROLL PIXELS, not from document
           progress. `content-visibility: auto` sections resolve and release
           their height as they near the viewport, so scrollHeight — and any
           progress ratio built on it — drifts even while the user is holding
           still. Pixels are stable, so the sequence only moves when the user
           actually moves. f.y is the engine's LERPed position, which is what
           carries the inertia. */
        const span = SCRUB_SCREENS * (f.vh || 1);
        scrubRef.current = clamp01(f.y / span);
        /* Scrubbing tracks the user's own scroll 1:1, so it is direct
           manipulation rather than autonomous motion and stays enabled under
           prefers-reduced-motion. The differential camera pan/zoom IS the
           vestibular trigger, and that remains gated on `f.reduced`. */
        if (!active) return;
        draw.current(scrubRef.current);
      }),
    [active]
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden
    />
  );
}

export default function Background() {
  const { theme } = useTheme();
  const moverRef = useRef<HTMLDivElement>(null);
  const nightActive = theme === "dark";
  /* Resolved once and held: see pickFrameSet on why this must not react to
     resize. */
  const setKey = useRef(pickFrameSet()).current;
  const { w: frameW, h: frameH } = FRAME_SETS[setKey];

  /* The ONLY scroll-driven layout work: a GPU transform on the camera
     container. Writes `transform` only — no layout, no paint. */
  useEffect(
    () =>
      subscribeScroll((f) => {
        const mover = moverRef.current;
        if (!mover) return;
        const zoom = f.reduced ? 1.06 : 1.06 + f.progress * 0.14;
        /* Inset-0, scaled from centre: cover above the viewport top is half the
           overhang, (zoom-1)/2 * vh. Pan is capped to it so the footage never
           lifts off the top edge. */
        const overhang = ((zoom - 1) / 2) * f.vh;
        const ty = f.reduced ? 0 : Math.min(f.y * 0.1, overhang);
        mover.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`;
      }),
    []
  );

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[-1] h-screen w-screen overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_8%,var(--bg-grad-a),var(--bg-grad-b)_45%,var(--bg-grad-c))]" />

      {/* Camera layer — the ONLY element the scroll engine transforms. Its own
          compositing layer: each frame is a GPU transform, no layout, no paint. */}
      <div ref={moverRef} className="bg-camera absolute inset-0">
        {/* Placeholder until the first frame decodes. */}
        <img src={poster} alt="" className="bg-poster absolute inset-0 h-full w-full object-cover" />

        <FrameCanvas
          base={seqBase("day", setKey)}
          active={!nightActive}
          width={frameW}
          height={frameH}
          className="bg-video bg-video-day absolute inset-0 h-full w-full object-cover select-none"
        />
        <FrameCanvas
          base={seqBase("night", setKey)}
          active={nightActive}
          width={frameW}
          height={frameH}
          className="bg-video bg-video-night absolute inset-0 h-full w-full object-cover select-none"
        />

        {/* Subtle darkening over the night footage — lifts text/glass contrast
            without touching the day layer. Fades with the theme. */}
        <div className="bg-night-veil absolute inset-0" style={{ opacity: nightActive ? 1 : 0 }} />
      </div>

      <div className="grid-overlay grid-fade absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--veil-1)] via-transparent to-[var(--veil-2)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_50%,transparent_42%,var(--veil-rad))]" />
      <div className="scanline animate-scan absolute left-0 right-0 top-0 h-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(60%_100%_at_50%_100%,var(--veil-glow),transparent_70%)]" />
    </div>
  );
}
