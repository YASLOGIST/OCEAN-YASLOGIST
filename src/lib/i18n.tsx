import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";

export type Lang = "en" | "ar" | "zh" | "tr" | "fr";
export type Dir = "ltr" | "rtl";

export interface LanguageConfig {
  code: Lang;
  label: string;
  nativeName: string;
  direction: Dir;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", label: "EN", nativeName: "English", direction: "ltr" },
  { code: "ar", label: "عربي", nativeName: "العربية", direction: "rtl" },
  { code: "zh", label: "中文", nativeName: "简体中文", direction: "ltr" },
  { code: "tr", label: "TR", nativeName: "Türkçe", direction: "ltr" },
  { code: "fr", label: "FR", nativeName: "Français", direction: "ltr" },
];

type Dict = {
  nav: { links: string[]; status: string; sub: string };
  founder: { lead: string; name: string; title: string; org: string };
  hero: {
    tag: string;
    title1: string;
    title2: string;
    sub: string;
    cta1: string;
    cta2: string;
    badges: string[];
    scroll: string;
    telemetry: {
      vessel: string;
      live: string;
      speed: string;
      flag: string;
      heading: string;
      draft: string;
      cargo: string;
      eta: string;
      route: string;
      etaNote: string;
    };
  };
  stats: { items: { label: string; note: string }[] };
  pillarsIntro: { tag: string; title1: string; title2: string; sub: string };
  solutions: {
    tag: string;
    title1: string;
    title2: string;
    sub: string;
    items: { title: string; desc: string; metric: string; metricLabel: string }[];
  };
  sim: {
    tag: string;
    title1: string;
    title2: string;
    sub: string;
    teuLabel: string;
    teuUnit: string;
    nmLabel: string;
    nmUnit: string;
    presetsTeu: string;
    presetsNm: string;
    teuPresets: string[];
    nmPresets: string[];
    outputs: string;
    demoNote: string;
    cfTitle: string;
    cfNote: string;
    cfTime: string;
    cfCo2: string;
    cfCost: string;
    cfTonne: string;
    co2: string;
    co2Unit: string;
    time: string;
    cost: string;
    costUnit: string;
    fuel: string;
    fuelUnit: string;
    esg: string;
    note: string;
    origin: string;
    dest: string;
    eta: string;
    reroute: string;
    day: string;
    hour: string;
  };
  pillars: {
    tag: string;
    pre: string;
    accent: string;
    post: string;
    desc: string;
    bullets: string[];
    chips: string[];
    statLabel: string;
    panel: { title: string; status: string };
    notes: { [k: string]: string };
  }[];
  closing: {
    tag: string;
    title1: string;
    title2: string;
    sub: string;
    built: string;
    office: string;
    ctaWhats: string;
    ctaCall: string;
    phone: string;
    note: string;
    short: string;
  };
  footer: {
    blurb: string;
    cols: { head: string; links: string[] }[];
    bottom: string;
    terms: string;
    privacy: string;
    security: string;
    back: string;
    close: string;
    legal: { terms: string[]; privacy: string[]; security: string[] };
  };
  hud: { flow: string; depth: string; camNote: string; depthNote: string; utc: string; health: string; sys: string; dots: string[] };
  clock: { cairo: string; shanghai: string; rotterdam: string };
  /* Calibration label for every figure on the page. The Terms modal already
     said these are illustrative; that disclaimer sat behind a click, so the
     numbers read as live to anyone who never opened it. This carries the same
     statement inline, on the widget itself. */
  model: { badge: string; badgeShort: string };
  /* The corner watermark-cover plate (see BrandPlate.tsx). Previously hardcoded
     English only, so it rendered in Latin script inside an RTL layout. */
  brandPlate: { sub: string };
};

const en: Dict = {
  nav: {
    links: ["Forecast", "Berth", "Cold-Chain", "References", "Ledger"],
    status: "All Systems Nominal",
    sub: "The Next-Gen Supply Chain Intelligence Platform",
  },
  founder: {
    lead: "Platform Founder",
    name: "Ahmed Yasser Ali",
    title: "Supply Chain & Logistics Specialist",
    org: "YASLOGIST · New Cairo, Cairo",
  },
  hero: {
    tag: "Egyptian sea freight, cleared and tracked on one record",
    title1: "Every container.",
    title2: "One record, quay to gate.",
    sub: "ACID and B/L filed before the vessel sails. Live position and berth queue across Alexandria, El Dekheila, Sokhna, Damietta and East Port Said. Every reference carried through to the truck that collects.",
    cta1: "See how it works",
    cta2: "Open the fleet view",
    badges: ["ETA to berth, not to port", "5 Egyptian sea gateways", "B/L to truck plate, one record"],
    scroll: "Scroll to dive deeper",
    telemetry: {
      vessel: "Vessel · sample",
      live: "Live",
      speed: "Speed Over Ground",
      flag: "FLAG · SGP",
      heading: "Heading",
      draft: "Draft",
      cargo: "Cargo",
      eta: "ETA",
      route: "Route",
      etaNote: "ETA East Port Said · 2d 04h 12m — AI re-route active",
    },
  },
  stats: {
    items: [
      { label: "Egyptian sea gateways covered", note: "Alexandria · Dekheila · Sokhna · Damietta · E. Port Said" },
      { label: "Reference types stitched", note: "booking → B/L → container → plate" },
      { label: "Position refresh", note: "AIS near-port · berth queue re-scored" },
      { label: "ETA within ±6h at 5 days out", note: "modelled · see Terms" },
    ],
  },
  pillarsIntro: {
    tag: "The Five Engines",
    title1: "One platform.",
    title2: "Five revolutions.",
    sub: "Every reference a shipment carries is read onto one record: booking, B/L, container, ACID, plate. Five engines, each reading a cost the record sees coming.",
  },
  solutions: {
    tag: "Five Recurring Bottlenecks",
    title1: "The engine built to solve",
    title2: "five costly bottlenecks.",
    sub: "Five recurring cost centers in ocean freight. One platform for each.",
    items: [
      {
        title: "Empty Repositioning Cost",
        desc: "AI reads global flows, weather and port pressure to flag empty-container imbalances before they force an off-lane reposition.",
        metric: "94.2%",
        metricLabel: "Forecast accuracy",
      },
      {
        title: "Berth Queue & Demurrage",
        desc: "Vessel AIS and terminal berth status are read in near real time, so a queue building at the terminal shows up before it becomes a demurrage invoice.",
        metric: "60s",
        metricLabel: "AIS refresh",
      },
      {
        title: "Pharma Cold-Chain Breaks",
        desc: "Temperature and humidity are logged alongside position every two seconds, so an excursion outside the pharma range is flagged at the container, not discovered at the warehouse door.",
        metric: "2–8°C",
        metricLabel: "Monitored range",
      },
      {
        title: "ACID & B/L Rejections",
        desc: "ACID and bill-of-lading references are filed and cross-checked before the vessel sails, so a rejected filing surfaces at booking, not at the gate.",
        metric: "7",
        metricLabel: "Reference types stitched",
      },
      {
        title: "Document & Release Fraud",
        desc: "Every document, payment and handover is logged on a shared, tamper-evident ledger, so a forged release or a duplicated B/L doesn't clear the gate unnoticed.",
        metric: "2.1s",
        metricLabel: "Settlement",
      },
    ],
  },
  sim: {
    tag: "Section 03 · Live Decision Engine",
    title1: "What one optimised voyage",
    title2: "is actually worth.",
    sub: "Set your cargo and your distance. The engine returns what optimisation is worth on that exact voyage — carbon, days and dollars, recalculated as you drag.",
    teuLabel: "Fleet Cargo Volume",
    teuUnit: "TEU",
    nmLabel: "Route Distance",
    nmUnit: "NM",
    presetsTeu: "Cargo profile",
    presetsNm: "Trade lane",
    teuPresets: ["Feeder", "Regional", "Panamax", "Neo-Panamax", "Megamax"],
    nmPresets: ["Med & Red Sea short-haul", "Gulf–Red Sea corridor", "N. Europe–Mediterranean", "Far East–Egypt long-haul"],
    outputs: "Live engine output",
    demoNote: "Interactive demo · illustrative figures on published IMO DCS baselines",
    cfTitle: "Alternative · speed-priority corridor",
    cfNote: "Modelled scenario — same engine, corridor weighted for transit time instead of carbon",
    cfTime: "faster",
    cfCo2: "more carbon",
    cfCost: "less reclaimed",
    cfTonne: "t",
    co2: "Carbon Cut",
    co2Unit: "tonnes CO₂ avoided",
    time: "Demurrage Days Avoided",
    cost: "Operating Cost Reclaimed",
    costUnit: "USD per voyage",
    fuel: "Fuel Preserved",
    fuelUnit: "tonnes bunker",
    esg: "Emissions Score /100",
    note: "Model v9.4 · IMO DCS baselines · illustrative estimates, not operational advice",
    origin: "Origin",
    dest: "Destination",
    eta: "Optimised Arrival",
    reroute: "AI re-route applied",
    day: "d",
    hour: "h",
  },
  pillars: [
    {
      tag: "Engine 01 · Intelligence",
      pre: "AI ",
      accent: "Demand Forecasting",
      post: "",
      desc: "Reads published flows, live weather and port pressure to flag empty-container imbalance before it forces an off-lane reposition. A signal you act on, not a route we sail.",
      bullets: [
        "Flags empty-container imbalance 12 hours to 12 months out",
        "Reads live weather, port load and lane pressure, not your ships",
        "Surfaces the reposition risk while there is still time to act",
      ],
      chips: ["Machine Learning", "Predictive ETA", "Demand Sensing"],
      statLabel: "Forecast accuracy across covered lanes",
      panel: { title: "Repositioning Forecast", status: "Model v9.4" },
      notes: {
        chart: "Live inference",
        legend: "Four live signals · one reposition flag",
        layerIn: "Live signals",
        layerHidden: "Model",
        layerOut: "Reposition flag",
        in0: "Demand",
        in1: "Weather",
        in2: "Port load",
        in3: "Fuel",
        rt0: "Surplus",
        rt1: "Reposition",
        rt2: "Deficit",
        horizon: "Horizon",
        horizonV: "12H",
        accuracy: "Accuracy",
        accuracyV: "94.2%",
        empty: "Empty Miles",
        emptyV: "−38%",
      },
    },
    {
      tag: "Engine 02 · Visibility",
      pre: "Real-Time ",
      accent: "Berth Visibility",
      post: "",
      desc: "Reads vessel AIS and terminal berth status across the five Egyptian gateways, so a queue building at the quay shows up before it lands as a demurrage invoice.",
      bullets: [
        "AIS position and berth status, refreshed near the port",
        "A building berth queue is flagged before the demurrage clock starts",
        "Every vessel tied back to its booking, B/L and container",
      ],
      chips: ["AIS Feed", "Berth Status", "Demurrage Watch"],
      statLabel: "AIS refresh near the port",
      panel: { title: "Gateway Berth View", status: "AIS · near real-time" },
      notes: {
        sector: "Sector",
        sectorV: "07 · Live",
        range: "Range",
        rangeV: "12.0 NM",
        contacts: "Contacts",
        sweep: "Sweep",
        vessel: "Vessel",
        route: "Route",
        speed: "Speed",
        temp: "Temp",
        load: "Load",
      },
    },
    {
      tag: "Engine 03 · Cold Chain",
      pre: "Pharma ",
      accent: "Cold-Chain Monitoring",
      post: "",
      desc: "Temperature and humidity logged alongside position every two seconds, so an excursion outside the pharma range is flagged at the container while the box is still on the water.",
      bullets: [
        "Temperature and humidity read every two seconds, per container",
        "An excursion outside 2–8°C is flagged the moment it starts",
        "The reading travels with the reference, gateway to gate",
      ],
      chips: ["2–8°C Range", "Excursion Alerts", "Per-Container Log"],
      statLabel: "Logging interval, per container",
      panel: { title: "Cold-Chain Monitor", status: "2–8°C" },
      notes: {
        head: "Container · CT-118",
        band: "Safe band · 2–8°C",
        excursion: "Excursion flagged",
        logged: "Logged every 2s",
        hi: "8°C",
        lo: "2°C",
        rangeK: "Monitored range",
        rangeV: "2–8°C",
        intervalK: "Interval",
        intervalV: "2s",
        statusK: "Excursions",
        statusV: "1 flagged",
      },
    },
    {
      tag: "Engine 04 · Compliance",
      pre: "ACID & B/L ",
      accent: "Reference Stitching",
      post: "",
      desc: "ACID and bill-of-lading references cross-checked before the vessel sails, so a rejected filing surfaces at booking while there is still time to fix it.",
      bullets: [
        "Booking, B/L, container and ACID reconciled onto one record",
        "A mismatch or rejection is flagged at booking, not at the gate",
        "Seven reference types stitched; the customer files, YASLOGIST watches",
      ],
      chips: ["ACID Cross-Check", "B/L Match", "Pre-Sail Flag"],
      statLabel: "Reference types cross-checked pre-sail",
      panel: { title: "Reference Reconciliation", status: "Pre-sail" },
      notes: {
        head: "Shipment record",
        ok: "Matched",
        flag: "Rejected at booking",
        ref0: "Booking",
        ref1: "Bill of Lading",
        ref2: "Container",
        ref3: "ACID",
        ref4: "Gate Pass",
        foot: "Filed by the customer or their broker. YASLOGIST watches the references line up; it does not file the declaration.",
        countV: "7",
        countK: "Reference types",
      },
    },
    {
      tag: "Engine 05 · Trust",
      pre: "Tamper-Evident ",
      accent: "Shared Record",
      post: "",
      desc: "Every document and handover written to a shared, tamper-evident record, so a forged release or a duplicated B/L is caught before it clears the gate.",
      bullets: [
        "Every document and handover written to a tamper-evident record",
        "A forged release or duplicated B/L is caught before the gate",
        "One shared record the customer, their broker and the port can read",
      ],
      chips: ["Tamper-Evident", "Digital B/L", "Audit Trail"],
      statLabel: "Record write time",
      panel: { title: "Tamper-Evident Record", status: "Verified" },
      notes: {
        contract: "Shared Record · Handover",
        ledger: "Committed blocks",
        step1: "Log",
        step2: "Verify",
        step3: "Reconcile",
        step4: "Commit",
        note: "Each document and handover writes to the shared record in about 2.1s, and every write stays visible to the parties on the shipment.",
        verified: "Verified",
      },
    },
  ],
  closing: {
    tag: "Connect · Platform Founder",
    title1: "One conversation stands between you",
    title2: "and a supply chain that thinks.",
    sub: "Your message reaches him directly — not a queue, not a form, not a bot.",
    built: "Built from scratch by Ahmed Yasser Ali — Supply Chain & Logistics Specialist",
    office: "YASLOGIST · Corporate Branch — New Cairo, Cairo, Egypt",
    ctaWhats: "Message the Founder Directly",
    ctaCall: "Call Now",
    phone: "+20 104 113 9910",
    note: "Available 24/7 · Direct calls & messages",
    short: "Connect",
  },
  footer: {
    blurb: "Supply-chain intelligence for Egyptian sea freight — container and vessel visibility, predictive ETAs, and one shipment record that survives the handover to road.",
    cols: [
      { head: "Company", links: ["About YASLOGIST", "The Founder", "Legal", "Contact"] },
      { head: "Coverage", links: ["Ocean", "Land", "Egyptian Gateways", "Road Handover"] },
      { head: "Approach", links: ["One Record", "Predictive ETA", "Reference Stitching", "What We Don't Do"] },
    ],
    bottom: "© 2026 YASLOGIST · One shipment record across road, sea and air in Egypt · All rights reserved",
    terms: "Terms",
    privacy: "Privacy",
    security: "Security",
    back: "Back to surface",
    close: "Close",
    legal: {
      terms: [
        "YASLOGIST is a supply-chain intelligence platform operated from its corporate branch in New Cairo, Cairo, Egypt.",
        "All vessel telemetry, port figures and simulator outputs shown on this site are illustrative models presented for demonstration purposes. They are not live operational data and must not be relied on for commercial routing, chartering or compliance decisions.",
        "The simulator applies published IMO DCS baselines to user-entered values. Results are estimates only, and no warranty is given as to their accuracy for any particular voyage.",
        "The YASLOGIST name, mark and interface are the work of the platform founder. Please request permission before reproducing them.",
      ],
      privacy: [
        "This site collects nothing. There are no analytics scripts, no advertising trackers, no cookies and no third-party embeds that profile you.",
        "The only values stored on your device are two local preferences — your chosen theme and language — kept in your browser's local storage so the site remembers them on your next visit. They never leave your device and are cleared when you clear site data.",
        "No account is required and no personal information is requested at any point. The contact links open your own phone or messaging application; any conversation that follows happens there, under that provider's terms, not here.",
        "Background footage and fonts are served as static assets. No form on this site transmits data to a server.",
      ],
      security: [
        "The platform is a static front-end. There is no backend, no database and no user session, so there is no stored personal data to breach.",
        "All assets are served over HTTPS in production. The interface runs entirely in your browser and performs no privileged operations on your device.",
        "The blockchain, telemetry and ledger visuals are presentation models illustrating how a tamper-evident supply chain would behave. They do not connect to a live chain and settle no real transactions.",
        "If you believe you have found a genuine security issue, please report it directly to the platform founder using the contact details in this footer.",
      ],
    },
  },
  hud: {
    flow: "Cam Flow",
    depth: "Depth",
    camNote: "CAM ▸ ALT 2,400M · VELOCITY SYNC",
    depthNote: "Network Depth · 7 Modules",
    utc: "UTC · FLEET SYNC NOMINAL",
    health: "STATUS · NOMINAL",
    sys: "HTTPS · STATIC DELIVERY",
    dots: ["Overview", "Solutions", "Simulator", "Forecast", "Berth", "Cold-Chain", "References", "Ledger", "Connect"],
  },
  clock: { cairo: "Cairo", shanghai: "Shanghai", rotterdam: "Rotterdam" },
  model: {
    badge: "Illustrative model · not live data",
    badgeShort: "Simulated",
  },
  brandPlate: {
    sub: "Core · Cairo",
  },
};

const ar: Dict = {
  nav: {
    links: ["التنبؤ", "الأرصفة", "التبريد", "المراجع", "السجل"],
    status: "جميع الأنظمة سليمة",
    sub: "منصة الجيل القادم لذكاء سلاسل الإمداد",
  },
  founder: {
    lead: "مؤسس المنصة",
    name: "أحمد ياسر علي",
    title: "أخصائي وخبير سلاسل الإمداد واللوجستيات",
    org: "YASLOGIST · القاهرة الجديدة، القاهرة",
  },
  hero: {
    tag: "الشحن البحري المصري · تخليص وتتبّع على سجل واحد",
    title1: "كل حاوية.",
    title2: "سجل واحد من الرصيف حتى البوابة.",
    sub: "استخراج ACID وتسجيل البوليصة قبل الإبحار. متابعة لحظية للموقع وطابور الأرصفة في الإسكندرية والدخيلة والسخنة ودمياط وشرق بورسعيد. وكل مرجع ينتقل إلى الشاحنة التي تستلم.",
    cta1: "شاهد كيف تعمل",
    cta2: "افتح شاشة الأسطول",
    badges: ["وصول محسوب للرصيف لا للميناء", "5 منافذ بحرية مصرية", "من البوليصة إلى لوحة الشاحنة"],
    scroll: "مرّر للغوص أعمق",
    telemetry: {
      vessel: "سفينة · نموذج",
      live: "مباشر",
      speed: "السرعة الأرضية (SOG)",
      flag: "الراية · سنغافورة",
      heading: "الاتجاه",
      draft: "الغاطس",
      cargo: "البضاعة",
      eta: "الوصول",
      route: "المسار",
      etaNote: "الوصول لشرق بورسعيد · بعد يومين و4 ساعات — إعادة توجيه ذكية نشطة",
    },
  },
  stats: {
    items: [
      { label: "منافذ بحرية مصرية مغطاة", note: "الإسكندرية · الدخيلة · السخنة · دمياط · شرق بورسعيد" },
      { label: "أنواع مراجع مترابطة", note: "الحجز ← البوليصة ← الحاوية ← اللوحة" },
      { label: "تحديث الموقع", note: "AIS قرب الميناء · إعادة حساب طابور الرصيف" },
      { label: "دقة الوصول ±6 ساعات قبل 5 أيام", note: "قيمة نمذجية · راجع الشروط" },
    ],
  },
  pillarsIntro: {
    tag: "المحركات الخمسة",
    title1: "منصة واحدة.",
    title2: "خمس ثورات.",
    sub: "كل مرجع تحمله الشحنة — الحجز والبوليصة والحاوية وACID واللوحة — مقروء على سجل واحد. خمسة محركات، كلٌّ يقرأ تكلفة يراها السجل قادمة.",
  },
  solutions: {
    tag: "خمسة اختناقات متكررة",
    title1: "المحرك المصمَّم لحل",
    title2: "خمسة اختناقات مكلفة.",
    sub: "خمسة مراكز تكلفة متكررة في الشحن البحري. منصة واحدة لكل منها.",
    items: [
      {
        title: "تكلفة إعادة توزيع الفوارغ",
        desc: "يقرأ الذكاء الاصطناعي التدفقات العالمية والطقس وضغط الموانئ لرصد اختلال توزيع الحاويات الفارغة قبل أن يفرض إعادة شحن خارج الخط.",
        metric: "94.2%",
        metricLabel: "دقة التنبؤ",
      },
      {
        title: "طابور الأرصفة والأرضيات",
        desc: "يُقرأ AIS السفينة وحالة الرصيف في المحطة شبه لحظيًا، فيظهر تكدّس الطابور قبل أن يتحوّل إلى فاتورة أرضيات.",
        metric: "60ث",
        metricLabel: "تحديث AIS",
      },
      {
        title: "انقطاع سلسلة التبريد للأدوية",
        desc: "تُسجَّل الحرارة والرطوبة مع الموقع كل ثانيتين، فيُرصد أي خروج عن النطاق الدوائي المسموح عند الحاوية، لا عند باب المستودع.",
        metric: "2–8°م",
        metricLabel: "النطاق المُراقَب",
      },
      {
        title: "رفض ملفات ACID والبوالص",
        desc: "تُستخرج مراجع ACID وبوليصة الشحن ويُتحقّق منها قبل الإبحار، فيظهر أي رفض عند الحجز لا عند البوابة.",
        metric: "7",
        metricLabel: "أنواع مراجع مترابطة",
      },
      {
        title: "التلاعب في المستندات والإفراج",
        desc: "يُسجَّل كل مستند ودفعة وتسليم على سجل مشترك يكشف أي تلاعب، فلا يمر إفراج مزوَّر أو بوليصة مكرَّرة دون رصد.",
        metric: "2.1ث",
        metricLabel: "زمن التسوية",
      },
    ],
  },
  sim: {
    tag: "القسم 03 · محرك القرار الحي",
    title1: "ما قيمة رحلة واحدة",
    title2: "بعد التحسين؟",
    sub: "حدّد حمولتك ومسافتك، ليعيد المحرك قيمة التحسين على هذه الرحلة بالتحديد — كربونٌ وأيامٌ وأموال، تُحتسب لحظة تحريكك للمؤشر.",
    teuLabel: "حجم حمولة الأسطول",
    teuUnit: "حاوية مكافئة",
    nmLabel: "مسافة المسار",
    nmUnit: "ميل بحري",
    presetsTeu: "نمط الحمولة",
    presetsNm: "الممر التجاري",
    teuPresets: ["ناقل مغذٍّ", "إقليمي", "بنَمَاكس", "نيو-بنَمَاكس", "ميجاماكس"],
    nmPresets: ["مسافات قصيرة بالمتوسط والبحر الأحمر", "ممر الخليج–البحر الأحمر", "شمال أوروبا–المتوسط", "مسافة طويلة الشرق الأقصى–مصر"],
    outputs: "مخرجات المحرك الحية",
    demoNote: "عرض تفاعلي · أرقام استرشادية على خطوط أساس IMO DCS المنشورة",
    cfTitle: "بديل · ممر يُعطي الأولوية للسرعة",
    cfNote: "سيناريو نمذجي — المحرك نفسه، وممر مُرجَّح لزمن العبور بدلًا من الكربون",
    cfTime: "أسرع",
    cfCo2: "كربون إضافي",
    cfCost: "توفير أقل",
    cfTonne: "طن",
    co2: "خفض البصمة الكربونية",
    co2Unit: "طن كربون مُتجنَّب",
    time: "أيام أرضيات مُتجنَّبة",
    cost: "الوفر في التكاليف التشغيلية",
    costUnit: "دولار لكل رحلة",
    fuel: "وقود محفوظ",
    fuelUnit: "طن وقود بحري (بنكر)",
    esg: "مؤشر الانبعاثات /100",
    note: "النموذج 9.4 · معايير IMO DCS · تقديرات استرشادية لا تُغني عن القرار التشغيلي",
    origin: "نقطة الانطلاق",
    dest: "الوجهة",
    eta: "الوصول المُحسَّن",
    reroute: "إعادة توجيه ذكية مُطبَّقة",
    day: "يوم",
    hour: "س",
  },
  pillars: [
    {
      tag: "المحرك 01 · الذكاء",
      pre: "الذكاء الاصطناعي و",
      accent: "التنبؤ المستقبلي",
      post: " بالطلب",
      desc: "يقرأ التدفقات المنشورة والطقس الحي وضغط الموانئ لرصد اختلال توزيع الفوارغ قبل أن يفرض إعادة شحن خارج الخط. إشارة تتصرّف بناءً عليها، لا رحلة نبحرها.",
      bullets: [
        "رصد اختلال توزيع الفوارغ من 12 ساعة إلى 12 شهرًا",
        "قراءة الطقس الحي وضغط الموانئ وحِمل الخط — لا سفنك",
        "إظهار خطر إعادة التوزيع وما زال في الوقت متسع للتصرّف",
      ],
      chips: ["تعلّم آلي", "تنبؤ بموعد الوصول", "رصد إشارات الطلب"],
      statLabel: "دقة التنبؤ عبر الممرات المغطاة",
      panel: { title: "توقّع إعادة التوزيع", status: "النموذج 9.4" },
      notes: {
        chart: "استدلال حي",
        legend: "أربع إشارات حية · إشارة إعادة توزيع واحدة",
        layerIn: "إشارات حية",
        layerHidden: "النموذج",
        layerOut: "إشارة إعادة توزيع",
        in0: "الطلب",
        in1: "الطقس",
        in2: "ضغط الموانئ",
        in3: "الوقود",
        rt0: "فائض",
        rt1: "إعادة توزيع",
        rt2: "عجز",
        horizon: "الأفق",
        horizonV: "12س",
        accuracy: "الدقة",
        accuracyV: "94.2%",
        empty: "أميال فارغة",
        emptyV: "−38%",
      },
    },
    {
      tag: "المحرك 02 · الرؤية",
      pre: "متابعة مباشرة · ",
      accent: "السفن والأرصفة",
      post: "",
      desc: "يقرأ AIS السفن وحالة الأرصفة في المنافذ المصرية الخمسة، فيظهر تكدّس الطابور عند الرصيف قبل أن يصل فاتورةَ أرضيات.",
      bullets: [
        "موقع AIS وحالة الرصيف، محدَّثان قرب الميناء",
        "تكدّس الطابور يُرصد قبل أن يبدأ عدّاد الأرضيات",
        "كل سفينة مرتبطة بحجزها وبوليصتها وحاويتها",
      ],
      chips: ["تغذية AIS", "حالة الرصيف", "مراقبة الأرضيات"],
      statLabel: "تحديث AIS قرب الميناء",
      panel: { title: "عرض أرصفة المنافذ", status: "AIS · شبه مباشر" },
      notes: {
        sector: "القطاع",
        sectorV: "07 · مباشر",
        range: "المدى",
        rangeV: "12.0 ميل",
        contacts: "الأهداف",
        sweep: "المسح",
        vessel: "السفينة",
        route: "المسار",
        speed: "السرعة",
        temp: "الحرارة",
        load: "الحمولة",
      },
    },
    {
      tag: "المحرك 03 · التبريد",
      pre: "مراقبة ",
      accent: "سلسلة التبريد",
      post: " الدوائية",
      desc: "تُسجَّل الحرارة والرطوبة مع الموقع كل ثانيتين، فيُرصد أي خروج عن النطاق الدوائي 2–8°م عند الحاوية لا عند باب المستودع.",
      bullets: [
        "قراءة الحرارة والرطوبة كل ثانيتين لكل حاوية",
        "أي خروج عن نطاق 2–8°م يُرصد لحظة بدايته",
        "القراءة تسافر مع المرجع من المنفذ إلى البوابة",
      ],
      chips: ["نطاق 2–8°م", "إنذارات الخروج", "سجل لكل حاوية"],
      statLabel: "فاصل التسجيل لكل حاوية",
      panel: { title: "مراقب سلسلة التبريد", status: "2–8°م" },
      notes: {
        head: "حاوية · CT-118",
        band: "النطاق الآمن · 2–8°م",
        excursion: "تنبيه خروج",
        logged: "يُسجَّل كل ثانيتين",
        hi: "8°م",
        lo: "2°م",
        rangeK: "النطاق المُراقَب",
        rangeV: "2–8°م",
        intervalK: "الفاصل",
        intervalV: "ثانيتان",
        statusK: "حالات الخروج",
        statusV: "خروج واحد",
      },
    },
    {
      tag: "المحرك 04 · الامتثال",
      pre: "ترابط مراجع ",
      accent: "ACID والبوالص",
      post: "",
      desc: "تُطابَق مراجع ACID وبوليصة الشحن قبل الإبحار، فيظهر أي رفض عند الحجز لا عند البوابة.",
      bullets: [
        "الحجز والبوليصة والحاوية وACID على سجل واحد",
        "أي تعارض أو رفض يُرصد عند الحجز لا عند البوابة",
        "سبعة أنواع مراجع مترابطة — العميل يقدّم ونحن نراقب",
      ],
      chips: ["مطابقة ACID", "مطابقة البوليصة", "رصد قبل الإبحار"],
      statLabel: "أنواع مراجع مُتحقَّقة قبل الإبحار",
      panel: { title: "مطابقة المراجع", status: "قبل الإبحار" },
      notes: {
        head: "سجل الشحنة",
        ok: "مطابق",
        flag: "مرفوض — رُصد عند الحجز",
        ref0: "الحجز",
        ref1: "بوليصة الشحن",
        ref2: "الحاوية",
        ref3: "ACID",
        ref4: "تصريح البوابة",
        foot: "يقدّمها العميل أو وسيطه المرخّص. YASLOGIST تراقب تطابق المراجع — لا تقدّم الإقرار.",
        countV: "7",
        countK: "أنواع المراجع",
      },
    },
    {
      tag: "المحرك 05 · الثقة",
      pre: "",
      accent: "سجل مشترك يكشف التلاعب",
      post: "",
      desc: "كل مستند وتسليم يُكتب على سجل مشترك يكشف أي تلاعب، فلا يمر إفراج مزوَّر أو بوليصة مكرَّرة قبل البوابة.",
      bullets: [
        "كل مستند وتسليم مكتوب على سجل يكشف أي تلاعب",
        "أي إفراج مزوَّر أو بوليصة مكرَّرة يُرصد قبل البوابة",
        "سجل واحد مشترك يقرأه العميل ووسيطه والميناء",
      ],
      chips: ["يكشف التلاعب", "بوليصة رقمية (B/L)", "أثر تدقيق"],
      statLabel: "زمن كتابة السجل",
      panel: { title: "سجل يكشف التلاعب", status: "موثّق" },
      notes: {
        contract: "سجل مشترك · تسليم",
        ledger: "كتل مُثبَّتة",
        step1: "تسجيل",
        step2: "تحقق",
        step3: "مطابقة",
        step4: "تثبيت",
        note: "كل مستند وتسليم يُكتب على السجل المشترك — نحو 2.1 ثانية للتثبيت، ويبقى كل إدخال مرئيًا لأطراف الشحنة.",
        verified: "موثّق",
      },
    },
  ],
  closing: {
    tag: "تواصل · مؤسس المنصة",
    title1: "محادثة واحدة تفصلك",
    title2: "عن سلسلة إمدادٍ تُفكِّر.",
    sub: "رسالتك تصله مباشرة — لا قائمة انتظار، ولا نموذج، ولا روبوت.",
    built: "بُنيت من الصفر على يد أحمد ياسر علي — أخصائي سلاسل الإمداد واللوجستيات",
    office: "YASLOGIST · الفرع المؤسسي — القاهرة الجديدة، القاهرة، مصر",
    ctaWhats: "راسل المؤسس مباشرة",
    ctaCall: "اتصل الآن",
    phone: "+20 104 113 9910",
    note: "متاح على مدار الساعة · اتصال ورسائل مباشرة",
    short: "تواصل",
  },
  footer: {
    blurb: "ذكاء سلاسل الإمداد للشحن البحري المصري — تتبّع الحاويات والسفن، وتنبؤ بمواعيد الوصول، وسجل واحد للشحنة يستمر حتى التسليم البري.",
    cols: [
      { head: "الشركة", links: ["عن YASLOGIST", "المؤسّس", "الشؤون القانونية", "تواصل"] },
      { head: "التغطية", links: ["بحري", "بري", "المنافذ المصرية", "التسليم البري"] },
      { head: "المنهج", links: ["السجل الواحد", "التنبؤ بالوصول", "ترابط المراجع", "ما لا نقوم به"] },
    ],
    bottom: "© 2026 YASLOGIST · سجل واحد للشحنة عبر البر والبحر والجو في مصر · جميع الحقوق محفوظة",
    terms: "الشروط",
    privacy: "الخصوصية",
    security: "الأمان",
    back: "العودة إلى السطح",
    close: "إغلاق",
    legal: {
      terms: [
        "YASLOGIST منصة لذكاء سلاسل الإمداد تُدار من فرعها المؤسسي في القاهرة الجديدة، القاهرة، مصر.",
        "جميع بيانات السفن وأرقام الموانئ ومخرجات المحاكي المعروضة هنا نماذج توضيحية لأغراض العرض فقط. وهي ليست بيانات تشغيلية مباشرة، ولا يجوز الاعتماد عليها في قرارات التوجيه أو الاستئجار أو الامتثال التجاري.",
        "يطبّق المحاكي خطوط الأساس المنشورة لنظام IMO DCS على القيم التي تُدخلها. النتائج تقديرية فقط، ولا يُقدَّم أي ضمان بدقتها لأي رحلة بعينها.",
        "اسم YASLOGIST وعلامته وواجهته من عمل مؤسس المنصة. يُرجى طلب الإذن قبل إعادة استخدامها.",
      ],
      privacy: [
        "هذا الموقع لا يجمع أي بيانات. لا توجد أدوات تحليل، ولا متتبعات إعلانية، ولا ملفات ارتباط، ولا عناصر خارجية تتعقّبك.",
        "القيمتان الوحيدتان المحفوظتان على جهازك هما تفضيلا المظهر واللغة، وتُخزَّنان في المتصفح ليتذكّرهما الموقع في زيارتك القادمة. لا تغادران جهازك أبدًا، وتُمحيان عند مسح بيانات الموقع.",
        "لا يلزم إنشاء حساب، ولا تُطلب أي معلومات شخصية. روابط التواصل تفتح تطبيق الهاتف أو المراسلة لديك، وأي محادثة تجري هناك وفق شروط ذلك التطبيق لا هنا.",
        "تُقدَّم لقطات الخلفية والخطوط كملفات ثابتة، ولا يرسل أي نموذج في هذا الموقع بيانات إلى خادم.",
      ],
      security: [
        "المنصة واجهة أمامية ثابتة بالكامل: لا خادم خلفي، ولا قاعدة بيانات، ولا جلسات مستخدم — لذا لا توجد بيانات شخصية مخزَّنة يمكن اختراقها.",
        "تُقدَّم جميع الملفات عبر HTTPS في بيئة الإنتاج. تعمل الواجهة داخل متصفحك فقط ولا تنفّذ أي عمليات ذات صلاحيات على جهازك.",
        "عناصر البلوك تشين والتتبع والسجل نماذج عرضية توضّح سلوك سلسلة إمداد غير قابلة للتلاعب. وهي لا تتصل بأي شبكة فعلية ولا تنفّذ أي معاملات حقيقية.",
        "إذا اعتقدت أنك وجدت ثغرة أمنية حقيقية، فيُرجى إبلاغ مؤسس المنصة مباشرة عبر بيانات التواصل في هذا التذييل.",
      ],
    },
  },
  hud: {
    flow: "تدفق الكاميرا",
    depth: "العمق",
    camNote: "الكام ▸ الارتفاع 2,400م · مزامنة السرعة",
    depthNote: "عمق الشبكة · 7 وحدات",
    utc: "UTC · مزامنة الأسطول سليمة",
    health: "الحالة · سليمة",
    sys: "HTTPS · تسليم ثابت",
    dots: ["نظرة عامة", "الحلول", "المحاكي", "التنبؤ", "الأرصفة", "التبريد", "المراجع", "السجل", "تواصل"],
  },
  clock: { cairo: "القاهرة", shanghai: "شنغهاي", rotterdam: "روتردام" },
  model: {
    badge: "نموذج توضيحي · ليست بيانات مباشرة",
    badgeShort: "محاكاة",
  },
  brandPlate: {
    sub: "المقر · القاهرة",
  },
};

const zh: Dict = {
  nav: {
    links: ["需求预测", "泊位态势", "药品冷链", "单证核验", "存证账本"],
    status: "全系统运行正常",
    sub: "下一代海运供应链智能指挥平台",
  },
  founder: {
    lead: "平台创始人",
    name: "艾哈迈德·亚瑟·阿里 (Ahmed Yasser Ali)",
    title: "供应链与国际物流专家",
    org: "YASLOGIST · 埃及新开罗",
  },
  hero: {
    tag: "埃及海运全链条 · 单一记录通关与在途追踪",
    title1: "每一只集装箱。",
    title2: "从码头到闸口，一账贯通。",
    sub: "开航前完成 ACID 预申报与提单核验。实时掌握亚历山大、德海拉、苏赫奈、杜姆亚特及塞得东港五大口岸船舶动态与泊位排队。每一条关联单号无缝流转至接载公路集卡。",
    cta1: "查看运行原理",
    cta2: "进入船队全景视角",
    badges: ["预估靠泊时间而非抵港时间", "覆盖埃及5大核心海运枢纽", "提单直通集卡车牌·单一记录"],
    scroll: "向下滚动深入探索",
    telemetry: {
      vessel: "船舶 · 仿真样本",
      live: "实时",
      speed: "对地航速 (SOG)",
      flag: "船旗 · 新加坡",
      heading: "航向",
      draft: "吃水",
      cargo: "载货",
      eta: "预估抵港",
      route: "航线",
      etaNote: "预估抵靠塞得东港 · 2天04小时12分 — AI 自主避障航线已激活",
    },
  },
  stats: {
    items: [
      { label: "覆盖埃及核心海运口岸", note: "亚历山大 · 德海拉 · 苏赫奈 · 杜姆亚特 · 塞得东港" },
      { label: "全流程贯通单证类型", note: "订舱单 → 提单 → 集装箱 → 集卡车牌" },
      { label: "船舶动态更新频率", note: "近岸 AIS 实时刷新 · 泊位排队动态重算" },
      { label: "抵港前5天 ETA 误差 ±6h", note: "仿真推演指标 · 详见服务条款" },
    ],
  },
  pillarsIntro: {
    tag: "五大核心引擎",
    title1: "单一数字底座。",
    title2: "五项颠覆性突破。",
    sub: "将货运全程所有单证要素——订舱、提单、箱号、ACID、车牌——汇聚于单一防篡改记录。五大引擎协同运转，预见隐性成本并自主拦截。",
  },
  solutions: {
    tag: "直面五大行业沉疴",
    title1: "专为化解",
    title2: "五大高昂瓶颈而生。",
    sub: "直击海运全链条五大核心成本消耗点，各配备专属数字化引擎。",
    items: [
      {
        title: "空箱调运高昂成本",
        desc: "AI 综合研判全球货流、气象海况及港口吞吐负荷，在运力失衡前精准预警，避免偏航重调。",
        metric: "94.2%",
        metricLabel: "预测准确率",
      },
      {
        title: "泊位拥堵与高额滞期费",
        desc: "近实时抓取船舶 AIS 轨迹与码头作业泊位负荷，在港口排队演变为滞期费账单前提前预警。",
        metric: "60秒",
        metricLabel: "AIS 刷新频率",
      },
      {
        title: "医药冷链脱温断链",
        desc: "每两秒同步采集箱内温湿度与空间坐标，超温预警在在途集装箱端即时触发，杜绝仓库收货时才发现货损。",
        metric: "2–8°C",
        metricLabel: "受控温区",
      },
      {
        title: "ACID 与提单核验驳回",
        desc: "在船舶离港前全面校核埃及 ACID 与海运提单 (B/L) 数据一致性，将退单风险拦截在订舱端而非码头闸口。",
        metric: "7",
        metricLabel: "贯通单证种类",
      },
      {
        title: "纸质单证伪造与提货欺诈",
        desc: "所有单证流转、结算支付与放行交接均写入防篡改共享账本，杜绝假冒提单或重复提货非法离港。",
        metric: "2.1秒",
        metricLabel: "账本上链存证",
      },
    ],
  },
  sim: {
    tag: "第03节 · 实时决策推演引擎",
    title1: "一次航行路径优化",
    title2: "究竟价值几何？",
    sub: "输入载货规模与航程距离。引擎即刻实时测算该航次在碳排、周转天数及营运成本上的综合减省效益。",
    teuLabel: "船队载货量",
    teuUnit: "标准箱 (TEU)",
    nmLabel: "航线距离",
    nmUnit: "海里 (NM)",
    presetsTeu: "货型配置",
    presetsNm: "贸易航道",
    teuPresets: ["支线接驳船", "区域集装箱船", "巴拿马型", "新巴拿马型", "超大型集装箱船"],
    nmPresets: ["地中海及红海短途", "海湾–红海关键走廊", "北欧–地中海主干线", "远东–埃及远洋干线"],
    outputs: "引擎推演输出",
    demoNote: "交互式推演模型 · 基于国际海事组织 (IMO DCS) 公布基准测算",
    cfTitle: "备选方案 · 航速优先时效走廊",
    cfNote: "仿真场景对比 — 同一算力引擎，优先侧重航运时效而非单纯脱碳",
    cfTime: "时效更快",
    cfCo2: "碳排增加",
    cfCost: "综合减省减少",
    cfTonne: "吨",
    co2: "碳减排量",
    co2Unit: "减少二氧化碳当量 (吨)",
    time: "避免滞期天数",
    cost: "挽回运营成本",
    costUnit: "美元 / 每航次",
    fuel: "燃油节约",
    fuelUnit: "燃油吨数 (重油/轻油)",
    esg: "能效评级 /100",
    note: "模型版本 v9.4 · IMO DCS 行业基准 · 仅供推演参考，不作为实际航行指令",
    origin: "始发港",
    dest: "目的港",
    eta: "优化到港时间",
    reroute: "已应用 AI 优化航线",
    day: "天",
    hour: "小时",
  },
  pillars: [
    {
      tag: "引擎 01 · 智能算力",
      pre: "AI ",
      accent: "货运需求与调运预测",
      post: "",
      desc: "基于全球货流、海况天气和港口吞吐负荷，在空箱分布失衡迫使偏航前发出调配信号。提供行动决策依据，而非替代航运调度。",
      bullets: [
        "提前 12 小时至 12 个月预测集装箱空置与短缺失衡",
        "实时融合气象海况、港口负荷及干线热度数据",
        "在留有充足处置窗口期时主动提示空箱调运风险",
      ],
      chips: ["机器学习", "预测性 ETA", "需求感知"],
      statLabel: "覆盖航线综合预测准确率",
      panel: { title: "空箱调运智能预测", status: "模型版本 v9.4" },
      notes: {
        chart: "实时推理",
        legend: "四重实时信号 · 单一调运指令",
        layerIn: "输入信号",
        layerHidden: "算法模型",
        layerOut: "调运指令",
        in0: "需求",
        in1: "海况",
        in2: "港口负荷",
        in3: "油价",
        rt0: "盈余",
        rt1: "调运",
        rt2: "短缺",
        horizon: "预测周期",
        horizonV: "12小时",
        accuracy: "准确率",
        accuracyV: "94.2%",
        empty: "空载航程",
        emptyV: "−38%",
      },
    },
    {
      tag: "引擎 02 · 态势感知",
      pre: "实时 ",
      accent: "港口泊位态势感知",
      post: "",
      desc: "整合埃及五大口岸船舶 AIS 轨迹与终端泊位空闲状态，在码头排队堆叠之前预警潜在滞期费风险。",
      bullets: [
        "抵港船舶 AIS 动态与泊位状态近实时协同刷新",
        "在滞期计费时钟触发前精准捕捉排队拥堵趋势",
        "实现每艘船舶与其关联订舱、提单及集装箱的全链条绑定",
      ],
      chips: ["AIS 实时数据源", "泊位作业状态", "滞期费主动预警"],
      statLabel: "港口周边 AIS 刷新频率",
      panel: { title: "核心口岸泊位全景图", status: "AIS · 准实时" },
      notes: {
        sector: "监控海区",
        sectorV: "07区 · 实时",
        range: "探测半径",
        rangeV: "12.0海里",
        contacts: "目标船只",
        sweep: "雷达扫描",
        vessel: "船名",
        route: "航线",
        speed: "航速",
        temp: "温度",
        load: "载重",
      },
    },
    {
      tag: "引擎 03 · 冷链护航",
      pre: "高规格 ",
      accent: "医药冷链全程监控",
      post: "",
      desc: "集装箱级温度与湿度每两秒实时采集存证，货物在途出现任何超出 2–8°C 医药受控温区异常即刻触发告警。",
      bullets: [
        "单箱颗粒度：温湿度与地理坐标每2秒高频采集",
        "箱内温度突破 2–8°C 安全阈值即刻发出声光告警",
        "温度履历与提单绑定，贯穿港口至最终闸口全程",
      ],
      chips: ["2–8°C 受控温区", "温湿度越界告警", "单箱级全程存证"],
      statLabel: "单箱温度采集刷新间隔",
      panel: { title: "药品冷链监控控制台", status: "2–8°C 恒温" },
      notes: {
        head: "冷藏集装箱 · CT-118",
        band: "安全温区 · 2–8°C",
        excursion: "温控超标预警",
        logged: "每2秒实时记录",
        hi: "8°C",
        lo: "2°C",
        rangeK: "受控温区",
        rangeV: "2–8°C",
        intervalK: "采样间隔",
        intervalV: "2秒",
        statusK: "越界事件",
        statusV: "1起预警",
      },
    },
    {
      tag: "引擎 04 · 贸易合规",
      pre: "ACID 与提单 ",
      accent: "多维单证智能校验",
      post: "",
      desc: "在船舶开航前自动核验埃及 ACID 预申报编号与海运提单要素，确保异常在订舱阶段即获纠正，免遭到港退运。",
      bullets: [
        "订舱单、海运提单、集装箱号与 ACID 统一核对归档",
        "单证要素矛盾或预审驳回在订舱阶段即行预警排除",
        "贯通七大类单证；客户合规申报，YASLOGIST 实时监控核验",
      ],
      chips: ["ACID 智能复核", "提单一致性校验", "开航前风险拦截"],
      statLabel: "开航前协同交叉核验单证类型",
      panel: { title: "单证合规对账中心", status: "离港前审核" },
      notes: {
        head: "货运单证综合记录",
        ok: "核验一致",
        flag: "订舱阶段驳回预警",
        ref0: "订舱单号",
        ref1: "海运提单 (B/L)",
        ref2: "集装箱号",
        ref3: "埃及 ACID 号",
        ref4: "出入闸通行单",
        foot: "由货主或合规报关行申报。YASLOGIST 负责数据交叉验证与一致性监控，不代行申报权责。",
        countV: "7类",
        countK: "单证类型",
      },
    },
    {
      tag: "引擎 05 · 可信存证",
      pre: "防篡改 ",
      accent: "供应链分布式共享账本",
      post: "",
      desc: "每一项单据放行、款项支付与交接签收均登记在防篡改共享记录中，伪造电子放货单或重复提货在闸口前被即刻拦截。",
      bullets: [
        "所有放行单证与货物交接全过程留痕于防篡改账本",
        "伪造放行指令或重复提单在抵岸进闸前自动识别阻断",
        "客户、货代、港口及监管方共享同一不可篡改的数据视界",
      ],
      chips: ["防篡改机制", "数字电子提单", "不可逆审计追踪"],
      statLabel: "区块账本记录存证耗时",
      panel: { title: "去中心化共享账本", status: "已完成验证" },
      notes: {
        contract: "多方协作契约 · 交接存证",
        ledger: "已确认区块",
        step1: "上链记录",
        step2: "多方验证",
        step3: "协同对账",
        step4: "终局确认",
        note: "所有核心单据与交接节点均在约 2.1 秒内完成账本存证，全链路参与方均享有穿透式核验视图。",
        verified: "已存证验证",
      },
    },
  ],
  closing: {
    tag: "业务洽谈 · 平台创始人",
    title1: "一通直接对话",
    title2: "开启拥有思考能力的现代智慧物流体系。",
    sub: "您的讯息将直达创始人本人 — 无需漫长等待，无繁琐表单，无机器人应答。",
    built: "由供应链与物流专家 Ahmed Yasser Ali 独立架构并全栈研发",
    office: "YASLOGIST 运营总部 — 埃及开罗·新开罗",
    ctaWhats: "直接联系创始人 (WhatsApp)",
    ctaCall: "立即拨打电话",
    phone: "+20 104 113 9910",
    note: "全天候 24/7 开放 · 支持直接通话与即时沟通",
    short: "立即联系",
  },
  footer: {
    blurb: "专为埃及海运打造的供应链智能中枢 — 集装箱与船舶动态感知、预测性准点率算法，以及贯穿海陆联运的单一货运记录底座。",
    cols: [
      { head: "公司信息", links: ["关于 YASLOGIST", "创始人简介", "法律条款", "业务联系"] },
      { head: "业务覆盖", links: ["海运智能", "陆运干线", "埃及海运枢纽", "海陆联运接驳"] },
      { head: "核心技术", links: ["单一数据记录", "预测性 ETA", "单证智能核验", "边界承诺"] },
    ],
    bottom: "© 2026 YASLOGIST · 埃及跨陆海空综合货运单一记录数字中枢 · 版权所有",
    terms: "使用条款",
    privacy: "隐私政策",
    security: "安全说明",
    back: "返回顶部",
    close: "关闭",
    legal: {
      terms: [
        "YASLOGIST 是一家运营于埃及开罗新开罗企业总部的供应链智能化科技平台。",
        "本站点所展示的船舶遥测数据、港口作业指标及仿真推演输出均为用于概念演示的数学推演模型，非现场实时作业指令，严禁直接用于实际船舶航线调度、租船合约或海关法定申报决策。",
        "本推演引擎严格依托国际海事组织 (IMO DCS) 公布的标准基准开展演算，所得结论仅具推测与参考价值，不构成对任何具体特定航次运营结果的法律担保。",
        "YASLOGIST 品牌名称、商标、软件界面及算法逻辑均为平台创始人智力成果，未经明确授权许可不得擅自复制或用于商业目的。",
      ],
      privacy: [
        "本网站不收集任何访客个人信息。页面未集成任何统计分析探针、广告追踪脚本、Cookie 或进行用户画像的第三方组件。",
        "您设备本地仅会存储两项轻量配置参数：主题偏好与所选语言代码。此数据完全保留在您本地浏览器的 localStorage 中，供下次访问时恢复显示，绝不上传至任何服务器，清除浏览器数据即可重置。",
        "本平台无需注册账户，亦绝不索取任何个人身份敏感信息。页面中的联系链接直接唤起您设备本地的电话或即时通讯工具，后续所有沟通均由第三方通讯服务协议保护，脱离本站环境。",
        "所有背景渲染视效、三维几何资源及界面字体均为静态部署分发，本站点内任何表单组件均不向任何后端服务器提交数据。",
      ],
      security: [
        "本平台前端采用纯静态架构交付，不设立任何中心化数据库或用户会话缓存，从物理架构层面消除用户隐私被窃取或入侵的数据面泄露风险。",
        "生产环境全站强制采用现代 HTTPS 高强度加密协议传输，所有逻辑完全在您的客户端浏览器沙箱内安全渲染运行，不对您的本地操作系统申请任何高危权限。",
        "页面中呈现的区块链上链存证、多节点遥测及账本流转均为用于阐释不可篡改物流理念的推演模型，不直连任何公开公链或主网，亦不涉及任何真实货币清算与资产交割。",
        "若您在代码或网络配置中发现任何安全隐患或漏洞，请随时通过页脚披露的创始人直连渠道直接向创始人报告。",
      ],
    },
  },
  hud: {
    flow: "视点追踪",
    depth: "架构层级",
    camNote: "CAM ▸ 高度 2,400米 · 航速协同",
    depthNote: "网络深度 · 7个子系统",
    utc: "UTC · 船队时钟同步良好",
    health: "系统状态 · 正常",
    sys: "HTTPS · 静态安全分发",
    dots: ["全景概览", "解决方案", "决策推演", "需求预测", "泊位态势", "药品冷链", "单证核验", "存证账本", "业务洽谈"],
  },
  clock: { cairo: "开罗", shanghai: "上海", rotterdam: "鹿特丹" },
  model: {
    badge: "推演仿真模型 · 非现场运营实测数据",
    badgeShort: "仿真模型",
  },
  brandPlate: {
    sub: "总部 · 开罗",
  },
};


const tr: Dict = {
  nav: {
    links: ["Tahminleme", "Rıhtım", "Soğuk Zincir", "Belgeler", "Defter"],
    status: "Tüm Sistemler Nominal",
    sub: "Yeni Nesil Tedarik Zinciri İstihbarat Platformu",
  },
  founder: {
    lead: "Platform Kurucusu",
    name: "Ahmed Yasser Ali",
    title: "Tedarik Zinciri ve Lojistik Uzmanı",
    org: "YASLOGIST · Yeni Kahire, Kahire",
  },
  hero: {
    tag: "Mısır deniz taşımacılığı · tek kayıt üzerinden gümrükleme ve takip",
    title1: "Her konteyner.",
    title2: "Rıhtımdan kapıya, tek kayıt.",
    sub: "Gemi seyre çıkmadan önce ACID ve konşimento beyanı. İskenderiye, El Dekheila, Ayn Suhna, Dimyat ve Doğu Port Said genelinde canlı konum ve rıhtım sırası. Her referans teslim alan kamyona kadar eksiksiz aktarılır.",
    cta1: "Nasıl Çalıştığını İnceleyin",
    cta2: "Filo Görünümünü Aç",
    badges: ["Liman yerine rıhtıma varış tahmini", "5 Mısır deniz kapısı", "Konşimentodan kamyon plakasına tek kayıt"],
    scroll: "Derinlemesine incelemek için kaydırın",
    telemetry: {
      vessel: "Gemi · Örnek",
      live: "Canlı",
      speed: "Yere Göre Hız (SOG)",
      flag: "BAYRAK · SGP",
      heading: "Rota Açısı",
      draft: "Draft / Su Çekimi",
      cargo: "Yük",
      eta: "Tahmini Varış",
      route: "Rota",
      etaNote: "Doğu Port Said Tahmini Varış · 2g 04s 12d — Yapay zeka yeniden rotalama aktif",
    },
  },
  stats: {
    items: [
      { label: "Kapsanan Mısır deniz kapısı", note: "İskenderiye · Dekheila · Suhna · Dimyat · D. Port Said" },
      { label: "Birbirine bağlanan belge türü", note: "rezervasyon → B/L → konteyner → plaka" },
      { label: "Konum yenileme sıklığı", note: "Liman yakını AIS · rıhtım sırası anlık analiz" },
      { label: "5 gün önceden ±6 saat ETA hassasiyeti", note: "Modellenmiş veri · Şartlara bakınız" },
    ],
  },
  pillarsIntro: {
    tag: "Beş Temel Motor",
    title1: "Tek platform.",
    title2: "Beş devrimsel inovasyon.",
    sub: "Bir sevkiyatın taşıdığı tüm referanslar tek bir kayıtta okunur: rezervasyon, B/L, konteyner, ACID, plaka. Beş motor, kaydın önceden tespit ettiği maliyet risklerini önler.",
  },
  solutions: {
    tag: "Beş Kronik Darboğaz",
    title1: "Maliyetli beş darboğazı",
    title2: "çözmek için geliştirilen motor.",
    sub: "Deniz taşımacılığındaki beş maliyet merkezinin her biri için özel çözüm platformu.",
    items: [
      {
        title: "Boş Konteyner Konumlandırma Maliyeti",
        desc: "Yapay zeka; küresel akışları, hava koşullarını ve liman yoğunluğunu okuyarak boş konteyner dengesizliklerini erken aşamada işaretler.",
        metric: "%94.2",
        metricLabel: "Tahmin doğruluğu",
      },
      {
        title: "Rıhtım Sırası ve Demoraj",
        desc: "Gemi AIS ve terminal rıhtım durumu gerçek zamanlıya yakın okunur; terminalde oluşan yığılma faturaya dönüşmeden önce tespit edilir.",
        metric: "60sn",
        metricLabel: "AIS yenileme",
      },
      {
        title: "İlaç Soğuk Zincir Kırılmaları",
        desc: "Sıcaklık ve nem her iki saniyede bir konumla birlikte kaydedilir; 2–8°C aralığı dışındaki sapmalar depoya varmadan önce konteynerde tespit edilir.",
        metric: "2–8°C",
        metricLabel: "İzlenen aralık",
      },
      {
        title: "ACID ve B/L Reddi",
        desc: "ACID ve konşimento referansları gemi kalkmadan önce eşleştirilip doğrulanır; böylece ret durumları gümrük kapısında değil rezervasyonda çözülür.",
        metric: "7",
        metricLabel: "Eşleştirilen referans türü",
      },
      {
        title: "Evrak ve Teslim Sahteciliği",
        desc: "Her belge, ödeme ve teslimat kurcalamaya karşı korumalı paylaşımlı deftere işlenir; sahte teslim veya mükerrer konşimento kapıdan geçemez.",
        metric: "2.1sn",
        metricLabel: "Kayıt kesinleşmesi",
      },
    ],
  },
  sim: {
    tag: "Bölüm 03 · Canlı Karar Motoru",
    title1: "Optimize edilmiş tek bir seferin",
    title2: "gerçek ekonomik değeri.",
    sub: "Yük hacminizi ve mesafenizi belirleyin. Motor, o seferde optimizasyonun sağladığı karbon, zaman ve maliyet kazanımını anında hesaplasın.",
    teuLabel: "Filo Kargo Hacmi",
    teuUnit: "TEU",
    nmLabel: "Rota Mesafesi",
    nmUnit: "NM",
    presetsTeu: "Yük profili",
    presetsNm: "Ticaret rotası",
    teuPresets: ["Besleyici (Feeder)", "Bölgesel", "Panamax", "Neo-Panamax", "Megamax"],
    nmPresets: ["Akdeniz & Kızıldeniz kısa mesafe", "Körfez–Kızıldeniz koridoru", "Kuzey Avrupa–Akdeniz", "Uzak Doğu–Mısır uzun mesafe"],
    outputs: "Canlı motor çıktısı",
    demoNote: "İnteraktif simülasyon · IMO DCS yayınlanmış baz hatlarına dayalı gösterge değerler",
    cfTitle: "Alternatif · hız öncelikli koridor",
    cfNote: "Modellenmiş senaryo — aynı motor, karbon yerine transit süreye öncelik verilmiş koridor",
    cfTime: "daha hızlı",
    cfCo2: "daha fazla karbon",
    cfCost: "daha az tasarruf",
    cfTonne: "t",
    co2: "Karbon Azaltımı",
    co2Unit: "önlenen ton CO₂",
    time: "Önlenen Demoraj Günü",
    cost: "Geri Kazanılan Operasyonel Maliyet",
    costUnit: "Sefer başına USD",
    fuel: "Tasarruf Edilen Yakıt",
    fuelUnit: "ton bunker yakıtı",
    esg: "Emisyon Skoru /100",
    note: "Model v9.4 · IMO DCS standartları · gösterge niteliğinde tahminlerdir, operasyonel tavsiye değildir",
    origin: "Çıkış",
    dest: "Varış",
    eta: "Optimize Edilmiş Varış",
    reroute: "AI rota optimizasyonu uygulandı",
    day: "g",
    hour: "s",
  },
  pillars: [
    {
      tag: "Motor 01 · Akıl",
      pre: "Yapay Zeka ",
      accent: "Talep ve Konumlandırma Tahmini",
      post: "",
      desc: "Yayınlanan akışları, hava koşullarını ve liman baskısını okuyarak boş konteyner dengesizliklerini erkenden uyarır.",
      bullets: [
        "12 saat ile 12 ay öncesine kadar boş konteyner dengesizliğini işaretler",
        "Canlı hava durumunu, liman yükünü ve hat baskısını analiz eder",
        "Müdahale için yeterli zaman varken yeniden konumlandırma riskini gösterir",
      ],
      chips: ["Makine Öğrenimi", "Öngörülü ETA", "Talep Algılama"],
      statLabel: "Kapsanan hatlarda tahmin doğruluğu",
      panel: { title: "Yeniden Konumlandırma Tahmini", status: "Model v9.4" },
      notes: {
        chart: "Canlı çıkarım",
        legend: "Dört canlı sinyal · tek konumlandırma bayrağı",
        layerIn: "Giriş sinyalleri",
        layerHidden: "Model",
        layerOut: "Konumlandırma sinyali",
        in0: "Talep",
        in1: "Hava",
        in2: "Liman yükü",
        in3: "Yakıt",
        rt0: "Fazla",
        rt1: "Yönlendirme",
        rt2: "Açık",
        horizon: "Zaman Ufku",
        horizonV: "12S",
        accuracy: "Doğruluk",
        accuracyV: "%94.2",
        empty: "Boş Mil",
        emptyV: "−%38",
      },
    },
    {
      tag: "Motor 02 · Görünürlük",
      pre: "Gerçek Zamanlı ",
      accent: "Rıhtım ve Gemi Görünürlüğü",
      post: "",
      desc: "Mısır'ın 5 deniz kapısında gemi AIS verilerini ve terminal rıhtım durumunu okur; rıhtımdaki yığılma faturaya dönüşmeden görünür.",
      bullets: [
        "Liman yakınında yenilenen AIS konumu ve rıhtım durumu",
        "Oluşan rıhtım kuyruğu demoraj saati başlamadan tespit edilir",
        "Her gemi rezervasyonu, konşimentosu ve konteyneri ile doğrudan eşleştirilir",
      ],
      chips: ["AIS Akışı", "Rıhtım Durumu", "Demoraj Takibi"],
      statLabel: "Liman yakınında AIS yenileme",
      panel: { title: "Liman Rıhtım Görünümü", status: "AIS · anlık" },
      notes: {
        sector: "Sektör",
        sectorV: "07 · Canlı",
        range: "Menzil",
        rangeV: "12.0 NM",
        contacts: "Hedefler",
        sweep: "Tarama",
        vessel: "Gemi",
        route: "Rota",
        speed: "Hız",
        temp: "Sıcaklık",
        load: "Yük",
      },
    },
    {
      tag: "Motor 03 · Soğuk Zincir",
      pre: "Hassas ",
      accent: "İlaç Soğuk Zincir Takibi",
      post: "",
      desc: "Her iki saniyede bir konumla birlikte sıcaklık ve nem kaydedilir; 2–8°C aralığı dışındaki sapmalar kutu henüz denizdeyken işaretlenir.",
      bullets: [
        "Her konteyner için 2 saniyede bir sıcaklık ve nem okuması",
        "2–8°C dışındaki sapmalar başladığı an uyarı verilir",
        "Kayıt verisi kapıya kadar konteyner referansıyla birlikte taşınır",
      ],
      chips: ["2–8°C Aralığı", "Sapma Uyarıları", "Konteyner Başına Kayıt"],
      statLabel: "Konteyner başına kayıt aralığı",
      panel: { title: "Soğuk Zincir Monitörü", status: "2–8°C" },
      notes: {
        head: "Konteyner · CT-118",
        band: "Güvenli aralık · 2–8°C",
        excursion: "Sapma tespit edildi",
        logged: "2 saniyede bir kaydedilir",
        hi: "8°C",
        lo: "2°C",
        rangeK: "İzlenen aralık",
        rangeV: "2–8°C",
        intervalK: "Aralık",
        intervalV: "2sn",
        statusK: "Sapmalar",
        statusV: "1 tespit",
      },
    },
    {
      tag: "Motor 04 · Uyum",
      pre: "ACID ve Konşimento ",
      accent: "Referans Eşleme",
      post: "",
      desc: "ACID ve konşimento referansları gemi seyre çıkmadan önce çapraz kontrol edilir; böylece reddedilen başvurular kapıda değil rezervasyonda düzeltilir.",
      bullets: [
        "Rezervasyon, konşimento, konteyner ve ACID tek kayıtta uzlaştırılır",
        "Uyuşmazlık veya ret kapıda değil rezervasyonda uyarılır",
        "Yedi referans türü eşleştirilir; müşteri beyan eder, YASLOGIST takip eder",
      ],
      chips: ["ACID Çapraz Kontrol", "B/L Doğrulama", "Seyir Öncesi Uyarı"],
      statLabel: "Seyir öncesi doğrulanan referans türü",
      panel: { title: "Referans Mutabakatı", status: "Seyir öncesi" },
      notes: {
        head: "Sevkiyat kaydı",
        ok: "Eşleşti",
        flag: "Rezervasyonda reddedildi",
        ref0: "Rezervasyon",
        ref1: "Konşimento (B/L)",
        ref2: "Konteyner",
        ref3: "ACID",
        ref4: "Kapı Giriş İzni",
        foot: "Müşteri veya gümrük müşaviri tarafından beyan edilir. YASLOGIST referans tutarlılığını denetler, doğrudan beyanda bulunmaz.",
        countV: "7",
        countK: "Referans türü",
      },
    },
    {
      tag: "Motor 05 · Güven",
      pre: "Değiştirilemez ",
      accent: "Paylaşımlı Kayıt Defteri",
      post: "",
      desc: "Her belge ve teslimat kurcalamaya karşı korumalı paylaşımlı kayda yazılır; böylece sahte teslimat veya mükerrer B/L kapıdan geçmeden yakalanır.",
      bullets: [
        "Her belge ve devir işlemi değiştirilemez kayda işlenir",
        "Sahte teslimat veya mükerrer konşimento kapı öncesinde engellenir",
        "Müşteri, müşavir ve limanın birlikte okuyabildiği tek ortak kayıt",
      ],
      chips: ["Değiştirilemez", "Dijital B/L", "Denetim İzi"],
      statLabel: "Kayıt yazma süresi",
      panel: { title: "Güvenli Paylaşımlı Defter", status: "Doğrulandı" },
      notes: {
        contract: "Ortak Kayıt · Devir",
        ledger: "İşlenmiş bloklar",
        step1: "Kayıt",
        step2: "Doğrulama",
        step3: "Mutabakat",
        step4: "İşleme",
        note: "Her belge ve devir yaklaşık 2.1 saniyede ortak kayda yazılır ve sevkiyattaki tüm taraflara görünür kalır.",
        verified: "Doğrulandı",
      },
    },
  ],
  closing: {
    tag: "İletişim · Platform Kurucusu",
    title1: "Düşünen bir tedarik zinciriyle",
    title2: "aranızda tek bir doğrudan görüşme var.",
    sub: "Mesajınız doğrudan kurucuya ulaşır — bekleme sırası yok, form yok, yapay zeka botu yok.",
    built: "Tedarik Zinciri ve Lojistik Uzmanı Ahmed Yasser Ali tarafından sıfırdan geliştirildi",
    office: "YASLOGIST Genel Merkez — Yeni Kahire, Kahire, Mısır",
    ctaWhats: "Kurucuya Doğrudan Mesaj Gönder",
    ctaCall: "Hemen Ara",
    phone: "+20 104 113 9910",
    note: "7/24 Aktif · Doğrudan arama ve mesaj",
    short: "İletişim",
  },
  footer: {
    blurb: "Mısır deniz taşımacılığı için tedarik zinciri istihbaratı — konteyner ve gemi görünürlüğü, öngörülü ETA'lar ve karayoluna kadar süren tek sevkiyat kaydı.",
    cols: [
      { head: "Şirket", links: ["YASLOGIST Hakkında", "Kurucu", "Yasal", "İletişim"] },
      { head: "Kapsam", links: ["Deniz", "Kara", "Mısır Limanları", "Karayolu Devri"] },
      { head: "Yaklaşım", links: ["Tek Kayıt", "Öngörülü ETA", "Referans Eşleme", "Hizmet Sınırlarımız"] },
    ],
    bottom: "© 2026 YASLOGIST · Mısır'da kara, deniz ve hava genelinde tek sevkiyat kaydı · Tüm hakları saklıdır",
    terms: "Şartlar",
    privacy: "Gizlilik",
    security: "Güvenlik",
    back: "Yukarı dön",
    close: "Kapat",
    legal: {
      terms: [
        "YASLOGIST, Yeni Kahire, Kahire, Mısır'daki kurumsal merkezinden işletilen bir tedarik zinciri istihbarat platformudur.",
        "Bu sitede gösterilen tüm gemi telemetrisi, liman rakamları ve simülatör çıktıları tanıtım amacıyla sunulan gösterge modellerdir. Gerçek canlı operasyonel veri değildir; ticari rota belirleme veya yasal uyum kararları için dayanak alınamaz.",
        "Simülatör, kullanıcı tarafından girilen değerlere yayınlanmış IMO DCS baz hatlarını uygular. Sonuçlar tahmini niteliktedir ve belirli bir sefer için garanti verilmez.",
        "YASLOGIST adı, logosu ve arayüzü platform kurucusunun fikri mülkiyetidir. Kullanımdan önce izin alınmalıdır.",
      ],
      privacy: [
        "Bu web sitesi hiçbir veri toplamaz. Analiz betikleri, reklam izleyicileri, çerezler veya kullanıcı profili oluşturan üçüncü taraf eklentiler bulunmaz.",
        "Cihazınızda saklanan yegane veriler tema ve dil tercihlerinizdir; sonraki ziyaretinizde hatırlanması için tarayıcınızın yerel depolama alanında tutulur ve cihazınızdan asla ayrılmaz.",
        "Hesap açma zorunluluğu yoktur ve hiçbir aşamada kişisel bilgi talep edilmez. İletişim bağlantıları cihazınızdaki yerel uygulamaları açar.",
        "Arka plan görselleri ve yazı tipleri statik varlıklar olarak sunulur. Sitedeki hiçbir form harici bir sunucuya veri iletmez.",
      ],
      security: [
        "Platform tamamen statik bir ön uç mimarisidir. Arka uç sunucusu, veritabanı veya kullanıcı oturumu bulunmadığından ele geçirilebilecek hiçbir kişisel veri yoktur.",
        "Tüm varlıklar prodüksiyon ortamında HTTPS üzerinden sunulur. Arayüz tamamen tarayıcınızda çalışır ve cihazınızda yetkili hiçbir işlem gerçekleştirmez.",
        "Blok zinciri ve defter görselleri değiştirilemez bir tedarik zincirinin çalışma mantığını gösteren modellerdir; gerçek bir ağa bağlı değildir.",
        "Olası bir güvenlik açığı tespit ettiğinizi düşünüyorsanız, lütfen doğrudan platform kurucusuna bildiriniz.",
      ],
    },
  },
  hud: {
    flow: "Kamera Akışı",
    depth: "Derinlik",
    camNote: "KAM ▸ İRTİFA 2.400M · HIZ SENKRONİZASYONU",
    depthNote: "Ağ Derinliği · 7 Modül",
    utc: "UTC · FİLO SENKRONİZASYONU NOMİNAL",
    health: "DURUM · NOMİNAL",
    sys: "HTTPS · STATİK TESLİMAT",
    dots: ["Genel Bakış", "Çözümler", "Simülatör", "Tahminleme", "Rıhtım", "Soğuk Zincir", "Belgeler", "Defter", "İletişim"],
  },
  clock: { cairo: "Kahire", shanghai: "Şanghay", rotterdam: "Rotterdam" },
  model: {
    badge: "Gösterge modeli · canlı veri değildir",
    badgeShort: "Simüle",
  },
  brandPlate: {
    sub: "Merkez · Kahire",
  },
};


const fr: Dict = {
  nav: {
    links: ["Prévision", "À Quai", "Chaîne du Froid", "Références", "Registre"],
    status: "Tous Systèmes Nominaux",
    sub: "Plateforme d'Intelligence Logistique Nouvelle Génération",
  },
  founder: {
    lead: "Fondateur de la Plateforme",
    name: "Ahmed Yasser Ali",
    title: "Spécialiste Supply Chain & Logistique",
    org: "YASLOGIST · New Cairo, Le Caire",
  },
  hero: {
    tag: "Fret maritime égyptien · dédouané et suivi sur un registre unique",
    title1: "Chaque conteneur.",
    title2: "Un seul registre, du quai à la porte.",
    sub: "Numéro ACID et connaissement déclarés avant l'appareillage. Position en direct et file d'attente aux postes à quai à Alexandrie, El Dekheila, Sokhna, Damiette et Port-Saïd Est. Chaque référence est transmise au camion de ramassage.",
    cta1: "Découvrir le Fonctionnement",
    cta2: "Ouvrir la Vue Flotte",
    badges: ["ETA au poste à quai, pas au port", "5 passerelles maritimes égyptiennes", "Du B/L à la plaque d'immatriculation"],
    scroll: "Faites défiler pour explorer",
    telemetry: {
      vessel: "Navire · Échantillon",
      live: "En direct",
      speed: "Vitesse fond (SOG)",
      flag: "PAVILLON · SGP",
      heading: "Cap",
      draft: "Tirant d'eau",
      cargo: "Cargaison",
      eta: "ETA",
      route: "Route",
      etaNote: "ETA Port-Saïd Est · 2j 04h 12m — Déroutement IA actif",
    },
  },
  stats: {
    items: [
      { label: "Passerelles maritimes égyptiennes couvertes", note: "Alexandrie · Dekheila · Sokhna · Damiette · Port-Saïd Est" },
      { label: "Types de références unifiées", note: "booking → B/L → conteneur → plaque" },
      { label: "Fréquence d'actualisation AIS", note: "AIS zone portuaire · file d'attente réévaluée" },
      { label: "ETA à ±6h à 5 jours de l'arrivée", note: "Valeur modélisée · voir Conditions" },
    ],
  },
  pillarsIntro: {
    tag: "Les Cinq Moteurs",
    title1: "Une seule plateforme.",
    title2: "Cinq révolutions.",
    sub: "Chaque référence de l'expédition est lue sur un registre unique : réservation, B/L, conteneur, ACID, immatriculation. Cinq moteurs prévenant les surcoûts en amont.",
  },
  solutions: {
    tag: "Cinq Goulets d'Étranglement",
    title1: "Le moteur conçu pour résoudre",
    title2: "cinq goulets d'étranglement majeurs.",
    sub: "Cinq centres de coûts récurrents dans le fret maritime. Une plateforme dédiée pour chacun.",
    items: [
      {
        title: "Coût de Repositionnement à Vide",
        desc: "L'IA analyse les flux mondiaux, la météo et la congestion portuaire pour anticiper les déséquilibres de conteneurs vides.",
        metric: "94.2%",
        metricLabel: "Précision de prévision",
      },
      {
        title: "File d'Attente à Quai & Surestaries",
        desc: "L'AIS du navire et l'état des postes à quai sont lus en quasi temps réel ; l'encombrement est détecté avant la facture de surestaries.",
        metric: "60s",
        metricLabel: "Actualisation AIS",
      },
      {
        title: "Ruptures de la Chaîne du Froid Pharma",
        desc: "Température et humidité sont enregistrées avec la position toutes les deux secondes ; toute excursion hors de 2–8°C est alertée immédiatement.",
        metric: "2–8°C",
        metricLabel: "Plage surveillée",
      },
      {
        title: "Rejets ACID et Connaissement B/L",
        desc: "Les références ACID et connaissement sont rapprochées avant l'appareillage ; toute non-conformité est signalée dès le booking.",
        metric: "7",
        metricLabel: "Types de références reliées",
      },
      {
        title: "Fraude Documentaire et Faux Bons de Sortie",
        desc: "Chaque document, paiement et transfert est scellé sur un registre partagé inaltérable ; aucune fausse mainlevée ne franchit la porte.",
        metric: "2.1s",
        metricLabel: "Confirmation au registre",
      },
    ],
  },
  sim: {
    tag: "Section 03 · Moteur Décisionnel en Direct",
    title1: "La valeur réelle d'un voyage",
    title2: "entièrement optimisé.",
    sub: "Définissez votre volume et votre distance. Le moteur calcule la valeur ajoutée exacte sur ce voyage — carbone, jours et coûts réévalués en direct.",
    teuLabel: "Volume Fret de la Flotte",
    teuUnit: "EVP",
    nmLabel: "Distance de la Route",
    nmUnit: "NM",
    presetsTeu: "Profil cargaison",
    presetsNm: "Corridor maritime",
    teuPresets: ["Feeder", "Régional", "Panamax", "Néo-Panamax", "Megamax"],
    nmPresets: ["Méditerranée & Mer Rouge courte distance", "Corridor Golfe–Mer Rouge", "Europe du Nord–Méditerranée", "Extrême-Orient–Égypte long-courrier"],
    outputs: "Résultats en direct",
    demoNote: "Démonstration interactive · chiffres indicatifs selon les référentiels publiés IMO DCS",
    cfTitle: "Alternative · corridor axé sur la vitesse",
    cfNote: "Scénario modélisé — même moteur, corridor pondéré sur le temps de transit plutôt que sur le carbone",
    cfTime: "plus rapide",
    cfCo2: "plus de carbone",
    cfCost: "moins d'économies",
    cfTonne: "t",
    co2: "Réduction Carbone",
    co2Unit: "tonnes de CO₂ évitées",
    time: "Jours de Surestaries Évités",
    cost: "Coûts Opérationnels Récupérés",
    costUnit: "USD par voyage",
    fuel: "Carburant Préservé",
    fuelUnit: "tonnes de soutes",
    esg: "Score Émissions /100",
    note: "Modèle v9.4 · Référentiels IMO DCS · estimations indicatives, ne constitue pas un conseil opérationnel",
    origin: "Origine",
    dest: "Destination",
    eta: "Arrivée Optimisée",
    reroute: "Déroutement IA appliqué",
    day: "j",
    hour: "h",
  },
  pillars: [
    {
      tag: "Moteur 01 · Intelligence",
      pre: "Prévision IA de ",
      accent: "Demande et de Repositionnement",
      post: "",
      desc: "Analyse les flux publiés, les conditions météo et la pression portuaire pour signaler les déséquilibres de conteneurs vides avant tout repositionnement forcé.",
      bullets: [
        "Anticipe les déséquilibres de conteneurs vides de 12 heures à 12 mois",
        "Intègre la météo en direct, la charge portuaire et la pression des corridors",
        "Met en évidence le risque de repositionnement lorsqu'il est encore temps d'agir",
      ],
      chips: ["Machine Learning", "ETA Prédictive", "Détection de Demande"],
      statLabel: "Précision prédictive sur les routes couvertes",
      panel: { title: "Prévision de Repositionnement", status: "Modèle v9.4" },
      notes: {
        chart: "Inférence en direct",
        legend: "Quatre signaux en direct · une alerte repositionnement",
        layerIn: "Signaux d'entrée",
        layerHidden: "Modèle",
        layerOut: "Alerte repositionnement",
        in0: "Demande",
        in1: "Météo",
        in2: "Charge portuaire",
        in3: "Carburant",
        rt0: "Excédent",
        rt1: "Repositionnement",
        rt2: "Déficit",
        horizon: "Horizon",
        horizonV: "12H",
        accuracy: "Précision",
        accuracyV: "94.2%",
        empty: "Milles à vide",
        emptyV: "−38%",
      },
    },
    {
      tag: "Moteur 02 · Visibilité",
      pre: "Visibilité en Temps Réel ",
      accent: "Navires et Postes à Quai",
      post: "",
      desc: "Suit l'AIS des navires et la disponibilité des postes à quai sur les cinq passerelles égyptiennes pour anticiper les surestaries.",
      bullets: [
        "Position AIS et état des postes à quai actualisés en approche portuaire",
        "La file d'attente à quai est identifiée avant le déclenchement des surestaries",
        "Chaque navire est rattaché à son booking, son connaissement et ses conteneurs",
      ],
      chips: ["Flux AIS", "État des Postes à Quai", "Surveillance Surestaries"],
      statLabel: "Actualisation AIS en zone portuaire",
      panel: { title: "Vue des Postes Portuaires", status: "AIS · quasi temps réel" },
      notes: {
        sector: "Secteur",
        sectorV: "07 · En direct",
        range: "Portée",
        rangeV: "12.0 NM",
        contacts: "Cibles",
        sweep: "Balayage",
        vessel: "Navire",
        route: "Route",
        speed: "Vitesse",
        temp: "Température",
        load: "Charge",
      },
    },
    {
      tag: "Moteur 03 · Chaîne du Froid",
      pre: "Surveillance de la ",
      accent: "Chaîne du Froid Pharma",
      post: "",
      desc: "Température et humidité relevées toutes les deux secondes avec la géolocalisation ; toute dérive hors de 2–8°C est signalée en mer.",
      bullets: [
        "Relevé de température et humidité toutes les deux secondes par conteneur",
        "Toute excursion hors de 2–8°C est alertée à la seconde près",
        "L'historique accompagne la marchandise de la passerelle jusqu'à la porte",
      ],
      chips: ["Plage 2–8°C", "Alertes d'Excursion", "Historique par Conteneur"],
      statLabel: "Intervalle de relevé par conteneur",
      panel: { title: "Surveillance Chaîne du Froid", status: "2–8°C" },
      notes: {
        head: "Conteneur · CT-118",
        band: "Plage sécurisée · 2–8°C",
        excursion: "Alerte excursion",
        logged: "Enregistré toutes les 2s",
        hi: "8°C",
        lo: "2°C",
        rangeK: "Plage surveillée",
        rangeV: "2–8°C",
        intervalK: "Intervalle",
        intervalV: "2s",
        statusK: "Excursions",
        statusV: "1 alerte",
      },
    },
    {
      tag: "Moteur 04 · Conformité",
      pre: "Rapprochement des Références ",
      accent: "ACID & Connaissement",
      post: "",
      desc: "Contrôle croisé des références ACID et du connaissement avant l'appareillage pour corriger les rejets dès la réservation.",
      bullets: [
        "Booking, connaissement, conteneur et ACID réconciliés sur un seul dossier",
        "Toute incohérence est signalée dès la réservation, pas à la porte",
        "Sept types de références unifiés : le client déclare, YASLOGIST veille",
      ],
      chips: ["Contrôle Croisé ACID", "Conformité B/L", "Validation Pré-Départ"],
      statLabel: "Types de références vérifiés avant départ",
      panel: { title: "Rapprochement Documentaire", status: "Pré-départ" },
      notes: {
        head: "Dossier d'expédition",
        ok: "Conforme",
        flag: "Rejeté au booking",
        ref0: "Réservation",
        ref1: "Connaissement (B/L)",
        ref2: "Conteneur",
        ref3: "ACID",
        ref4: "Bon d'Accès Porte",
        foot: "Déclaré par le client ou son transitaire agréé. YASLOGIST contrôle la concordance des références, sans déposer la déclaration en douane.",
        countV: "7",
        countK: "Types de références",
      },
    },
    {
      tag: "Moteur 05 · Confiance",
      pre: "Registre Partagé ",
      accent: "Inaltérable et Vérifiable",
      post: "",
      desc: "Chaque document et transfert consigné sur un registre partagé inaltérable pour empêcher la contrefaçon de bons de sortie.",
      bullets: [
        "Chaque document et transfert inscrit sur un registre inaltérable",
        "Tout faux bon de sortie ou B/L dupliqué est bloqué avant la porte",
        "Un registre unique accessible au client, au transitaire et au port",
      ],
      chips: ["Inaltérable", "B/L Numérique", "Piste d'Audit"],
      statLabel: "Délai d'écriture au registre",
      panel: { title: "Registre Inaltérable Partagé", status: "Vérifié" },
      notes: {
        contract: "Registre Partagé · Transfert",
        ledger: "Blocs validés",
        step1: "Enregistrement",
        step2: "Vérification",
        step3: "Rapprochement",
        step4: "Validation",
        note: "Chaque document s'inscrit au registre partagé en environ 2.1s, avec une visibilité totale pour les parties prenantes.",
        verified: "Vérifié",
      },
    },
  ],
  closing: {
    tag: "Contact · Fondateur de la Plateforme",
    title1: "Un seul échange direct vous sépare",
    title2: "d'une chaîne logistique intelligente.",
    sub: "Votre message lui parvient directement — sans file d'attente, sans formulaire, sans robot.",
    built: "Conçu et développé de zéro par Ahmed Yasser Ali — Spécialiste Supply Chain & Logistique",
    office: "YASLOGIST · Siège Opérationnel — New Cairo, Le Caire, Égypte",
    ctaWhats: "Écrire Directement au Fondateur",
    ctaCall: "Appeler Immédiatement",
    phone: "+20 104 113 9910",
    note: "Disponible 24/7 · Appels et messages directs",
    short: "Contact",
  },
  footer: {
    blurb: "Intelligence supply chain pour le fret maritime égyptien — visibilité conteneurs et navires, prédiction des ETA et dossier d'expédition unique assurant le relais vers la route.",
    cols: [
      { head: "Entreprise", links: ["À propos de YASLOGIST", "Le Fondateur", "Mentions Légales", "Contact"] },
      { head: "Couverture", links: ["Maritime", "Terrestre", "Passerelles Égyptiennes", "Relais Routier"] },
      { head: "Approche", links: ["Registre Unique", "ETA Prédictive", "Rapprochement des Références", "Ce Que Nous Ne Faisons Pas"] },
    ],
    bottom: "© 2026 YASLOGIST · Dossier d'expédition unifié route, mer et air en Égypte · Tous droits réservés",
    terms: "Conditions",
    privacy: "Confidentialité",
    security: "Sécurité",
    back: "Haut de page",
    close: "Fermer",
    legal: {
      terms: [
        "YASLOGIST est une plateforme d'intelligence supply chain opérée depuis son siège à New Cairo, Le Caire, Égypte.",
        "Les données de télémétrie navire, les métriques portuaires et les résultats du simulateur présentés sont des modèles de démonstration indicatifs. Ils ne constituent pas des données d'exploitation en direct et ne doivent pas servir de base à des décisions de routage ou de conformité.",
        "Le simulateur applique les référentiels publiés de l'OMI (IMO DCS) aux paramètres saisis. Les résultats sont des estimations sans garantie contractuelle pour un voyage donné.",
        "Le nom YASLOGIST, sa marque et son interface sont l'œuvre exclusive du fondateur. Toute reproduction requiert une autorisation préalable.",
      ],
      privacy: [
        "Ce site ne collecte aucune donnée personnelle. Aucun script d'analyse, traqueur publicitaire, cookie ou composant tiers de profilage n'est utilisé.",
        "Seules deux préférences locales sont conservées sur votre appareil : le thème d'affichage et la langue choisie, stockés dans le localStorage de votre navigateur pour votre confort lors des visites suivantes. Ils ne quittent jamais votre appareil.",
        "Aucun compte n'est requis et aucune information personnelle n'est demandée. Les liens de contact ouvrent vos applications natives de téléphone ou de messagerie.",
        "Les animations et polices sont servies sous forme de fichiers statiques. Aucun formulaire sur ce site ne transmet de données à un serveur.",
      ],
      security: [
        "La plateforme repose sur un front-end purement statique. L'absence de back-end, de base de données et de session utilisateur élimine tout risque de compromission de données stockées.",
        "Tous les actifs sont servis via HTTPS en production. L'interface s'exécute exclusivement dans votre navigateur sans aucune opération privilégiée sur votre terminal.",
        "Les visuels de registre distribué et de télémétrie sont des modèles illustrant le comportement d'une chaîne logistique inaltérable. Ils ne sont connectés à aucune blockchain publique et ne réalisent aucune transaction réelle.",
        "Si vous identifiez une faille de sécurité, veuillez la signaler directement au fondateur via les coordonnées indiquées en pied de page.",
      ],
    },
  },
  hud: {
    flow: "Flux Caméra",
    depth: "Profondeur",
    camNote: "CAM ▸ ALT 2 400M · SYNCHRO VITESSE",
    depthNote: "Profondeur Réseau · 7 Modules",
    utc: "UTC · SYNCHRONISATION FLOTTE NOMINALE",
    health: "STATUT · NOMINAL",
    sys: "HTTPS · DISTRIBUTION STATIQUE",
    dots: ["Aperçu", "Solutions", "Simulateur", "Prévision", "À Quai", "Chaîne du Froid", "Références", "Registre", "Contact"],
  },
  clock: { cairo: "Le Caire", shanghai: "Shanghai", rotterdam: "Rotterdam" },
  model: {
    badge: "Modèle illustratif · données non réelles",
    badgeShort: "Simulé",
  },
  brandPlate: {
    sub: "Siège · Le Caire",
  },
};


const DICTIONARIES: Record<Lang, Dict> = { en, ar, zh, tr, fr };

type Ctx = {
  lang: Lang;
  dir: Dir;
  t: (key: string) => string;
  ta: (key: string) => string[];
  setLang: (l: Lang) => void;
};

const I18nCtx = createContext<Ctx>({
  lang: "en",
  dir: "ltr",
  t: (k) => k,
  ta: () => [],
  setLang: () => {},
});

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[k];
  }, obj);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("oq-lang") : null;
    if (saved === "ar" || saved === "zh" || saved === "tr" || saved === "fr") {
      return saved as Lang;
    }
    return "en";
  });

  const dir: Dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("oq-lang", lang);
  }, [lang, dir]);

  const t = useCallback((key: string): string => {
    const dict = DICTIONARIES[lang] || en;
    const v = resolve(dict, key);
    if (typeof v === "string") return v;
    const fallback = resolve(en, key);
    return typeof fallback === "string" ? fallback : key;
  }, [lang]);

  const ta = useCallback((key: string): string[] => {
    const dict = DICTIONARIES[lang] || en;
    const v = resolve(dict, key);
    if (Array.isArray(v)) return v as string[];
    const fallback = resolve(en, key);
    return Array.isArray(fallback) ? (fallback as string[]) : [];
  }, [lang]);

  const value = useMemo(
    () => ({ lang, dir, t, ta, setLang }),
    [lang, dir, t, ta]
  );

  return (
    <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
  );
}

export function useLang() {
  return useContext(I18nCtx);
}
