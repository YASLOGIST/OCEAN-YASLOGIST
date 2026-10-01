import { useEffect, useRef } from "react";
import { subscribeScroll } from "../lib/scroll";
import { useLang } from "../lib/i18n";
import { SURFACES } from "../lib/suite";
import { ModelBadge } from "./ui";

const COPY: Record<string, { tag: string; head: string; sub: string; status: string; cta: string; sea: string; port: string; land: string }> = {
  en: { tag: "Intermodal handoff", head: "Cargo discharged at port? Seamless inland handshake.", sub: "The voyage record does not end at the quay. Container, booking and clearance references carry straight across to the road leg, so the truck that collects already knows what it is collecting.", status: "Port terminal berth clear · Instant transfer to FTL/LTL reefer fleet", cta: "Dispatch via YASLOGIST Land", sea: "SEA LEG", port: "PORT HANDOFF", land: "LAND LEG" },
  ar: { tag: "تسليم متعدد الوسائط", head: "وصول الشحنة للميناء؟ تسليم فوري لشبكة النقل البري.", sub: "سجل الرحلة لا ينتهي عند الرصيف. أرقام الحاوية والحجز والتخليص تنتقل مباشرة إلى المرحلة البرية، لتعرف الشاحنة التي تستلم ما الذي تستلمه بالضبط.", status: "الرصيف جاهز · تحويل فوري إلى أسطول الحمولات الكاملة والمجزأة والمبرّدة", cta: "أرسل عبر YASLOGIST البري", sea: "المرحلة البحرية", port: "تسليم الميناء", land: "المرحلة البرية" },
  zh: { tag: "多式联运无缝交接", head: "货物抵港卸船？即刻触发陆运干线接载。", sub: "货运航程并不终结于海港码头。集装箱号、订舱单及通关凭证直通公路干线，接载集卡在到场前已精准获知货况与装卸要求。", status: "码头泊位卸载完毕 · 即时转运至 FTL/LTL 重载及冷链车队", cta: "通过 YASLOGIST 陆运系统调度", sea: "海运段", port: "港口交接", land: "陆运段" },
  tr: { tag: "Çok modlu aktarma", head: "Yük limana indi mi? Karayolu ile kesintisiz el sıkışma.", sub: "Sefer kaydı rıhtımda bitmez. Konteyner, rezervasyon ve gümrükleme referansları doğrudan karayolu bacağına aktarılır; böylece teslim alan araç ne aldığını önceden bilir.", status: "Liman terminal rıhtımı boş · FTL/LTL frigofirik filoya anında transfer", cta: "YASLOGIST Kara Üzerinden Sevk Et", sea: "DENİZ AYAĞI", port: "LİMAN AKTARIMI", land: "KARA AYAĞI" },
  fr: { tag: "Relais intermodal", head: "Cargaison déchargée au port ? Relais routier immédiat.", sub: "Le registre de voyage ne s'arrête pas au quai. Conteneur, réservation et références douanières sont transmis directement au tronçon routier : le camion de collecte sait exactement ce qu'il prend en charge.", status: "Poste à quai dégagé · Transfert instantané vers la flotte FTL/LTL réfrigérée", cta: "Expédier via YASLOGIST Terrestre", sea: "SEGMENT MER", port: "RELAIS PORT", land: "SEGMENT ROUTE" },
};

export default function CrossModalHandoff() {
  const { lang } = useLang();
  const c = COPY[lang];
  const land = SURFACES.find((s) => s.id === "land")!;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => subscribeScroll((f) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < -f.vh * 0.2 || r.top > f.vh * 1.2) return;
    if (f.reduced) {
      el.style.setProperty("--handoff-p", "0.5000");
      el.style.setProperty("--handoff-x", "50.00%");
      return;
    }
    const travel = Math.max(f.vh * 0.65, r.height - f.vh * 0.72);
    const p = Math.max(0, Math.min(1, (-r.top + f.vh * 0.18) / travel));
    el.style.setProperty("--handoff-p", p.toFixed(4));
    el.style.setProperty("--handoff-x", `${(8 + p * 84).toFixed(2)}%`);
  }), []);

  return (
    <section ref={sectionRef} aria-label={c.tag} className="handoff-chapter section-iso relative">
      <div className="handoff-sticky">
        <div className="handoff-world" aria-hidden>
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
                <div><small>LIVE HANDOFF STATE</small><p>{c.status}</p></div>
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
