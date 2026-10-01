import { useLang } from "../lib/i18n";

export default function VoyageProfile() {
  const { t, lang } = useLang();
  const n = (k: string) => t(`pillars.3.notes.${k}`);
  const L = (en: string, ar: string, zh?: string, tr?: string, fr?: string) => {
    if (lang === "ar") return ar;
    if (lang === "zh" && zh) return zh;
    if (lang === "tr" && tr) return tr;
    if (lang === "fr" && fr) return fr;
    return en;
  };
  const refs = [
    { label: n("ref0"), bad: false, x: 18, y: 28, code: "BK" },
    { label: n("ref1"), bad: false, x: 82, y: 22, code: "BL" },
    { label: n("ref2"), bad: false, x: 86, y: 75, code: "CT" },
    { label: n("ref3"), bad: true, x: 18, y: 78, code: "AC" },
    { label: n("ref4"), bad: false, x: 50, y: 92, code: "GP" },
  ];

  return (
    <div className="reference-command">
      <div className="reference-command-head">
        <div>
          <p className="reference-overline">{n("head")}</p>
          <p className="reference-subline">{L("One shipment identity · five linked references", "هوية شحنة واحدة · خمسة مراجع مترابطة", "一个货运身份 · 五个关联参考", "Tek sevkiyat kimliği · beş bağlı referans", "Une identité d'expédition · cinq références liées")}</p>
        </div>
        <div className="reference-score"><strong>4/5</strong><span>{L("aligned", "متطابق", "已对齐", "eşleşti", "alignés")}</span></div>
      </div>

      <div className="reference-graph" role="img" aria-label={L("Shipment reference reconciliation graph", "مخطط مطابقة مراجع الشحنة")}>
        <div className="reference-grid" aria-hidden />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {refs.map((r) => (
            <line key={r.code} x1="50" y1="52" x2={r.x} y2={r.y} className={r.bad ? "reference-link bad" : "reference-link ok"} />
          ))}
        </svg>
        <div className="reference-core-node">
          <span className="reference-core-orbit" aria-hidden />
          <b>SHIPMENT</b>
          <strong>YL-SEA-118</strong>
          <small>{L("identity core", "هوية مركزية", "身份核心", "kimlik çekirdeği", "noyau d'identité")}</small>
        </div>
        {refs.map((r) => (
          <div
            key={r.code}
            className={`reference-satellite reference-satellite-${r.code.toLowerCase()} ${r.bad ? "is-bad" : "is-ok"}`}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
          >
            <i>{r.code}</i>
            <div><strong>{r.label}</strong><small>{r.bad ? n("flag") : n("ok")}</small></div>
          </div>
        ))}
        <span className="reference-scan" aria-hidden />
      </div>

      <div className="reference-event-strip">
        <span className="reference-event-icon">!</span>
        <div><small>{L("Mismatch isolated", "تم عزل عدم التطابق", "已隔离不匹配", "Uyumsuzluk ayrıştırıldı", "Écart isolé")}</small><strong>{n("ref3")}</strong></div>
        <p>{n("flag")}</p>
      </div>

      <div className="reference-command-footer">
        <span><b>{n("countV")}</b>{n("countK")}</span>
        <p>{n("foot")}</p>
      </div>
    </div>
  );
}
