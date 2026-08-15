import type { CSSProperties, ReactNode } from "react";
import { useLang } from "../lib/i18n";
import { cn } from "../utils/cn";
import BlockchainSection from "./BlockchainSection";
import FleetRadar from "./FleetRadar";
import FulfillmentBay from "./FulfillmentBay";
import NeuralForecast from "./NeuralForecast";
import VoyageProfile from "./VoyageProfile";
import { CheckIcon, CountUp, GlassCard, Parallax, Reveal, SectionTag } from "./ui";

/* ═══════════════════════════ shared panel ═══════════════════════════ */

function Panel({ title, status, children }: { title: string; status: string; children: ReactNode }) {
  return (
    <GlassCard strong className="clip-angled card-pad relative overflow-hidden">
      <div className="card-head">
        <div className="card-head-title">{title}</div>
        <div className="live-eyebrow live-eyebrow-ok">
          <span className="live-dot live-dot-ok" />
          {status}
        </div>
      </div>
      <div className="relative">{children}</div>
      <div className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r border-t border-neon/30" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b border-l border-neon/30" />
    </GlassCard>
  );
}

/* ═══════════════════════ 01 · AI ANALYTICS ══════════════════════════ */

function VisualAnalytics() {
  const { t } = useLang();
  return (
    <Panel title={t("pillars.0.panel.title")} status={t("pillars.0.panel.status")}>
      <NeuralForecast />
    </Panel>
  );
}

/* ════════════════════════ 02 · IOT FLEET ════════════════════════════ */

const FLEET_ROWS = [
  { id: "IQ-4271", route: "SIN → LAX", speed: "18.6 kn", temp: "24°C", load: "92%" },
  { id: "IQ-3188", route: "ROT → NYC", speed: "21.2 kn", temp: "21°C", load: "78%" },
  { id: "IQ-5094", route: "SHA → DBN", speed: "17.9 kn", temp: "26°C", load: "85%" },
];

function VisualFleet() {
  const { t } = useLang();
  const n = (k: string) => t(`pillars.1.notes.${k}`);
  return (
    <Panel title={t("pillars.1.panel.title")} status={t("pillars.1.panel.status")}>
      <FleetRadar />

      <div className="mt-5 space-y-2">
        <div className="grid grid-cols-6 gap-3 px-3.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ghost/70">
          <span className="col-span-2">{n("vessel")}</span>
          <span className="hidden sm:block">{n("route")}</span>
          <span>{n("speed")}</span>
          <span className="hidden md:block">{n("temp")}</span>
          <span className="text-end">{n("load")}</span>
        </div>
        {FLEET_ROWS.map((r) => (
          <div key={r.id} className="grid grid-cols-6 items-center gap-3 rounded-lg border border-chrome/5 bg-chrome/[0.03] px-3.5 py-2.5 font-mono text-[10px]">
            <span className="col-span-2 flex items-center gap-2.5 text-ice">
              <span className="glow-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {r.id}
            </span>
            <span className="hidden text-ghost sm:block">{r.route}</span>
            <span className="text-neon">{r.speed}</span>
            <span className="hidden text-ghost md:block">{r.temp}</span>
            <span className="flex justify-end">
              <span className="block h-1 w-14 overflow-hidden rounded bg-chrome/10">
                <span className="grad-bar block h-full rounded" style={{ width: r.load }} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ═══════════════════════ 03 · WAREHOUSING ═══════════════════════════ */

function VisualWarehouse() {
  const { t } = useLang();
  return (
    <Panel title={t("pillars.2.panel.title")} status={t("pillars.2.panel.status")}>
      <FulfillmentBay />
    </Panel>
  );
}

/* ═══════════════════════ 04 · GREEN CHAIN ════════════════════════════ */

function VisualGreen() {
  const { t } = useLang();
  return (
    <Panel title={t("pillars.3.panel.title")} status={t("pillars.3.panel.status")}>
      <VoyageProfile />
    </Panel>
  );
}

/* ═══════════════════════ 05 · BLOCKCHAIN ════════════════════════════ */
/* The Section-05 visual now lives in its own file, ./BlockchainSection.tsx. */

/* ═══════════════════════════ section renderer ═══════════════════════════ */

type Pillar = {
  id: string;
  index: string;
  tag: string;
  pre: string;
  accent: string;
  post: string;
  desc: string;
  bullets: string[];
  chips: string[];
  stat: { to: number; decimals?: number; suffix: string; label: string };
  visual: ReactNode;
};

function PillarSection({ p, flip }: { p: Pillar; flip: boolean }) {
  return (
    <section id={p.id} className="section-iso cv-auto cv-screen section-pad relative flex min-h-screen items-center overflow-hidden">
      <span
        aria-hidden
        className="watermark pointer-events-none absolute -top-6 start-2 select-none font-display text-[8rem] font-bold leading-none sm:-top-10 sm:text-[13rem]"
      >
        {p.index}
      </span>
      <div className="pointer-events-none absolute inset-0">
        {/* R1: radial-gradient wash, not a blurred circle — same glow, no
            element filter and therefore no promoted compositor layer. Sized
            up from h-80/w-80 to cover the spread the 64px blur produced
            beyond the old box. */}
        <div
          className={cn("glow-wash absolute top-1/4 h-[28rem] w-[28rem] rounded-full", flip ? "right-[2%]" : "left-0")}
          style={{ "--wash": "rgba(34, 228, 255, 0.07)" } as CSSProperties}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:px-10">
        <Reveal className={cn("lg:col-span-5", flip && "lg:order-2")}>
          <SectionTag>{p.tag}</SectionTag>
          <h2 className="h2-display mt-6 pb-1 font-display text-ice">
            {p.pre}
            <span className="text-accent-grad text-glow">{p.accent}</span>
            {p.post}
          </h2>
          <p className="sub-text mt-7">{p.desc}</p>

          <ul className="mt-8 space-y-3.5">
            {p.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-ice/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-neon/30 bg-neon/10 text-neon">
                  <CheckIcon />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {p.chips.map((c) => (
              <span key={c} className="chip rounded-full px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em]">
                {c}
              </span>
            ))}
          </div>

          <div className="mt-9 inline-flex items-end gap-3 border-s-2 border-neon/40 ps-5">
            <span className="text-glow font-display text-4xl font-bold text-neon sm:text-5xl">
              <CountUp to={p.stat.to} decimals={p.stat.decimals ?? 0} suffix={p.stat.suffix} />
            </span>
            <span className="pb-1.5 font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-ghost">
              {p.stat.label}
            </span>
          </div>
        </Reveal>

        <div className={cn("lg:col-span-7", flip && "lg:order-1")}>
          <Reveal from={flip ? "left" : "right"} delay={150}>
            {/* `anchor` is mandatory here: these sections repeat down the page
                with alternating speed signs, and the unanchored mode would
                converge adjacent cards without bound. */}
            <Parallax anchor speed={flip ? 0.05 : -0.05}>
              {p.visual}
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ exports ═════════════════════════════════ */

export default function Pillars() {
  const { t } = useLang();

  const pillars: Pillar[] = [
    {
      id: "p1",
      index: "01",
      tag: t("pillars.0.tag"),
      pre: t("pillars.0.pre"),
      accent: t("pillars.0.accent"),
      post: t("pillars.0.post"),
      desc: t("pillars.0.desc"),
      bullets: [
        t("pillars.0.bullets.0"),
        t("pillars.0.bullets.1"),
        t("pillars.0.bullets.2"),
      ],
      chips: [
        t("pillars.0.chips.0"),
        t("pillars.0.chips.1"),
        t("pillars.0.chips.2"),
      ],
      stat: { to: 94.2, decimals: 1, suffix: "%", label: t("pillars.0.statLabel") },
      visual: <VisualAnalytics />,
    },
    {
      id: "p2",
      index: "02",
      tag: t("pillars.1.tag"),
      pre: t("pillars.1.pre"),
      accent: t("pillars.1.accent"),
      post: t("pillars.1.post"),
      desc: t("pillars.1.desc"),
      bullets: [
        t("pillars.1.bullets.0"),
        t("pillars.1.bullets.1"),
        t("pillars.1.bullets.2"),
      ],
      chips: [
        t("pillars.1.chips.0"),
        t("pillars.1.chips.1"),
        t("pillars.1.chips.2"),
      ],
      stat: { to: 2148, suffix: "", label: t("pillars.1.statLabel") },
      visual: <VisualFleet />,
    },
    {
      id: "p3",
      index: "03",
      tag: t("pillars.2.tag"),
      pre: t("pillars.2.pre"),
      accent: t("pillars.2.accent"),
      post: t("pillars.2.post"),
      desc: t("pillars.2.desc"),
      bullets: [
        t("pillars.2.bullets.0"),
        t("pillars.2.bullets.1"),
        t("pillars.2.bullets.2"),
      ],
      chips: [
        t("pillars.2.chips.0"),
        t("pillars.2.chips.1"),
        t("pillars.2.chips.2"),
      ],
      stat: { to: 12480, suffix: "", label: t("pillars.2.statLabel") },
      visual: <VisualWarehouse />,
    },
    {
      id: "p4",
      index: "04",
      tag: t("pillars.3.tag"),
      pre: t("pillars.3.pre"),
      accent: t("pillars.3.accent"),
      post: t("pillars.3.post"),
      desc: t("pillars.3.desc"),
      bullets: [
        t("pillars.3.bullets.0"),
        t("pillars.3.bullets.1"),
        t("pillars.3.bullets.2"),
      ],
      chips: [
        t("pillars.3.chips.0"),
        t("pillars.3.chips.1"),
        t("pillars.3.chips.2"),
      ],
      stat: { to: 42, suffix: "%", label: t("pillars.3.statLabel") },
      visual: <VisualGreen />,
    },
    {
      id: "p5",
      index: "05",
      tag: t("pillars.4.tag"),
      pre: t("pillars.4.pre"),
      accent: t("pillars.4.accent"),
      post: t("pillars.4.post"),
      desc: t("pillars.4.desc"),
      bullets: [
        t("pillars.4.bullets.0"),
        t("pillars.4.bullets.1"),
        t("pillars.4.bullets.2"),
      ],
      chips: [
        t("pillars.4.chips.0"),
        t("pillars.4.chips.1"),
        t("pillars.4.chips.2"),
      ],
      stat: { to: 2.1, decimals: 1, suffix: "s", label: t("pillars.4.statLabel") },
      visual: <BlockchainSection />,
    },
  ];

  return (
    <div className="relative">
      {/* intro */}
      <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-32 text-center">
        <Reveal>
          <SectionTag>{t("pillarsIntro.tag")}</SectionTag>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="h2-display mt-6 font-display text-ice">
            {t("pillarsIntro.title1")}
            <br />
            <span className="text-accent-grad text-glow">{t("pillarsIntro.title2")}</span>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="sub-text mx-auto mt-5">{t("pillarsIntro.sub")}</p>
        </Reveal>
      </div>

      {pillars.map((p, i) => (
        <PillarSection key={p.id} p={p} flip={i % 2 === 1} />
      ))}
    </div>
  );
}
