import { useLang } from "../lib/i18n";

const TEMPS = [5, 5.5, 4.8, 6, 5.2, 6.6, 5.8, 7, 10.8, 9.3, 6.2, 5, 5.4, 5.7];
const X0 = 18;
const X1 = 302;
const Y0 = 16;
const Y1 = 116;
const TMAX = 12;
const ty = (t: number) => Y1 - (t / TMAX) * (Y1 - Y0);
const tx = (i: number) => X0 + (i / (TEMPS.length - 1)) * (X1 - X0);
const yHi = ty(8);
const yLo = ty(2);
const points = TEMPS.map((t, i) => `${tx(i).toFixed(1)},${ty(t).toFixed(1)}`).join(" ");
const area = `M ${X0} ${Y1} L ${TEMPS.map((t, i) => `${tx(i).toFixed(1)} ${ty(t).toFixed(1)}`).join(" L ")} L ${X1} ${Y1} Z`;
const exIdx = TEMPS.indexOf(Math.max(...TEMPS));

export default function FulfillmentBay() {
  const { t, lang } = useLang();
  const n = (k: string) => t(`pillars.2.notes.${k}`);
  const L = (en: string, ar: string, zh?: string, tr?: string, fr?: string) => {
    if (lang === "ar") return ar;
    if (lang === "zh" && zh) return zh;
    if (lang === "tr" && tr) return tr;
    if (lang === "fr" && fr) return fr;
    return en;
  };
  const exX = tx(exIdx);
  const exY = ty(TEMPS[exIdx]);

  return (
    <div className="cold-command">
      <div className="cold-command-grid">
        <div className="cold-dial-wrap">
          <div className="cold-dial" role="group" aria-label={L("Current temperature 5.7 degrees Celsius", "درجة الحرارة الحالية 5.7 مئوية")}>
            <div className="cold-dial-rings" aria-hidden><i /><i /><i /></div>
            <div className="cold-dial-value"><strong>5.7</strong><span>°C</span></div>
            <div className="cold-dial-state"><i />{L("IN BAND", "داخل النطاق", "范围内", "ARALIKTA", "DANS LA PLAGE")}</div>
          </div>
          <div className="cold-sensor-meta">
            <span><b>CT-118</b>{L("container", "حاوية", "集装箱", "konteyner", "conteneur")}</span>
            <span><b>2s</b>{L("sample", "عينة", "采样", "örnek", "échantillon")}</span>
            <span><b>14</b>{L("points", "نقطة", "点", "nokta", "points")}</span>
          </div>
        </div>

        <div className="cold-thermal-screen">
          <div className="cold-screen-head">
            <span>{n("head")}</span>
            <span className="cold-screen-live"><i /> {n("logged")}</span>
          </div>
          <svg viewBox="0 0 320 132" role="img" aria-label={L("Cold-chain trace with one excursion above the safe band", "مسار سلسلة تبريد يتضمن تجاوزًا واحدًا فوق النطاق الآمن", "冷链轨迹，其中一次超出安全温区", "Güvenli bandın üzerinde bir sapma içeren soğuk zincir izi", "Courbe de chaîne du froid avec un dépassement de la plage sûre")}>
            <defs>
              <linearGradient id="coldArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#22e4ff" stopOpacity="0.26" />
                <stop offset="1" stopColor="#22e4ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="coldLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#38bdf8" />
                <stop offset="0.62" stopColor="#22e4ff" />
                <stop offset="1" stopColor="#5eead4" />
              </linearGradient>
              <filter id="coldGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g className="cold-grid-lines" aria-hidden>
              {[28, 52, 76, 100].map((y) => <line key={y} x1="12" y1={y} x2="308" y2={y} />)}
              {[42, 84, 126, 168, 210, 252, 294].map((x) => <line key={x} x1={x} y1="12" x2={x} y2="120" />)}
            </g>
            <rect x={X0} y={yHi} width={X1 - X0} height={yLo - yHi} className="cold-safe-zone" />
            <path d={area} fill="url(#coldArea)" />
            <polyline points={points} fill="none" stroke="url(#coldLine)" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" />
            <line x1={exX} y1={Y0} x2={exX} y2={Y1} className="cold-ex-guide" />
            <circle cx={exX} cy={exY} r="4.5" className="cold-ex-dot" filter="url(#coldGlow)" />
            <circle cx={tx(TEMPS.length - 1)} cy={ty(TEMPS.at(-1)!)} r="3" className="cold-current-dot" />
            <text x={X1 - 2} y={yHi - 5} textAnchor="end" className="cold-axis-label">8°C</text>
            <text x={X1 - 2} y={yLo + 12} textAnchor="end" className="cold-axis-label">2°C</text>
          </svg>
          <span className="cold-event-chip"><i />{n("excursion")}</span>
          <span className="cold-band-chip">{n("band")}</span>
          <span className="cold-scan" aria-hidden />
        </div>
      </div>

      <div className="cold-event-rail" role="group" aria-label={L("Temperature event timeline", "الخط الزمني لحرارة الشحنة")}>
        <div className="cold-event-rail-line" aria-hidden><i /><i /><i /><i /><i /></div>
        <div className="cold-event-stages">
          <span><b>00:00</b>{L("Loaded", "تحميل", "装载", "Yüklendi", "Chargé")}</span>
          <span><b>06:40</b>{L("Stable", "مستقر", "稳定", "Stabil", "Stable")}</span>
          <span className="is-alert"><b>11:18</b>{L("Excursion", "تجاوز", "偏离", "Sapma", "Écart")}</span>
          <span><b>11:42</b>{L("Recovered", "استعادة", "恢复", "Düzeldi", "Rétabli")}</span>
          <span><b>14:00</b>{L("In band", "داخل النطاق", "范围内", "Aralıkta", "Conforme")}</span>
        </div>
      </div>

      <div className="cold-command-kpis">
        <span><small>{n("rangeK")}</small><b>{n("rangeV")}</b></span>
        <span><small>{n("intervalK")}</small><b>{n("intervalV")}</b></span>
        <span className="is-alert"><small>{n("statusK")}</small><b>{n("statusV")}</b></span>
      </div>
    </div>
  );
}
