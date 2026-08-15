// ── Ultra-hardened scroll engine ──────────────────────────────────────
// · ONE rAF loop. ZERO layout reads inside the loop — scroll extents are
//   cached and refreshed only off-loop (never per-frame, so no reflows).
// · Every wake listener is passive; none can delay a gesture.
// · Exposes `rawProgress` (finger-locked) and `scrub` (LERPed toward the
//   raw target each frame → buttery video interpolation, zero skipping).
// · Sleeps when motion converges and wakes on gesture, document resize,
//   or a low-frequency watchdog — never on a single signal alone.

export type ScrollFrame = {
  y: number; // smoothed scrollY (px)
  raw: number; // native scrollY
  rawProgress: number; // 0..1 — native, un-lerped
  scrub: number; // 0..1 — LERPed, for video scrubbing
  vel: number; // smoothed velocity (px per ms)
  progress: number; // 0..1 — lerped through the document
  dir: 1 | -1; // 1 = scrolling down
  vh: number; // cached viewport height (px) — never read inside the loop
  reduced: boolean; // user prefers reduced motion
};

type Listener = (frame: ScrollFrame) => void;

/* Interpolation rates. CAMERA_LERP drives the parallax camera; keep it inside
   0.08–0.12 — lower drifts, higher snaps and loses the glide. */
const CAMERA_LERP = 0.11;
const SCRUB_LERP = 0.3;
const VEL_LERP = 0.12;

/* Convergence epsilons — below these the frame is considered settled. */
const EPS_Y = 0.05;
const EPS_SCRUB = 0.0004;
const EPS_VEL = 0.002;

/* Safety-net poll interval used only while the loop is asleep. */
const WATCHDOG_MS = 250;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const frame: ScrollFrame = {
  y: 0,
  raw: 0,
  rawProgress: 0,
  scrub: 0,
  vel: 0,
  progress: 0,
  dir: 1,
  vh: 0,
  reduced: false,
};

const listeners = new Set<Listener>();
let raf = 0;
let last = 0;
let attached = false;
let maxScroll = 1;
let watchdog = 0;
let docObserver: ResizeObserver | null = null;
let motionQuery: MediaQueryList | null = null;

/* Cached extents — refreshed off-loop only. */
function refreshLayout() {
  frame.vh = window.innerHeight;
  maxScroll = Math.max(1, document.documentElement.scrollHeight - frame.vh);
}

function tick(t: number) {
  const target = window.scrollY;
  const prev = frame.y;

  frame.raw = target;
  /* Clamped at the source: iOS elastic overscroll reports negative scrollY and
     values past the extent, and `content-visibility` sections change the height
     as they render. No consumer should have to defend against out-of-range. */
  frame.rawProgress = clamp01(target / maxScroll);

  /* LERP video scrub — responsive but seamless */
  frame.scrub += (frame.rawProgress - frame.scrub) * SCRUB_LERP;
  const scrubGap = Math.abs(frame.rawProgress - frame.scrub);
  if (scrubGap < EPS_SCRUB) frame.scrub = frame.rawProgress;

  /* LERP camera / parallax position */
  frame.y += (target - frame.y) * CAMERA_LERP;
  const yGap = Math.abs(target - frame.y);
  if (yGap < EPS_Y) frame.y = target;

  const dt = Math.max(8, Math.min(40, last ? t - last : 16));
  const instant = (frame.y - prev) / dt;
  frame.vel += (instant - frame.vel) * VEL_LERP;
  frame.progress = clamp01(frame.y / maxScroll);
  frame.dir = instant >= 0 ? 1 : -1;

  last = t;
  for (const l of listeners) l(frame);

  /* Sleep once everything has converged. A settled page must not hold the
     compositor awake at 60fps re-committing identical frames. */
  if (yGap < EPS_Y && scrubGap < EPS_SCRUB && Math.abs(frame.vel) < EPS_VEL) {
    frame.vel = 0;
    sleep();
    return;
  }

  raf = requestAnimationFrame(tick);
}

/* ── Wake / sleep ──────────────────────────────────────────────────────
   Waking must never depend on a single signal. Gesture events are the fast
   path (wheel/touch fire *before* the offset moves), a ResizeObserver covers
   document growth, and while asleep a 4Hz watchdog compares the live offset
   against the last frame. The watchdog exists only during sleep and is torn
   down the instant the loop resumes.
────────────────────────────────────────────────────────────────────── */
function sleep() {
  raf = 0;
  last = 0;
  if (!watchdog) {
    watchdog = window.setInterval(() => {
      if (!raf && window.scrollY !== frame.raw) wake();
    }, WATCHDOG_MS);
  }
}

/** Restart the loop. Safe to call at any time; a no-op while already awake. */
export function wakeScrollLoop() {
  wake();
}

function wake() {
  if (watchdog) {
    clearInterval(watchdog);
    watchdog = 0;
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

function onResize() {
  refreshLayout();
  wake();
}

/* Seed the frame from the live offset so a reload at depth (browsers restore
   scroll position) does not sweep the camera and video up from zero. */
function primeFrame() {
  const y = window.scrollY;
  frame.raw = y;
  frame.y = y;
  frame.rawProgress = clamp01(y / maxScroll);
  frame.scrub = frame.rawProgress;
  frame.progress = frame.rawProgress;
  frame.vel = 0;
  frame.dir = 1;
}

/* Every listener is passive — none of these ever block or delay a gesture. */
const WAKE_EVENTS = ["scroll", "wheel", "touchstart", "touchmove", "keydown", "pointerdown"] as const;

export function startScrollLoop() {
  refreshLayout();

  if (!attached) {
    primeFrame();

    motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    frame.reduced = motionQuery.matches;
    motionQuery.addEventListener("change", onMotionPreference);

    for (const evt of WAKE_EVENTS) {
      window.addEventListener(evt, wake, { passive: true });
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize, { passive: true });

    /* `content-visibility: auto` sections resolve their real height only as
       they approach the viewport, so the document grows after load without a
       resize event. Observe the document itself rather than just the window. */
    if (typeof ResizeObserver !== "undefined") {
      docObserver = new ResizeObserver(onResize);
      docObserver.observe(document.documentElement);
    }

    if (document.readyState === "complete") refreshLayout();
    attached = true;
  }

  wake();

  return stopScrollLoop;
}

function onMotionPreference(e: MediaQueryListEvent) {
  frame.reduced = e.matches;
  wake();
}

/** Full teardown — cancels the loop, the watchdog and every listener. */
export function stopScrollLoop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
  if (watchdog) {
    clearInterval(watchdog);
    watchdog = 0;
  }
  if (!attached) return;
  for (const evt of WAKE_EVENTS) window.removeEventListener(evt, wake);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("load", onResize);
  motionQuery?.removeEventListener("change", onMotionPreference);
  motionQuery = null;
  docObserver?.disconnect();
  docObserver = null;
  attached = false;
}

export function subscribeScroll(fn: Listener) {
  listeners.add(fn);
  fn(frame);
  /* A late subscriber must receive a real frame, not just the settled snapshot. */
  wake();
  return () => {
    listeners.delete(fn);
  };
}
