import { useLang } from "../lib/i18n";
import { SURFACES } from "../lib/suite";
import { ModelBadge, Reveal } from "./ui";

/* ── Cross-modal handoff ──────────────────────────────────────────────────
   The point in the page where a container stops being a maritime problem and
   becomes a road one. Sits directly above the footer so the sea narrative ends
   by pointing at the surface that continues it.

   The status line is model data like everything else on this page, so it
   carries the same badge; a berth state presented bare would read as a live
   terminal feed.
────────────────────────────────────────────────────────────────────────── */

const COPY: Record<string, { tag: string; head: string; sub: string; status: string; cta: string }> = {
  en: {
    tag: "Intermodal handoff",
    head: "Cargo discharged at port? Seamless inland handshake.",
    sub: "The voyage record does not end at the quay. Container, booking and clearance references carry straight across to the road leg, so the truck that collects already knows what it is collecting.",
    status: "Port terminal berth clear · Instant transfer to FTL/LTL reefer fleet",
    cta: "Dispatch via YASLOGIST Land",
  },
  ar: {
    tag: "تسليم متعدد الوسائط",
    head: "وصول الشحنة للميناء؟ تسليم فوري لشبكة النقل البري.",
    sub: "سجل الرحلة لا ينتهي عند الرصيف. أرقام الحاوية والحجز والتخليص تنتقل مباشرة إلى المرحلة البرية، لتعرف الشاحنة التي تستلم ما الذي تستلمه بالضبط.",
    status: "الرصيف جاهز · تحويل فوري إلى أسطول الحمولات الكاملة والمجزأة والمبرّدة",
    cta: "أرسل عبر YASLOGIST البري",
  },
  zh: {
    tag: "多式联运无缝交接",
    head: "货物抵港卸船？即刻触发陆运干线接载。",
    sub: "货运航程并不终结于海港码头。集装箱号、订舱单及通关凭证直通公路干线，接载集卡在到场前已精准获知货况与装卸要求。",
    status: "码头泊位卸载完毕 · 即时转运至 FTL/LTL 重载及冷链车队",
    cta: "通过 YASLOGIST 陆运系统调度",
  },
  tr: {
    tag: "Çok modlu aktarma",
    head: "Yük limana indi mi? Karayolu ile kesintisiz el sıkışma.",
    sub: "Sefer kaydı rıhtımda bitmez. Konteyner, rezervasyon ve gümrükleme referansları doğrudan karayolu bacağına aktarılır; böylece teslim alan araç ne aldığını önceden bilir.",
    status: "Liman terminal rıhtımı boş · FTL/LTL frigofirik filoya anında transfer",
    cta: "YASLOGIST Kara Üzerinden Sevk Et",
  },
  fr: {
    tag: "Relais intermodal",
    head: "Cargaison déchargée au port ? Relais routier immédiat.",
    sub: "Le registre de voyage ne s'arrête pas au quai. Conteneur, réservation et références douanières sont transmis directement au tronçon routier : le camion de collecte sait exactement ce qu'il prend en charge.",
    status: "Poste à quai dégagé · Transfert instantané vers la flotte FTL/LTL réfrigérée",
    cta: "Expédier via YASLOGIST Terrestre",
  },
};

export default function CrossModalHandoff() {
  const { lang, dir } = useLang();
  const c = COPY[lang];
  const land = SURFACES.find((s) => s.id === "land")!;

  return (
    <section
      aria-label={c.tag}
      className="section-iso cv-auto relative px-8 pb-10 pt-4 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="glass-strong gpu relative overflow-hidden rounded-[1.75rem] p-8 sm:p-10">
            {/* Amber wash rather than the site's cyan: this block belongs to the
                surface it hands off to, and the colour is the first thing that
                says so. */}
            <div
              className="glow-wash pointer-events-none absolute -top-24 end-0 h-64 w-[32rem] max-w-full rounded-full"
              style={{ "--wash": "rgba(232, 179, 23, 0.12)" } as React.CSSProperties}
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.35fr_1fr]">
              <div>
                <p className="micro font-mono" style={{ color: land.accent }}>
                  {c.tag}
                </p>

                <h2 className="h2-display mt-4 max-w-2xl pb-1 font-display text-ice">
                  {c.head}
                </h2>

                <p className="sub-text mt-5 max-w-xl">{c.sub}</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Status strip */}
                <div
                  className="rounded-xl border p-4"
                  style={{ borderColor: `${land.accent}40`, background: `${land.accent}0f` }}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="relative mt-1 flex h-1.5 w-1.5 shrink-0">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                        style={{ background: land.accent }}
                      />
                      <span
                        className="relative inline-flex h-1.5 w-1.5 rounded-full"
                        style={{ background: land.accent }}
                      />
                    </span>
                    <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ice/75">
                      {c.status}
                    </p>
                  </div>
                  <div className="mt-3">
                    <ModelBadge short />
                  </div>
                </div>

                <a
                  href={land.href}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 font-display text-sm font-bold tracking-wide transition-all duration-300"
                  style={{ background: land.accent, color: "#10161C", boxShadow: `0 0 22px ${land.glow}` }}
                >
                  {c.cta}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Corner ticks, matching the engine panels. `dir` keeps them on the
                reading-order corners when the page mirrors. */}
            <div
              className="pointer-events-none absolute top-4 h-5 w-5 border-t border-neon/25"
              style={dir === "rtl" ? { left: "1rem", borderLeftWidth: 1 } : { right: "1rem", borderRightWidth: 1 }}
            />
            <div
              className="pointer-events-none absolute bottom-4 h-5 w-5 border-b border-neon/25"
              style={dir === "rtl" ? { right: "1rem", borderRightWidth: 1 } : { left: "1rem", borderLeftWidth: 1 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
