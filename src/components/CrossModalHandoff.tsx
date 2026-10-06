import { useEffect, useRef } from "react";
import { subscribeScroll, wakeScrollLoop } from "../lib/scroll";
import { useLang } from "../lib/i18n";
import { SURFACES } from "../lib/suite";
import { ModelBadge } from "./ui";

type HandoffCopy = {
  tag: string;
  head: string;
  sub: string;
  statusLabel: string;
  status: string;
  cta: string;
  sea: string;
  port: string;
  land: string;
};

/* This is a capability narrative, not terminal telemetry. Keep the state
   explicitly hypothetical in every locale: the component must not imply a
   berth, fleet or shipment exists merely because its visual timeline moves. */
const COPY: Record<string, HandoffCopy> = {
  en: { tag: "Intermodal handoff", head: "Cargo discharged at port? Carry one record into the road leg.", sub: "The voyage record does not end at the quay. This scenario shows container, booking and clearance references prepared for the road leg, so collection can begin from the same shipment context.", statusLabel: "SIMULATED HANDOFF STATE", status: "Quay event modelled · references ready for road dispatch", cta: "Explore YASLOGIST Land", sea: "SEA LEG", port: "PORT HANDOFF", land: "LAND LEG" },
  ar: { tag: "تسليم متعدد الوسائط", head: "وصول الشحنة للميناء؟ سجل واحد يواصل المرحلة البرية.", sub: "سجل الرحلة لا ينتهي عند الرصيف. يوضح هذا السيناريو تجهيز مراجع الحاوية والحجز والتخليص للمرحلة البرية، لتبدأ عملية الاستلام من سياق الشحنة نفسه.", statusLabel: "حالة تسليم ضمن المحاكاة", status: "تمت نمذجة حدث الرصيف · المراجع جاهزة لسيناريو الإرسال البري", cta: "استكشف YASLOGIST البري", sea: "المرحلة البحرية", port: "تسليم الميناء", land: "المرحلة البرية" },
  zh: { tag: "多式联运交接", head: "货物抵港卸船？同一记录延续至陆运段。", sub: "货运记录并不终结于码头。本场景演示如何为陆运段准备集装箱号、订舱及通关参考信息，让提货流程沿用同一票货运上下文。", statusLabel: "模拟交接状态", status: "码头事件已建模 · 参考信息已准备进入陆运调度场景", cta: "探索 YASLOGIST 陆运", sea: "海运段", port: "港口交接", land: "陆运段" },
  tr: { tag: "Çok modlu aktarma", head: "Yük limana indi mi? Aynı kayıt karayolu ayağına devam eder.", sub: "Sefer kaydı rıhtımda bitmez. Bu senaryo konteyner, rezervasyon ve gümrük referanslarının karayolu ayağı için nasıl hazırlandığını gösterir; teslim alma aynı gönderi bağlamından başlayabilir.", statusLabel: "SİMÜLE AKTARMA DURUMU", status: "Rıhtım olayı modellendi · referanslar karayolu sevk senaryosuna hazır", cta: "YASLOGIST Karayolu'nu Keşfet", sea: "DENİZ AYAĞI", port: "LİMAN AKTARIMI", land: "KARA AYAĞI" },
  fr: { tag: "Relais intermodal", head: "Cargaison déchargée au port ? Un même registre poursuit le trajet routier.", sub: "Le registre de voyage ne s'arrête pas au quai. Ce scénario montre comment préparer les références du conteneur, de la réservation et du dédouanement pour le segment routier, dans le même contexte d'expédition.", statusLabel: "ÉTAT DE RELAIS SIMULÉ", status: "Événement à quai modélisé · références prêtes pour le scénario routier", cta: "Explorer YASLOGIST Terrestre", sea: "SEGMENT MER", port: "RELAIS PORT", land: "SEGMENT ROUTE" },
};

function prefersStaticMedia() {
  if (typeof window === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true;
}

export default function CrossModalHandoff() {
  const { lang } = useLang();
  const c = COPY[lang];
  const land = SURFACES.find((s) => s.id === "land")!;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handoffProgressRef = useRef(0);
  const nearbyRef = useRef(false);
  const geometryRef = useRef({ top: 0, height: 0, ready: false });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const mobilePlayback = useRef(typeof window !== "undefined" && window.matchMedia("(max-width: 767px), (pointer: coarse)").matches).current;
  /* A motion-reduced or Save-Data session keeps the supplied poster and skips
     the 48-frame sequence entirely. Loading every frame for a static composed
     state wastes both transfer and decoded-image memory without changing what
     that user sees. */
  const staticPlayback = useRef(prefersStaticMedia()).current;
  const frameCount = 48;
  const frameWidth = mobilePlayback ? 960 : 1440;
  const frameHeight = mobilePlayback ? 540 : 810;
  const assetBase = import.meta.env.BASE_URL;
  const frameBase = `${assetBase}media/${mobilePlayback ? "handoff-frames-mobile" : "handoff-frames"}/`;
  const frameStateRef = useRef({
    started: false,
    imgs: [] as HTMLImageElement[],
    loaded: [] as boolean[],
    anyLoaded: false,
    queue: [] as number[],
    inFlight: 0,
  });
  const drawRef = useRef<(progress: number) => void>(() => {});

  drawRef.current = (progress: number) => {
    const canvas = canvasRef.current;
    const state = frameStateRef.current;
    if (!canvas || document.hidden || !state.anyLoaded) return;
    const ctx = ctxRef.current ?? canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;
    const pos = Math.max(0, Math.min(1, progress)) * (frameCount - 1);
    const i0 = Math.floor(pos);
    const i1 = Math.min(frameCount - 1, i0 + 1);
    const nearest = (target: number) => {
      if (state.loaded[target]) return target;
      for (let d = 1; d < frameCount; d++) {
        if (target - d >= 0 && state.loaded[target - d]) return target - d;
        if (target + d < frameCount && state.loaded[target + d]) return target + d;
      }
      return -1;
    };
    const a = nearest(i0);
    if (a < 0) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(state.imgs[a], 0, 0, frameWidth, frameHeight);
    const mix = pos - i0;
    if (mix > 0.015) {
      const b = nearest(i1);
      if (b >= 0 && b !== a) {
        ctx.globalAlpha = mix;
        ctx.drawImage(state.imgs[b], 0, 0, frameWidth, frameHeight);
        ctx.globalAlpha = 1;
      }
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const state = frameStateRef.current;
    let disposed = false;

    const pump = () => {
      if (disposed || document.hidden || !nearbyRef.current) return;
      while (state.inFlight < 4 && state.queue.length) {
        const index = state.queue.shift()!;
        state.inFlight++;
        const img = new Image();
        img.decoding = "async";
        img.setAttribute("fetchpriority", index < 3 ? "high" : "low");
        img.onload = async () => {
          try { await img.decode(); } catch { /* loaded images remain drawable */ }
          if (!disposed && img.naturalWidth) {
            state.loaded[index] = true;
            state.anyLoaded = true;
            drawRef.current(handoffProgressRef.current);
          }
          state.inFlight--;
          pump();
        };
        img.onerror = () => { state.inFlight--; pump(); };
        state.imgs[index] = img;
        img.src = `${frameBase}${String(index + 1).padStart(3, "0")}.jpg`;
      }
    };

    const startFrames = () => {
      if (state.started) { pump(); return; }
      state.started = true;
      state.imgs = new Array(frameCount);
      state.loaded = new Array(frameCount).fill(false);
      state.anyLoaded = false;
      // Spread early decodes across the timeline so a fast jump still finds a
      // nearby frame, then fill every gap.
      const seen = new Set<number>();
      const order: number[] = [];
      for (const i of [0, frameCount - 1, Math.floor(frameCount / 2), Math.floor(frameCount / 4), Math.floor(frameCount * 3 / 4)]) {
        if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
      for (let gap = 8; gap >= 1; gap >>= 1) {
        for (let i = 0; i < frameCount; i += gap) {
          if (!seen.has(i)) { seen.add(i); order.push(i); }
        }
      }
      for (let i = 0; i < frameCount; i++) if (!seen.has(i)) order.push(i);
      state.queue = order;
      pump();
    };

    const nearby = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(([entry]) => {
          nearbyRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            geometryRef.current = {
              top: entry.boundingClientRect.top + window.scrollY,
              height: entry.boundingClientRect.height,
              ready: true,
            };
            if (!staticPlayback) startFrames();
            wakeScrollLoop();
          }
        }, { rootMargin: "125% 0px" })
      : undefined;
    const refreshGeometry = () => {
      const rect = section.getBoundingClientRect();
      geometryRef.current = { top: rect.top + window.scrollY, height: rect.height, ready: true };
    };
    if (nearby) nearby.observe(section);
    else {
      nearbyRef.current = true;
      refreshGeometry();
      if (!staticPlayback) startFrames();
    }

    const sectionResize = typeof ResizeObserver === "function"
      ? new ResizeObserver(refreshGeometry)
      : undefined;
    sectionResize?.observe(section);
    window.addEventListener("resize", refreshGeometry, { passive: true });
    const resume = () => { if (!document.hidden && nearbyRef.current) { refreshGeometry(); pump(); drawRef.current(handoffProgressRef.current); } };
    document.addEventListener("visibilitychange", resume);
    return () => {
      disposed = true;
      nearby?.disconnect();
      sectionResize?.disconnect();
      window.removeEventListener("resize", refreshGeometry);
      document.removeEventListener("visibilitychange", resume);
      nearbyRef.current = false;
    };
  }, [frameBase, frameCount, staticPlayback]);

  useEffect(() => subscribeScroll((f) => {
    const el = sectionRef.current;
    if (!el || !nearbyRef.current || document.hidden) return;
    const geometry = geometryRef.current;
    if (!geometry.ready) return;
    const top = geometry.top - f.raw;
    const bottom = top + geometry.height;
    if (bottom < -f.vh * 0.2 || top > f.vh * 1.2) return;
    if (f.reduced) {
      el.style.setProperty("--handoff-p", "0.5000");
      el.style.setProperty("--handoff-x", "50.00%");
      handoffProgressRef.current = 0.5;
      drawRef.current(0.5);
      return;
    }
    const travel = Math.max(f.vh * 0.65, geometry.height - f.vh * 0.72);
    const p = Math.max(0, Math.min(1, (-top + f.vh * 0.18) / travel));
    handoffProgressRef.current = p;
    el.style.setProperty("--handoff-p", p.toFixed(4));
    el.style.setProperty("--handoff-x", `${(8 + p * 84).toFixed(2)}%`);
    drawRef.current(p);
  }), []);

  return (
    <section ref={sectionRef} aria-label={c.tag} className="handoff-chapter section-iso relative">
      <div className="handoff-sticky">
        <div className="handoff-world" aria-hidden>
          <img
            className="handoff-bg-video handoff-bg-poster"
            src={`${assetBase}media/intermodal-handoff-poster.jpg`}
            alt=""
            draggable={false}
          />
          <canvas
            ref={canvasRef}
            width={frameWidth}
            height={frameHeight}
            className={`handoff-bg-video handoff-bg-canvas${staticPlayback ? " hidden" : ""}`}
            aria-hidden
          />
          <div className="handoff-video-veil" />
          <div className="handoff-sea-field"><i /><i /><i /><i /></div>
          <div className="handoff-port-silhouette"><span /><span /><span /></div>
          <div className="handoff-land-field"><i /><i /><i /></div>
          <div className="handoff-corridor">
            <span className="handoff-progress-line" />
            <span className="handoff-cargo-beacon"><b>YL</b><i /></span>
          </div>
          <div className="handoff-stage-labels"><span>{c.sea}</span><span>{c.port}</span><span>{c.land}</span></div>
        </div>

        <div className="handoff-console handoff-console-v3 glass-strong gpu">
          <div className="handoff-content-grid">
            <div className="handoff-copy-v3">
              <p className="handoff-kicker">{c.tag}</p>
              <h2 className="handoff-title-v3">{c.head}</h2>
              <p className="handoff-sub-v3">{c.sub}</p>
              <div className="handoff-proof-row">
                <span><i className="sea" />{c.sea}</span>
                <span><i className="port" />{c.port}</span>
                <span><i className="land" />{c.land}</span>
              </div>
            </div>

            <div className="handoff-action-v3">
              <div className="handoff-transfer-state">
                <div className="handoff-transfer-icon" aria-hidden><span /><i /></div>
                <div><small>{c.statusLabel}</small><p>{c.status}</p></div>
                <ModelBadge short className="handoff-model-badge" />
              </div>
              <a href={land.href} className="handoff-cta-v3 group" style={{ "--land-accent": land.accent, "--land-glow": land.glow } as React.CSSProperties}>
                <span>{c.cta}</span>
                <i aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
