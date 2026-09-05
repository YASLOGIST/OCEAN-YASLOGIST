import { useLang } from "../lib/i18n";
import { CountUp, ModelBadge, Reveal } from "./ui";

/* Lanes that actually terminate at the gateways this surface covers. The
   previous set (Singapore→LA, Rotterdam→NY, Busan→Long Beach …) advertised a
   global liner network and contradicted the Egyptian-gateway positioning of
   every claim above it. */
const LANES = [
  { from: "Shanghai", to: "East Port Said", eta: "14:32" },
  { from: "Jebel Ali", to: "Sokhna", eta: "09:47" },
  { from: "Rotterdam", to: "Alexandria", eta: "22:10" },
  { from: "Istanbul", to: "Damietta", eta: "06:05" },
  { from: "Piraeus", to: "El Dekheila", eta: "18:26" },
  { from: "Jeddah", to: "Sokhna", eta: "11:58" },
];

export default function Stats() {
  const { t } = useLang();
  const stats = [
    { to: 5, suffix: "", label: t("stats.items.0.label"), note: t("stats.items.0.note") },
    { to: 7, suffix: "", label: t("stats.items.1.label"), note: t("stats.items.1.note") },
    { to: 60, suffix: "s", label: t("stats.items.2.label"), note: t("stats.items.2.note") },
    { to: 94.2, decimals: 1, suffix: "%", label: t("stats.items.3.label"), note: t("stats.items.3.note") },
  ];

  return (
    <section id="stats" className="relative px-8 pb-10 pt-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* These four tiles carry the page's headline figures — gateways covered,
            reference types stitched, AIS refresh, predictive ETA accuracy. They
            are model outputs, and the label sits above them rather than in a
            modal. (They previously read TEU moved / vessels / ports / on-time
            rate, which described a carrier rather than a software platform.) */}
        <Reveal>
          <div className="mb-4 flex justify-start">
            <ModelBadge />
          </div>
        </Reveal>
        <Reveal>
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
            {/* Below `sm` the tile padding and the figure both come down. The grid is
                `grid-cols-2` under `lg`, so at a 320px viewport each column is 127.5px
                while "99.98%" alone renders 132.4px at `text-4xl` — wider than the
                column before any padding — and the container's `overflow-hidden` cut
                it. 24px + p-4 needs 120.3px against 127.5px. `sm:` restores both. */}
            {stats.map((s, i) => (
              <div key={s.label} className="card-lift group relative bg-transparent p-4 transition-colors duration-500 hover:bg-chrome/[0.03] sm:p-8">
                <span className="absolute start-0 top-6 h-8 w-px bg-gradient-to-b from-neon/60 to-transparent" />
                <div className="font-display text-2xl font-bold tracking-tight text-ice sm:text-[2.7rem]">
                  <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix} />
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ghost">{s.label}</div>
                <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neon/70">{s.note}</div>
                {i < stats.length - 1 && (
                  <span className="absolute end-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-chrome/10 lg:block" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* live lane ticker */}
        <Reveal delay={150}>
          <div className="glass mask-x mt-6 overflow-hidden rounded-2xl py-4">
            <div className="animate-marquee flex w-max items-center gap-12 px-6">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center gap-12" aria-hidden={dup === 1}>
                  {LANES.map((l) => (
                    <div key={l.from} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ghost">
                      <span className="text-neon">{l.from}</span>
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-neon/50 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                      <span>{l.to}</span>
                      <span className="rounded-full border border-chrome/10 bg-chrome/[0.04] px-2.5 py-1 text-ice/70">
                        ETA {l.eta} UTC
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
