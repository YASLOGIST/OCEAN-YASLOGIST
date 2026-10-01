import { useLang } from "../lib/i18n";

/* Gateway command view: the five Egyptian sea gateways read as a harbour
   pressure surface rather than a conventional table. The geometry is still
   deterministic illustrative data; motion only visualises queue pressure. */
type Gate = { en: string; ar: string; zh: string; tr: string; fr: string; berths: number; used: number; queue: number; warn: boolean };

const GATES: Gate[] = [
  { en: "Alexandria", ar: "الإسكندرية", zh: "亚历山大港", tr: "İskenderiye", fr: "Alexandrie", berths: 3, used: 3, queue: 2, warn: true },
  { en: "El Dekheila", ar: "الدخيلة", zh: "德海拉港", tr: "El Dekheila", fr: "El Dekheila", berths: 2, used: 1, queue: 0, warn: false },
  { en: "Damietta", ar: "دمياط", zh: "杜姆亚特港", tr: "Dimyat", fr: "Damiette", berths: 3, used: 2, queue: 1, warn: false },
  { en: "E. Port Said", ar: "شرق بورسعيد", zh: "塞得东港", tr: "Doğu Port Said", fr: "Port-Saïd Est", berths: 4, used: 3, queue: 1, warn: false },
  { en: "Ain Sokhna", ar: "السخنة", zh: "艾因苏赫奈港", tr: "Ayn Suhna", fr: "Ain Sokhna", berths: 2, used: 2, queue: 3, warn: true },
];

export default function FleetRadar() {
  const { lang } = useLang();
  const L = (en: string, ar: string, zh?: string, tr?: string, fr?: string) => {
    if (lang === "ar") return ar;
    if (lang === "zh" && zh) return zh;
    if (lang === "tr" && tr) return tr;
    if (lang === "fr" && fr) return fr;
    return en;
  };
  const totalBerths = GATES.reduce((n, g) => n + g.berths, 0);
  const used = GATES.reduce((n, g) => n + g.used, 0);
  const queued = GATES.reduce((n, g) => n + g.queue, 0);
  const pressure = Math.round((queued / Math.max(1, totalBerths)) * 100);

  return (
    <div className="berth-command">
      <div className="berth-overview">
        <div className="berth-pressure" style={{ "--pressure": `${pressure}%` } as React.CSSProperties}>
          <div className="berth-pressure-ring">
            <span className="tabular">{pressure}</span><small>%</small>
          </div>
          <div>
            <p className="berth-overline">{L("Network pressure", "ضغط الشبكة", "网络压力", "Ağ basıncı", "Pression réseau")}</p>
            <p className="berth-overview-copy">{L("Five gateways resolved as one quay-pressure picture.", "خمسة منافذ في صورة موحدة لضغط الأرصفة.", "五大港口统一呈现泊位压力。", "Beş liman tek rıhtım baskısı görünümünde.", "Cinq ports dans une vue unique de pression à quai.")}</p>
          </div>
        </div>
        <div className="berth-network-kpis" role="group" aria-label="Gateway network summary">
          <span><b>{GATES.length}</b>{L("gateways", "منافذ", "港口", "liman", "ports")}</span>
          <span><b>{used}/{totalBerths}</b>{L("occupied", "مشغول", "占用", "dolu", "occupés")}</span>
          <span><b>{queued}</b>{L("waiting", "منتظر", "候泊", "bekleyen", "en attente")}</span>
        </div>
      </div>

      <div className="berth-harbour" role="list" aria-label={L("Gateway berth pressure", "ضغط أرصفة المنافذ")}>
        <div className="berth-water-grid" aria-hidden />
        <div className="berth-quay-spine" aria-hidden><span /></div>
        {GATES.map((g, index) => (
          <div key={g.en} className={`berth-lane ${g.warn ? "is-warning" : "is-clear"}`} role="listitem">
            <div className="berth-lane-id">
              <span className="berth-lane-index">0{index + 1}</span>
              <strong>{L(g.en, g.ar, g.zh, g.tr, g.fr)}</strong>
              <small>{g.warn ? L("QUEUE BUILDING", "طابور يتراكم", "队列增长", "KUYRUK ARTIYOR", "FILE EN HAUSSE") : L("FLOW NOMINAL", "تدفق منتظم", "流量正常", "AKIŞ NORMAL", "FLUX NOMINAL")}</small>
            </div>

            <div className="berth-lane-water" aria-hidden>
              <span className="berth-lane-route" />
              <span className="berth-vessel berth-vessel-main"><i /></span>
              {Array.from({ length: g.queue }).map((_, i) => (
                <span key={i} className="berth-vessel berth-vessel-wait" style={{ "--q": i } as React.CSSProperties}><i /></span>
              ))}
            </div>

            <div className="berth-lane-quay">
              <div className="berth-slot-bank" role="group" aria-label={`${g.used} of ${g.berths} berths occupied`}>
                {Array.from({ length: g.berths }).map((_, i) => (
                  <span key={i} className={i < g.used ? "is-used" : "is-free"}><i /></span>
                ))}
              </div>
              <div className="berth-queue-readout">
                <span className="tabular">{g.queue ? `+${g.queue}` : "—"}</span>
                <em>{g.warn ? L("pressure", "ضغط", "压力", "baskı", "pression") : L("clear", "منتظم", "通畅", "açık", "dégagé")}</em>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="berth-footer-line">
        <span><i className="is-live" /> AIS · SAMPLE</span>
        <span><i className="is-terminal" /> {L("terminal status", "حالة المحطة", "码头状态", "terminal durumu", "statut terminal")}</span>
        <p>{L("Queue pressure is surfaced before the demurrage clock starts.", "يظهر ضغط الانتظار قبل بدء عداد الأرضيات.", "在滞期计时开始前显示排队压力。", "Kuyruk baskısı demoraj saati başlamadan görünür.", "La pression d'attente apparaît avant le début des surestaries.")}</p>
      </div>
    </div>
  );
}
