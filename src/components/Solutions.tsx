import { useLang } from "../lib/i18n";
import { Reveal, SectionTag } from "./ui";

const ICONS = [
  // empty container repositioning
  <svg key="i0" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    <path d="M8 3.5 12 6l4-2.5" opacity="0.5" />
  </svg>,
  // port congestion
  <svg key="i1" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>,
  // cold chain
  <svg key="i2" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8m0 0-4 4m4-4 4 4m-8 2h8" />
    <path d="M12 14v8m0 0-3-3m3 3 3-3" />
    <path d="M6 6c3 0 6 0 6-3 0 3 3 3 6 3" opacity="0.6" />
  </svg>,
  // paperwork
  <svg key="i3" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h4" />
  </svg>,
  // fraud
  <svg key="i4" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>,
];

/* One accent per engine, used semantically — the card's hue identifies which
   engine solves that bottleneck, matching the pillar it links to. It tints only
   the icon, the hairline rule and the metric; body copy and surface stay on the
   shared palette so the five read as one system. */
const ACCENTS = [
  { rule: "rgba(34,211,238,0.55)", tint: "rgba(34,211,238,0.10)", ring: "rgba(34,211,238,0.30)", text: "text-cyan-300" },
  { rule: "rgba(56,189,248,0.55)", tint: "rgba(56,189,248,0.10)", ring: "rgba(56,189,248,0.30)", text: "text-sky-300" },
  { rule: "rgba(167,139,250,0.55)", tint: "rgba(167,139,250,0.10)", ring: "rgba(167,139,250,0.30)", text: "text-violet-300" },
  { rule: "rgba(52,211,153,0.55)", tint: "rgba(52,211,153,0.10)", ring: "rgba(52,211,153,0.30)", text: "text-emerald-300" },
  { rule: "rgba(96,165,250,0.55)", tint: "rgba(96,165,250,0.10)", ring: "rgba(96,165,250,0.30)", text: "text-blue-300" },
] as const;

export default function Solutions() {
  const { t } = useLang();

  return (
    <section id="solutions" className="cv-auto section-pad relative scroll-mt-24">
      <div className="relative z-[var(--z-section-content)] mx-auto max-w-7xl">
        <div className="text-center">
          <Reveal>
            <SectionTag>{t("solutions.tag")}</SectionTag>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h2-display mt-6 pb-1 text-ice">
              {t("solutions.title1")}{" "}
              <span className="text-accent-grad text-glow">{t("solutions.title2")}</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="sub-text mx-auto mt-7">{t("solutions.sub")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ACCENTS.map((a, i) => (
            <Reveal key={i} delay={i * 90} from="up">
              <article
                className="solution-card glass group relative flex h-full flex-col rounded-2xl p-6"
                style={{ ["--accent-rule" as string]: a.rule, ["--accent-ring" as string]: a.ring }}
              >
                {/* semantic hairline — the only always-on colour on the card */}
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px" style={{ background: a.rule }} aria-hidden />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover:scale-105"
                    style={{ borderColor: a.ring, background: a.tint, color: a.rule }}
                  >
                    {ICONS[i]}
                  </span>
                  <span className="tabular font-mono text-[10px] text-ghost/50">0{i + 1}</span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-ice">
                  {t(`solutions.items.${i}.title`)}
                </h3>
                <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ghost">
                  {t(`solutions.items.${i}.desc`)}
                </p>

                <div className="mt-5 border-t border-chrome/10 pt-4">
                  <div className={`tabular font-display text-3xl font-bold ${a.text}`}>
                    {t(`solutions.items.${i}.metric`)}
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-ghost">
                    {t(`solutions.items.${i}.metricLabel`)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
