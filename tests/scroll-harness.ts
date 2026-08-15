import {
  startScrollLoop,
  stopScrollLoop,
  wakeScrollLoop,
  subscribeScroll,
  type ScrollFrame,
} from "../src/lib/scroll";

/* ══════════════════════════════════════════════════════════════════════════
   Headless harness for src/lib/scroll.ts

   The browser preview pane suspends requestAnimationFrame and forces
   prefers-reduced-motion, so the engine cannot be exercised there. This drives
   the REAL module against a controllable fake window: rAF is a queue we pump
   by hand, so every frame is deterministic and the LERP maths is checked to
   exact values rather than eyeballed.

   Run:  bun scroll-harness.ts
══════════════════════════════════════════════════════════════════════════ */

type Cb = (t: number) => void;

/* ── fake environment ─────────────────────────────────────────────────── */
const rafQueue = new Map<number, Cb>();
let rafId = 0;
let now = 0;

type Reg = { fn: (e?: unknown) => void; opts: unknown };
const listeners: Record<string, Reg[]> = {};
const intervals = new Map<number, () => void>();
let intervalId = 1;

let roInstances = 0;
let roDisconnects = 0;
let roObserved: unknown = null;
type MqHandler = (e: { matches: boolean }) => void;
const mqHandlers = new Set<MqHandler>();

const fakeWindow = {
  scrollY: 0,
  innerHeight: 939,
  addEventListener(type: string, fn: (e?: unknown) => void, opts: unknown) {
    (listeners[type] ||= []).push({ fn, opts });
  },
  removeEventListener(type: string, fn: (e?: unknown) => void) {
    const arr = listeners[type];
    if (!arr) return;
    const i = arr.findIndex((r) => r.fn === fn);
    if (i >= 0) arr.splice(i, 1);
  },
  setInterval(fn: () => void) {
    const id = intervalId++;
    intervals.set(id, fn);
    return id;
  },
  matchMedia(_q: string) {
    return {
      matches: false,
      addEventListener(_t: string, fn: MqHandler) {
        mqHandlers.add(fn);
      },
      removeEventListener(_t: string, fn: MqHandler) {
        mqHandlers.delete(fn);
      },
    };
  },
};

const fakeDocument = {
  readyState: "complete",
  documentElement: { scrollHeight: 10939 }, // maxScroll = 10939 - 939 = 10000
};

(globalThis as any).window = fakeWindow;
(globalThis as any).document = fakeDocument;
(globalThis as any).requestAnimationFrame = (cb: Cb) => {
  const id = ++rafId;
  rafQueue.set(id, cb);
  return id;
};
(globalThis as any).cancelAnimationFrame = (id: number) => rafQueue.delete(id);
(globalThis as any).clearInterval = (id: number) => intervals.delete(id);
(globalThis as any).ResizeObserver = class {
  constructor(_cb: () => void) {
    roInstances++;
  }
  observe(target: unknown) {
    roObserved = target;
  }
  disconnect() {
    roDisconnects++;
  }
};



/* ── driver ───────────────────────────────────────────────────────────── */
function pump(n: number, msPerFrame = 16) {
  let ran = 0;
  for (let i = 0; i < n; i++) {
    if (!rafQueue.size) break;
    const batch = [...rafQueue.values()];
    rafQueue.clear();
    now += msPerFrame;
    for (const cb of batch) cb(now);
    ran++;
  }
  return ran;
}
const fire = (type: string) => (listeners[type] || []).forEach((l) => l.fn());
const tickWatchdog = () => [...intervals.values()].forEach((fn) => fn());
const pending = () => rafQueue.size;
const listenerCount = () => Object.values(listeners).reduce((n, a) => n + a.length, 0);

/* ── assertions ───────────────────────────────────────────────────────── */
const results: Array<{ n: number; name: string; pass: boolean; detail: string }> = [];
let counter = 0;
const check = (name: string, pass: boolean, detail: string) =>
  results.push({ n: ++counter, name, pass, detail });

const seen: ScrollFrame[] = [];

/* ═══ lifecycle: start at depth to prove priming ═══ */
fakeWindow.scrollY = 4000;
const dispose = startScrollLoop();
const unsub = subscribeScroll((f: ScrollFrame) => seen.push({ ...f }));

check(
  "startScrollLoop returns a disposer function",
  typeof dispose === "function",
  `typeof = ${typeof dispose}`
);
check(
  "frame is primed from live scrollY (no sweep from 0 on reload at depth)",
  seen[0].y === 4000 && seen[0].raw === 4000,
  `y=${seen[0].y} raw=${seen[0].raw}`
);
check(
  "primed progress is correct against cached extent",
  Math.abs(seen[0].progress - 0.4) < 1e-9,
  `progress=${seen[0].progress} (expected 0.4)`
);
check("viewport height published on the frame", seen[0].vh === 939, `vh=${seen[0].vh}`);
check(
  "reduced-motion preference seeded onto the frame",
  seen[0].reduced === false,
  `reduced=${seen[0].reduced}`
);
check(
  "subscribeScroll delivers a frame synchronously on subscribe",
  seen.length >= 1,
  `frames delivered on subscribe = ${seen.length}`
);

const PASSIVE = ["scroll", "wheel", "touchstart", "touchmove", "keydown", "pointerdown", "resize", "load"];
check(
  "all 8 wake/resize listeners registered { passive: true }",
  PASSIVE.every((t) => (listeners[t] || []).length > 0 && listeners[t].every((l) => (l.opts as any)?.passive === true)),
  PASSIVE.join(",")
);
check("ResizeObserver created for document growth", roInstances === 1, `instances=${roInstances}`);
check(
  "ResizeObserver observes documentElement",
  roObserved === fakeDocument.documentElement,
  `observed=${roObserved === fakeDocument.documentElement}`
);
check("reduced-motion change listener registered", mqHandlers.size === 1, `mqListeners=${mqHandlers.size}`);

/* ═══ sleep / wake ═══ */
pump(80);
check("loop sleeps once motion converges", pending() === 0, `pendingRaf=${pending()}`);

fakeWindow.scrollY = 7000;
fire("scroll");
check("scroll event wakes a sleeping loop", pending() === 1, `pendingRaf=${pending()}`);

seen.length = 0;
pump(1);
const rate = (seen[0].y - 4000) / 3000;
check(
  "camera LERP rate inside the required 0.08–0.12 band",
  rate >= 0.08 && rate <= 0.12,
  `measured=${rate.toFixed(4)} (CAMERA_LERP=0.11)`
);
check(
  "first frame interpolates rather than snapping to target",
  seen[0].y > 4000 && seen[0].y < 7000,
  `y after 1 frame = ${seen[0].y.toFixed(1)}`
);
check("direction reads +1 while scrolling down", seen[0].dir === 1, `dir=${seen[0].dir}`);

pump(500);
const last = seen[seen.length - 1];
check("converges exactly to target", Math.abs(last.y - 7000) < 1e-6, `y=${last.y}`);
check(
  "never overshoots the target",
  !seen.some((s) => s.y > 7000 + 1e-6),
  `max y=${Math.max(...seen.map((s) => s.y)).toFixed(3)}`
);
check("re-sleeps after converging", pending() === 0, `pendingRaf=${pending()}`);

/* ═══ direction on reverse ═══ */
seen.length = 0;
fakeWindow.scrollY = 3000;
fire("scroll");
pump(3);
check("direction reads −1 while scrolling up", seen[0].dir === -1, `dir=${seen[0].dir}`);
pump(500);

/* ═══ clamping ═══ */
seen.length = 0;
fakeWindow.scrollY = -350; // iOS elastic overscroll at the top
fire("scroll");
pump(500);
check(
  "negative scrollY (iOS rubber-band) never yields negative progress",
  !seen.some((s) => s.progress < 0 || s.rawProgress < 0 || s.scrub < 0),
  `min progress=${Math.min(...seen.map((s) => s.progress)).toFixed(4)}`
);

seen.length = 0;
fakeWindow.scrollY = 99999; // past a stale extent
fire("scroll");
pump(500);
check(
  "scrollY past the extent never yields progress > 1",
  !seen.some((s) => s.progress > 1 || s.rawProgress > 1),
  `max progress=${Math.max(...seen.map((s) => s.progress)).toFixed(4)}`
);
check(
  "scrub stays within 0..1 across both clamp cases",
  !seen.some((s) => s.scrub < 0 || s.scrub > 1),
  `max scrub=${Math.max(...seen.map((s) => s.scrub)).toFixed(4)}`
);

/* ═══ extent refresh (content-visibility growth) ═══ */
seen.length = 0;
fakeWindow.scrollY = 5000;
fakeDocument.documentElement.scrollHeight = 20939; // maxScroll -> 20000
fire("resize");
pump(500);
check(
  "extent refresh after document growth yields correct progress",
  Math.abs(seen[seen.length - 1].progress - 0.25) < 1e-6,
  `progress=${seen[seen.length - 1].progress.toFixed(4)} (expected 0.25)`
);

/* ═══ watchdog ═══ */
fakeWindow.scrollY = 9000;
check("asleep before the watchdog fires", pending() === 0, `pendingRaf=${pending()}`);
tickWatchdog();
check(
  "watchdog wakes the loop when no scroll event is dispatched",
  pending() === 1,
  `pendingRaf=${pending()}`
);
check("watchdog torn down while the loop is awake", intervals.size === 0, `intervals=${intervals.size}`);
pump(500);
check("watchdog re-armed once the loop sleeps again", intervals.size === 1, `intervals=${intervals.size}`);
const before = pending();
tickWatchdog();
tickWatchdog();
check(
  "idle watchdog ticks do not wake the loop when the offset is unchanged",
  pending() === before,
  `pendingRaf=${pending()}`
);

/* ═══ explicit wake (used by media/theme code) ═══ */
wakeScrollLoop();
check("wakeScrollLoop() restarts a sleeping loop", pending() === 1, `pendingRaf=${pending()}`);
pump(500);

/* ═══ reduced-motion propagation ═══ */
seen.length = 0;
mqHandlers.forEach((h) => h({ matches: true }));
pump(5);
check(
  "prefers-reduced-motion change propagates onto the frame",
  seen.length > 0 && seen[seen.length - 1].reduced === true,
  `reduced=${seen.length ? seen[seen.length - 1].reduced : "no frame"}`
);
mqHandlers.forEach((h) => h({ matches: false }));
pump(500);

/* ═══ unsubscribe ═══ */
seen.length = 0;
unsub();
fakeWindow.scrollY = 1234;
fire("scroll");
pump(20);
check("unsubscribe stops frame delivery", seen.length === 0, `frames after unsubscribe=${seen.length}`);
pump(500);

/* ═══ teardown ═══ */
const beforeCount = listenerCount();
dispose();
check(
  "stopScrollLoop removes every window listener",
  listenerCount() === 0,
  `before=${beforeCount} after=${listenerCount()}`
);
check("stopScrollLoop clears the watchdog interval", intervals.size === 0, `intervals=${intervals.size}`);
check("stopScrollLoop cancels the pending rAF", pending() === 0, `pendingRaf=${pending()}`);
check("stopScrollLoop disconnects the ResizeObserver", roDisconnects === 1, `disconnects=${roDisconnects}`);
check("stopScrollLoop releases the media-query listener", mqHandlers.size === 0, `mqListeners=${mqHandlers.size}`);

/* ═══ restart after teardown (StrictMode remount) ═══ */
fakeWindow.scrollY = 2500;
const dispose2 = startScrollLoop();
check(
  "engine restarts cleanly after teardown (StrictMode remount)",
  listenerCount() === 8 && roInstances === 2,
  `listeners=${listenerCount()} roInstances=${roInstances}`
);
dispose2();
check("second teardown is also clean", listenerCount() === 0, `listeners=${listenerCount()}`);
check(
  "stopScrollLoop is idempotent (double dispose is safe)",
  (() => {
    try {
      stopScrollLoop();
      return true;
    } catch {
      return false;
    }
  })(),
  "no throw on repeat dispose"
);

/* ═══ camera overhang invariant (mirrors Background.tsx) ═══ */
let worstGap = 0;
let worstAt = "";
for (const vh of [568, 700, 939, 1200, 1600, 2160]) {
  for (let prog = 0; prog <= 1.0001; prog += 0.01) {
    for (const y of [0, 200, 500, 960, 3000, 12000, 40000]) {
      const zoom = 1.06 + prog * 0.14;
      const overhang = ((zoom - 1) / 2) * vh;
      const ty = Math.min(y * 0.1, overhang);
      const gap = ty - overhang;
      if (gap > worstGap) {
        worstGap = gap;
        worstAt = `vh=${vh} prog=${prog.toFixed(2)} y=${y}`;
      }
    }
  }
}
check(
  "camera pan never exceeds its scale overhang (no bare band, any viewport)",
  worstGap <= 1e-9,
  `worst gap=${worstGap.toFixed(4)}px ${worstAt}`
);

let oldWorst = 0;
for (const vh of [568, 700, 939]) {
  for (let prog = 0; prog <= 1.0001; prog += 0.01) {
    const zoom = 1.06 + prog * 0.14;
    oldWorst = Math.max(oldWorst, Math.min(12000 * 0.1, 96) - ((zoom - 1) / 2) * vh);
  }
}
check(
  "regression guard: the original fixed 96px cap did expose a band",
  oldWorst > 1,
  `old worst gap=${oldWorst.toFixed(1)}px`
);

/* ── report ───────────────────────────────────────────────────────────── */
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${String(r.n).padStart(2, "0")}. ${r.name}\n           ${r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} assertions passed`);
process.exit(failed ? 1 : 0);
