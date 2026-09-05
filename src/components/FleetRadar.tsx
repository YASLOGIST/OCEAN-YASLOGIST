import { useLang } from "../lib/i18n";

/* ═══════════════════════ Engine 02 · Gateway Berth View ═══════════════════════
   The five Egyptian sea gateways as a live berth board, not a radar. Each row
   reads left→right: gateway → berth occupancy (filled = vessel alongside, hollow
   = free) → vessels waiting → demurrage status. Two gateways show a queue
   building, which is exactly the moment this engine exists to catch: a queue at
   the quay flagged before it turns into a demurrage invoice.

   Everything is read from vessel AIS and terminal berth status — the panel
   observes; it does not run the terminal. The ModelBadge on the panel says the
   figures are an illustrative model, not a live operational feed. Bilingual by a
   small inline map so no radar-era i18n keys are needed; RTL falls out of the
   logical-property layout.
──────────────────────────────────────────────────────────────────────────── */

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

  return (
    <div>
      {/* column header */}
      <div className="mb-2 grid grid-cols-[1.35fr_1fr_auto] items-center gap-3 px-3 font-mono text-[8px] uppercase tracking-[0.18em] text-ghost/70">
        <span>{L("Gateway", "المنفذ", "核心口岸", "Liman Kapısı", "Portail")}</span>
        <span>{L("Berths", "الأرصفة", "泊位占用", "Rıhtımlar", "Postes")}</span>
        <span className="text-end">{L("Queue · Demurrage", "الطابور · الأرضيات", "排队 · 滞期预警", "Kuyruk · Demoraj", "File · Surestaries")}</span>
      </div>

      <div className="space-y-2">
        {GATES.map((g) => (
          <div
            key={g.en}
            className="grid grid-cols-[1.35fr_1fr_auto] items-center gap-3 rounded-lg border border-chrome/5 bg-chrome/[0.03] px-3 py-2.5"
          >
            {/* gateway */}
            <span className="truncate font-mono text-[11px] text-ice">
              {L(g.en, g.ar, g.zh, g.tr, g.fr)}
            </span>

            {/* berth occupancy */}
            <span className="flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: g.berths }).map((_, i) => (
                <span
                  key={i}
                  className={
                    "h-2.5 w-2.5 rounded-[3px] border " +
                    (i < g.used
                      ? "border-neon/50 bg-neon/80 shadow-[0_0_6px_rgba(34,228,255,0.4)]"
                      : "border-chrome/20 bg-transparent")
                  }
                />
              ))}
            </span>

            {/* queue + demurrage status */}
            <span className="flex items-center justify-end gap-2.5">
              <span className="tabular font-mono text-[11px] text-ice/80" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                {g.queue > 0 ? `+${g.queue}` : "—"}
              </span>
              <span
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] " +
                  (g.warn
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300")
                }
              >
                <span className={"h-1.5 w-1.5 rounded-full " + (g.warn ? "bg-amber-400" : "bg-emerald-400")} />
                {g.warn
                  ? L("Building", "يتراكم", "拥堵预警", "Yığılma", "Engorgement")
                  : L("Clear", "منتظم", "通畅正常", "Açık", "Dégagé")}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* legend + honest note */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-chrome/10 pt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-ghost/70">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-neon/50 bg-neon/80" />
          {L("Occupied", "مشغول", "占用中", "Dolu", "Occupé")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-chrome/20" />
          {L("Free", "فارغ", "空闲", "Boş", "Libre")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          {L("Queue building", "طابور يتراكم", "排队积压", "Kuyruk artıyor", "File croissante")}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-ghost">
        {L(
          "Berth occupancy and vessels waiting, read from AIS and terminal status. A queue building at the quay is flagged before the demurrage clock starts.",
          "إشغال الأرصفة والسفن المنتظرة، مقروءة من AIS وحالة المحطة. تكدّس الطابور عند الرصيف يُرصد قبل أن يبدأ عدّاد الأرضيات.",
          "整合船舶 AIS 与码头作业状态实时追踪泊位占用与候泊船只。在码头排队演变为滞期费账单前提前预警。",
          "AIS ve terminal durumundan okunan rıhtım doluluğu ve bekleyen gemiler. Rıhtımdaki yığılma, demoraj saati başlamadan tespit edilir.",
          "Occupation des postes à quai et navires en attente d'après l'AIS et le terminal. L'attente au quai est alertée avant les surestaries."
        )}
      </p>
    </div>
  );
}
