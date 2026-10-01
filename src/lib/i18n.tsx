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
};

const en: Dict = {
  nav: {
    links: ["Forecast", "Berth", "Cold-Chain", "References", "Ledger"],
    status: "Demo Environment",
    sub: "The Next-Gen Supply Chain Intelligence Platform",
  },
  founder: {
    lead: "Platform Founder",
    name: "Ahmed Yasser Ali",
    title: "Supply Chain & Logistics Specialist",
    org: "YASLOGIST · New Cairo, Cairo",
  },
  hero: {
    tag: "Sea-freight intelligence across Egypt, Saudi Arabia and connected corridors",
    title1: "Every container.",
    title2: "One record, quay to gate.",
    sub: "Explore a current demo across five Egyptian gateways while YASLOGIST is designed for connected corridors spanning Saudi Arabia, the Red Sea, the Gulf and wider global trade lanes — one shipment record from quay to inland handoff.",
    cta1: "See how it works",
    cta2: "Open the fleet view",
    badges: ["Egypt + Saudi Arabia strategic focus", "Red Sea & Gulf corridor design", "B/L to truck plate, one record"],
    scroll: "Scroll to dive deeper",
    telemetry: {
      vessel: "Vessel · sample",
      live: "Simulated",
      speed: "Speed Over Ground",
      flag: "FLAG · SGP",
      heading: "Heading",
      draft: "Draft",
      cargo: "Cargo",
      eta: "ETA",
      route: "Route",
      etaNote: "ETA East Port Said · 2d 04h 12m — scenario route active",
    },
  },
  stats: {
    items: [
      { label: "Gateway scenarios in this demo", note: "Alexandria · Dekheila · Sokhna · Damietta · E. Port Said" },
      { label: "Reference types stitched", note: "booking → B/L → container → plate" },
      { label: "Ocean capability engines", note: "forecast · berth · cold-chain · references · record" },
      { label: "YASLOGIST transport modes", note: "ocean · land · air" },
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
        desc: "Models how demand, weather and port pressure can surface empty-container imbalance before repositioning becomes necessary.",
        metric: "DEMO",
        metricLabel: "Scenario forecast",
      },
      {
        title: "Berth Queue & Demurrage",
        desc: "Models vessel and terminal inputs across five gateways to show how berth pressure can surface before demurrage exposure.",
        metric: "5",
        metricLabel: "Gateways modelled",
      },
      {
        title: "Pharma Cold-Chain Breaks",
        desc: "Uses an illustrative temperature trace to show how a cold-chain excursion can be surfaced at container level before handoff.",
        metric: "2–8°C",
        metricLabel: "Demo alert band",
      },
      {
        title: "ACID & B/L Rejections",
        desc: "ACID and bill-of-lading references are filed and cross-checked before the vessel sails, so a rejected filing surfaces at booking, not at the gate.",
        metric: "7",
        metricLabel: "Reference types modelled",
      },
      {
        title: "Document & Release Fraud",
        desc: "Shows a tamper-evident audit flow for documents and handovers, illustrating how duplicated or altered release references could be surfaced before gate handoff.",
        metric: "4",
        metricLabel: "Record stages modelled",
      },
    ],
  },
  sim: {
    tag: "Section 03 · Interactive Scenario Engine",
    title1: "What one optimised voyage",
    title2: "is actually worth.",
    sub: "Set cargo volume and route distance to explore how the demo model changes carbon, time and cost outputs under fixed illustrative assumptions.",
    teuLabel: "Fleet Cargo Volume",
    teuUnit: "TEU",
    nmLabel: "Route Distance",
    nmUnit: "NM",
    presetsTeu: "Cargo profile",
    presetsNm: "Trade lane",
    teuPresets: ["Feeder", "Regional", "Panamax", "Neo-Panamax", "Megamax"],
    nmPresets: ["Med & Red Sea short-haul", "Gulf–Red Sea corridor", "N. Europe–Mediterranean", "Far East–Red Sea long-haul"],
    outputs: "Scenario output",
    demoNote: "Interactive demo · illustrative coefficients for capability demonstration",
    cfTitle: "Alternative · speed-priority corridor",
    cfNote: "Modelled scenario — same engine, corridor weighted for transit time instead of carbon",
    cfTime: "faster",
    cfCo2: "more carbon",
    cfCost: "less reclaimed",
    cfTonne: "t",
    co2: "Modelled carbon delta",
    co2Unit: "tonnes CO₂ avoided",
    time: "Modelled time delta",
    cost: "Modelled cost delta",
    costUnit: "USD per voyage",
    fuel: "Modelled fuel delta",
    fuelUnit: "tonnes bunker",
    esg: "Scenario score /100",
    note: "Scenario model · fixed illustrative assumptions · not an operational benchmark or routing recommendation",
    origin: "Origin",
    dest: "Destination",
    eta: "Optimised Arrival",
    reroute: "Scenario route adjustment",
    day: "d",
    hour: "h",
  },
  pillars: [
    {
      tag: "Engine 01 · Intelligence",
      pre: "AI ",
      accent: "Demand Forecasting",
      post: "",
      desc: "Explores empty-container imbalance using demand, weather, port pressure and fuel as scenario inputs. It demonstrates a decision path; it does not represent a live operating forecast.",
      bullets: [
        "Combines four scenario inputs into one repositioning signal",
        "Shows how demand, weather, port load and fuel can influence the result",
        "Exposes the model path so the demo decision can be inspected",
      ],
      chips: ["Machine Learning", "Predictive ETA", "Demand Sensing"],
      statLabel: "Scenario input classes",
      panel: { title: "Repositioning Forecast", status: "Scenario model" },
      notes: {
        chart: "Scenario inference",
        legend: "Four scenario inputs · one modelled flag",
        layerIn: "Scenario inputs",
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
        accuracy: "Validation",
        accuracyV: "DEMO",
        empty: "Outcome",
        emptyV: "Illustrative",
      },
    },
    {
      tag: "Engine 02 · Visibility",
      pre: "",
      accent: "Berth Visibility",
      post: "",
      desc: "The current demo models five Egyptian gateways to show berth-pressure logic; the same capability is designed to extend across Saudi, Red Sea and Gulf terminals as integrations are added.",
      bullets: [
        "Uses sample AIS-style positions and berth states in this demo",
        "Shows how a building berth queue can be highlighted before handoff",
        "Demonstrates the link from vessel to booking, B/L and container",
      ],
      chips: ["AIS Feed", "Berth Status", "Demurrage Watch"],
      statLabel: "Gateway scenarios modelled",
      panel: { title: "Gateway Berth View", status: "AIS · simulated" },
      notes: {
        sector: "Sector",
        sectorV: "07 · Demo",
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
      desc: "Uses a simulated temperature and humidity trace to demonstrate how an excursion outside a configured 2–8°C demo band can be surfaced at container level.",
      bullets: [
        "Demo trace samples temperature and humidity every two seconds",
        "A sample excursion outside the configured 2–8°C band is highlighted",
        "Shows how sensor history could travel with the shipment reference",
      ],
      chips: ["2–8°C Range", "Excursion Alerts", "Per-Container Log"],
      statLabel: "Demo sample cadence",
      panel: { title: "Cold-Chain Monitor", status: "2–8°C" },
      notes: {
        head: "Container · CT-118",
        band: "Safe band · 2–8°C",
        excursion: "Excursion flagged",
        logged: "Demo sample · 2s",
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
      desc: "Uses Egypt’s ACID workflow as one localized compliance example, cross-checking it with bill-of-lading references before sailing while keeping the record model extensible to other national requirements.",
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
        countK: "Reference types · 5 shown",
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
      statLabel: "Demo record stages",
      panel: { title: "Tamper-Evident Record", status: "Verified" },
      notes: {
        contract: "Shared Record · Handover",
        ledger: "Committed blocks",
        step1: "Log",
        step2: "Verify",
        step3: "Reconcile",
        step4: "Commit",
        note: "The demo moves each document and handover through four visible stages: log, verify, reconcile and commit.",
        verified: "Verified",
      },
    },
  ],
  closing: {
    tag: "Pilot & Partnership Enquiries",
    title1: "One conversation stands between you",
    title2: "and a supply chain that thinks.",
    sub: "Founder-led discussions for pilot design, partnerships and enterprise evaluation.",
    built: "Built from scratch by Ahmed Yasser Ali — Supply Chain & Logistics Specialist",
    office: "YASLOGIST · Corporate Branch — New Cairo, Cairo, Egypt",
    ctaWhats: "Discuss a Pilot",
    ctaCall: "Call the Founder",
    phone: "+20 104 113 9910",
    note: "Pilot enquiries · Partnerships · Strategic discussions",
    short: "Connect",
  },
  footer: {
    blurb: "Supply-chain intelligence designed for connected corridors across Egypt, Saudi Arabia, the Red Sea and the Gulf — linking vessel visibility, predictive ETAs and one shipment record through the road handover.",
    cols: [
      { head: "Company", links: ["About YASLOGIST", "The Founder", "Legal", "Contact"] },
      { head: "Coverage", links: ["Ocean", "Land", "Red Sea & Gulf", "Road Handover"] },
      { head: "Approach", links: ["One Record", "Predictive ETA", "Reference Stitching", "What We Don't Do"] },
    ],
    bottom: "© 2026 YASLOGIST · One shipment record across road, sea and air · Built for connected regional and global corridors · All rights reserved",
    terms: "Terms",
    privacy: "Privacy",
    security: "Security",
    back: "Back to surface",
    close: "Close",
    legal: {
      terms: [
        "This Ocean site is an interactive capability demo for YASLOGIST, a supply-chain intelligence platform being developed from New Cairo with Egypt and Saudi Arabia as initial strategic markets and a broader Red Sea, Gulf and international expansion path. This describes product direction, not live operations in every market named.",
        "All vessel telemetry, port figures and simulator outputs shown on this site are illustrative models presented for demonstration purposes. They are not live operational data and must not be relied on for commercial routing, chartering or compliance decisions.",
        "The simulator uses fixed illustrative coefficients to demonstrate scenario calculations. Its outputs are not validated operational benchmarks and must not be treated as voyage-performance claims.",
        "The YASLOGIST name, mark and interface are the work of the platform founder. Please request permission before reproducing them.",
      ],
      privacy: [
        "This demo uses Vercel Web Analytics and Speed Insights to measure aggregate traffic and performance. It does not run advertising trackers or require an account.",
        "The only values stored on your device are two local preferences — your chosen theme and language — kept in your browser's local storage so the site remembers them on your next visit. They never leave your device and are cleared when you clear site data.",
        "No account is required and no personal information is requested at any point. The contact links open your own phone or messaging application; any conversation that follows happens there, under that provider's terms, not here.",
        "Background media is served as site content and interface fonts are requested from Google Fonts. No form on this site submits data to a YASLOGIST backend.",
      ],
      security: [
        "This Ocean demo is a static front-end with no YASLOGIST backend, database or user session attached to the demonstration interface.",
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
    utc: "UTC · SCENARIO CLOCK",
    health: "STATUS · DEMO",
    sys: "DEMO · STATIC SHOWCASE",
    dots: ["Overview", "Solutions", "Simulator", "Forecast", "Berth", "Cold-Chain", "References", "Ledger", "Connect"],
  },
  clock: { cairo: "Cairo", shanghai: "Shanghai", rotterdam: "Rotterdam" },
  model: {
    badge: "Capability demo · simulated scenarios · no live customer operations",
    badgeShort: "Demo · simulated",
  },
};

const ar: Dict = {
  nav: {
    links: ["التنبؤ", "الأرصفة", "التبريد", "المراجع", "السجل"],
    status: "بيئة عرض تجريبي",
    sub: "منصة الجيل القادم لذكاء سلاسل الإمداد",
  },
  founder: {
    lead: "مؤسس المنصة",
    name: "أحمد ياسر علي",
    title: "أخصائي وخبير سلاسل الإمداد واللوجستيات",
    org: "YASLOGIST · القاهرة الجديدة، القاهرة",
  },
  hero: {
    tag: "ذكاء الشحن البحري عبر مصر والسعودية والممرات المتصلة",
    title1: "كل حاوية.",
    title2: "سجل واحد من الرصيف حتى البوابة.",
    sub: "استكشف العرض الحالي عبر خمسة منافذ مصرية، بينما تُصمَّم YASLOGIST لممرات مترابطة تشمل السعودية والبحر الأحمر والخليج ومسارات التجارة العالمية — بسجل شحنة واحد من الرصيف حتى التسليم البري.",
    cta1: "شاهد كيف تعمل",
    cta2: "افتح شاشة الأسطول",
    badges: ["تركيز استراتيجي: مصر + السعودية", "تصميم لممرات البحر الأحمر والخليج", "من البوليصة إلى لوحة الشاحنة"],
    scroll: "مرّر للغوص أعمق",
    telemetry: {
      vessel: "سفينة · نموذج",
      live: "محاكاة",
      speed: "السرعة الأرضية (SOG)",
      flag: "الراية · سنغافورة",
      heading: "الاتجاه",
      draft: "الغاطس",
      cargo: "البضاعة",
      eta: "الوصول",
      route: "المسار",
      etaNote: "الوصول لشرق بورسعيد · بعد يومين و4 ساعات — مسار السيناريو نشط",
    },
  },
  stats: {
    items: [
      { label: "سيناريوهات المنافذ في العرض", note: "الإسكندرية · الدخيلة · السخنة · دمياط · شرق بورسعيد" },
      { label: "أنواع مراجع مترابطة", note: "الحجز ← البوليصة ← الحاوية ← اللوحة" },
      { label: "محركات العرض البحري", note: "تنبؤ · أرصفة · تبريد · مراجع · سجل" },
      { label: "وسائط YASLOGIST", note: "بحري · بري · جوي" },
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
        desc: "ينمذج كيف يمكن للطلب والطقس وضغط الموانئ إظهار اختلال توزيع الحاويات الفارغة قبل الحاجة إلى إعادة تموضعها.",
        metric: "DEMO",
        metricLabel: "سيناريو تنبؤي",
      },
      {
        title: "طابور الأرصفة والأرضيات",
        desc: "ينمذج مدخلات السفن والأرصفة عبر خمسة منافذ ليوضح كيف يمكن إظهار ضغط الانتظار قبل التعرض لتكاليف التأخير.",
        metric: "5",
        metricLabel: "منافذ ضمن النموذج",
      },
      {
        title: "انقطاع سلسلة التبريد للأدوية",
        desc: "يستخدم مسار حرارة توضيحيًا لعرض كيف يمكن إظهار خروج عن نطاق التبريد على مستوى الحاوية قبل التسليم.",
        metric: "2–8°م",
        metricLabel: "نطاق تنبيه تجريبي",
      },
      {
        title: "رفض ملفات ACID والبوالص",
        desc: "تُستخرج مراجع ACID وبوليصة الشحن ويُتحقّق منها قبل الإبحار، فيظهر أي رفض عند الحجز لا عند البوابة.",
        metric: "7",
        metricLabel: "أنواع مراجع بالنموذج",
      },
      {
        title: "التلاعب في المستندات والإفراج",
        desc: "يعرض مسار تدقيق يكشف التلاعب في المستندات والتسليمات، ويوضح كيف يمكن رصد مرجع إفراج مكرر أو مُعدّل قبل التسليم عند البوابة.",
        metric: "4",
        metricLabel: "مراحل السجل بالنموذج",
      },
    ],
  },
  sim: {
    tag: "القسم 03 · محرك سيناريو تفاعلي",
    title1: "ما قيمة رحلة واحدة",
    title2: "بعد التحسين؟",
    sub: "حدّد حجم الحمولة ومسافة المسار لاستكشاف كيف تتغير مخرجات الكربون والوقت والتكلفة وفق افتراضات توضيحية ثابتة داخل النموذج التجريبي.",
    teuLabel: "حجم حمولة الأسطول",
    teuUnit: "حاوية مكافئة",
    nmLabel: "مسافة المسار",
    nmUnit: "ميل بحري",
    presetsTeu: "نمط الحمولة",
    presetsNm: "الممر التجاري",
    teuPresets: ["ناقل مغذٍّ", "إقليمي", "بنَمَاكس", "نيو-بنَمَاكس", "ميجاماكس"],
    nmPresets: ["مسافات قصيرة بالمتوسط والبحر الأحمر", "ممر الخليج–البحر الأحمر", "شمال أوروبا–المتوسط", "مسافة طويلة الشرق الأقصى–البحر الأحمر"],
    outputs: "مخرجات السيناريو",
    demoNote: "عرض تفاعلي · معاملات توضيحية لإظهار قدرات النموذج",
    cfTitle: "بديل · ممر يُعطي الأولوية للسرعة",
    cfNote: "سيناريو نمذجي — المحرك نفسه، وممر مُرجَّح لزمن العبور بدلًا من الكربون",
    cfTime: "أسرع",
    cfCo2: "كربون إضافي",
    cfCost: "توفير أقل",
    cfTonne: "طن",
    co2: "فرق كربوني بالنموذج",
    co2Unit: "طن كربون مُتجنَّب",
    time: "فرق زمني بالنموذج",
    cost: "فرق تكلفة بالنموذج",
    costUnit: "دولار لكل رحلة",
    fuel: "فرق وقود بالنموذج",
    fuelUnit: "طن وقود بحري (بنكر)",
    esg: "مؤشر السيناريو /100",
    note: "نموذج سيناريو · افتراضات توضيحية ثابتة · ليست معيار أداء تشغيليًا أو توصية مسار",
    origin: "نقطة الانطلاق",
    dest: "الوجهة",
    eta: "الوصول المُحسَّن",
    reroute: "تعديل مسار داخل السيناريو",
    day: "يوم",
    hour: "س",
  },
  pillars: [
    {
      tag: "المحرك 01 · الذكاء",
      pre: "الذكاء الاصطناعي و",
      accent: "التنبؤ المستقبلي",
      post: " بالطلب",
      desc: "يستكشف اختلال توزيع الحاويات الفارغة باستخدام الطلب والطقس وضغط الموانئ والوقود كمدخلات محاكاة. وهو يوضح مسار القرار ولا يمثل تنبؤًا تشغيليًا حيًا.",
      bullets: [
        "دمج أربعة مدخلات محاكاة في إشارة واحدة لإعادة التموضع",
        "إظهار أثر الطلب والطقس وضغط الميناء والوقود على النتيجة",
        "إتاحة مسار النموذج بصريًا لفهم قرار العرض التجريبي",
      ],
      chips: ["تعلّم آلي", "تنبؤ بموعد الوصول", "رصد إشارات الطلب"],
      statLabel: "فئات مدخلات السيناريو",
      panel: { title: "توقّع إعادة التوزيع", status: "نموذج سيناريو" },
      notes: {
        chart: "استدلال سيناريو",
        legend: "أربعة مدخلات محاكاة · إشارة نموذجية واحدة",
        layerIn: "مدخلات السيناريو",
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
        accuracy: "حالة التحقق",
        accuracyV: "DEMO",
        empty: "النتيجة",
        emptyV: "توضيحية",
      },
    },
    {
      tag: "المحرك 02 · الرؤية",
      pre: "",
      accent: "رؤية السفن والأرصفة",
      post: "",
      desc: "يحاكي العرض الحالي خمسة منافذ مصرية لتوضيح منطق ضغط الأرصفة، مع تصميم نفس القدرة للتوسع إلى موانئ السعودية والبحر الأحمر والخليج مع إضافة التكاملات.",
      bullets: [
        "يستخدم مواقع بأسلوب AIS وحالات أرصفة محاكاة داخل هذا العرض",
        "يوضح كيف يمكن إبراز تزايد طابور الرصيف قبل التسليم",
        "يعرض الربط بين السفينة والحجز والبوليصة والحاوية",
      ],
      chips: ["تغذية AIS", "حالة الرصيف", "مراقبة الأرضيات"],
      statLabel: "سيناريوهات منافذ ضمن النموذج",
      panel: { title: "عرض أرصفة المنافذ", status: "AIS · محاكاة" },
      notes: {
        sector: "القطاع",
        sectorV: "07 · تجريبي",
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
      desc: "يستخدم العرض مسارًا محاكيًا للحرارة والرطوبة لتوضيح كيف يمكن رصد خروج عن نطاق تجريبي مضبوط على 2–8°م عند مستوى الحاوية.",
      bullets: [
        "مسار العرض يأخذ عينة للحرارة والرطوبة كل ثانيتين",
        "يبرز مثالًا لخروج عن النطاق التجريبي المضبوط على 2–8°م",
        "يوضح كيف يمكن أن ينتقل سجل المستشعر مع مرجع الشحنة",
      ],
      chips: ["نطاق 2–8°م", "إنذارات الخروج", "سجل لكل حاوية"],
      statLabel: "فاصل العينة التجريبية",
      panel: { title: "مراقب سلسلة التبريد", status: "2–8°م" },
      notes: {
        head: "حاوية · CT-118",
        band: "النطاق الآمن · 2–8°م",
        excursion: "تنبيه خروج",
        logged: "عينة تجريبية · ثانيتان",
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
      desc: "يستخدم مسار ACID المصري كمثال محلي للامتثال، مع مطابقته ببوليصة الشحن قبل الإبحار، مع إبقاء نموذج السجل قابلًا للتوسع إلى متطلبات الدول الأخرى.",
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
        countK: "أنواع المراجع · 5 معروضة",
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
      statLabel: "مراحل السجل التجريبي",
      panel: { title: "سجل يكشف التلاعب", status: "موثّق" },
      notes: {
        contract: "سجل مشترك · تسليم",
        ledger: "كتل مُثبَّتة",
        step1: "تسجيل",
        step2: "تحقق",
        step3: "مطابقة",
        step4: "تثبيت",
        note: "يعرض النموذج انتقال كل مستند وتسليم عبر أربع مراحل مرئية: تسجيل، تحقق، مطابقة، ثم تثبيت.",
        verified: "موثّق",
      },
    },
  ],
  closing: {
    tag: "استفسارات التجارب والشراكات",
    title1: "محادثة واحدة تفصلك",
    title2: "عن سلسلة إمدادٍ تُفكِّر.",
    sub: "نقاشات يقودها المؤسس لتصميم تجربة أولية، والشراكات، وتقييم المنصة للمؤسسات.",
    built: "بُنيت من الصفر على يد أحمد ياسر علي — أخصائي سلاسل الإمداد واللوجستيات",
    office: "YASLOGIST · الفرع المؤسسي — القاهرة الجديدة، القاهرة، مصر",
    ctaWhats: "ناقش تجربة أولية",
    ctaCall: "اتصل بالمؤسس",
    phone: "+20 104 113 9910",
    note: "تجارب أولية · شراكات · نقاشات استراتيجية",
    short: "تواصل",
  },
  footer: {
    blurb: "ذكاء سلاسل الإمداد لممرات مترابطة عبر مصر والسعودية والبحر الأحمر والخليج — رؤية للسفن والحاويات، مواعيد وصول تنبؤية، وسجل واحد يستمر حتى التسليم البري.",
    cols: [
      { head: "الشركة", links: ["عن YASLOGIST", "المؤسّس", "الشؤون القانونية", "تواصل"] },
      { head: "التغطية", links: ["بحري", "بري", "البحر الأحمر والخليج", "التسليم البري"] },
      { head: "المنهج", links: ["السجل الواحد", "التنبؤ بالوصول", "ترابط المراجع", "ما لا نقوم به"] },
    ],
    bottom: "© 2026 YASLOGIST · سجل واحد للشحنة عبر البر والبحر والجو · مصمم لممرات إقليمية وعالمية مترابطة · جميع الحقوق محفوظة",
    terms: "الشروط",
    privacy: "الخصوصية",
    security: "الأمان",
    back: "العودة إلى السطح",
    close: "إغلاق",
    legal: {
      terms: [
        "موقع Ocean هذا عرض تفاعلي لقدرات YASLOGIST، وهي منصة لذكاء سلاسل الإمداد يجري تطويرها من القاهرة الجديدة، مع مصر والسعودية كسوقين استراتيجيين أوليين ومسار توسع أوسع عبر البحر الأحمر والخليج والأسواق الدولية. هذا يصف اتجاه المنتج ولا يعني وجود عمليات حية في كل سوق مذكور.",
        "جميع بيانات السفن وأرقام الموانئ ومخرجات المحاكي المعروضة هنا نماذج توضيحية لأغراض العرض فقط. وهي ليست بيانات تشغيلية مباشرة، ولا يجوز الاعتماد عليها في قرارات التوجيه أو الاستئجار أو الامتثال التجاري.",
        "يستخدم المحاكي معاملات توضيحية ثابتة لشرح حسابات السيناريو. مخرجاته ليست معايير تشغيلية مُتحققًا منها ولا يجوز عرضها كأرقام أداء لرحلة فعلية.",
        "اسم YASLOGIST وعلامته وواجهته من عمل مؤسس المنصة. يُرجى طلب الإذن قبل إعادة استخدامها.",
      ],
      privacy: [
        "يستخدم هذا العرض Vercel Web Analytics وSpeed Insights لقياس الزيارات والأداء بصورة مجمعة. ولا يستخدم متتبعات إعلانية ولا يتطلب إنشاء حساب.",
        "القيمتان الوحيدتان المحفوظتان على جهازك هما تفضيلا المظهر واللغة، وتُخزَّنان في المتصفح ليتذكّرهما الموقع في زيارتك القادمة. لا تغادران جهازك أبدًا، وتُمحيان عند مسح بيانات الموقع.",
        "لا يلزم إنشاء حساب، ولا تُطلب أي معلومات شخصية. روابط التواصل تفتح تطبيق الهاتف أو المراسلة لديك، وأي محادثة تجري هناك وفق شروط ذلك التطبيق لا هنا.",
        "تُقدَّم وسائط الخلفية كمحتوى للموقع، وتُطلب خطوط الواجهة من Google Fonts. ولا يرسل أي نموذج بيانات إلى خادم خلفي تابع لـYASLOGIST.",
      ],
      security: [
        "عرض Ocean هذا واجهة أمامية ثابتة لا تتصل بخادم خلفي أو قاعدة بيانات أو جلسة مستخدم تابعة لـYASLOGIST.",
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
    utc: "UTC · ساعة السيناريو",
    health: "الحالة · تجريبي",
    sys: "DEMO · عرض ثابت",
    dots: ["نظرة عامة", "الحلول", "المحاكي", "التنبؤ", "الأرصفة", "التبريد", "المراجع", "السجل", "تواصل"],
  },
  clock: { cairo: "القاهرة", shanghai: "شنغهاي", rotterdam: "روتردام" },
  model: {
    badge: "عرض لقدرات المنصة · سيناريوهات محاكاة · لا توجد عمليات عملاء مباشرة",
    badgeShort: "ديمو · محاكاة",
  },
};

const zh: Dict = {
  nav: {
    links: ["需求预测", "泊位态势", "药品冷链", "单证核验", "存证账本"],
    status: "演示环境",
    sub: "下一代海运供应链智能指挥平台",
  },
  founder: {
    lead: "平台创始人",
    name: "艾哈迈德·亚瑟·阿里 (Ahmed Yasser Ali)",
    title: "供应链与国际物流专家",
    org: "YASLOGIST · 埃及新开罗",
  },
  hero: {
    tag: "覆盖埃及、沙特及互联航线的海运供应链智能",
    title1: "每一只集装箱。",
    title2: "从码头到闸口，一账贯通。",
    sub: "当前演示以埃及五大海运口岸为场景，同时 YASLOGIST 的产品设计面向沙特、红海、海湾及更广泛的国际贸易走廊，以一份货运记录贯通码头与陆路交接。",
    cta1: "查看运行原理",
    cta2: "进入船队全景视角",
    badges: ["埃及 + 沙特战略重点", "红海与海湾走廊设计", "提单直通集卡车牌·单一记录"],
    scroll: "向下滚动深入探索",
    telemetry: {
      vessel: "船舶 · 仿真样本",
      live: "模拟",
      speed: "对地航速 (SOG)",
      flag: "船旗 · 新加坡",
      heading: "航向",
      draft: "吃水",
      cargo: "载货",
      eta: "预估抵港",
      route: "航线",
      etaNote: "预估抵靠塞得东港 · 2天04小时12分 — 场景路线已启用",
    },
  },
  stats: {
    items: [
      { label: "当前演示口岸场景", note: "亚历山大 · 德海拉 · 苏赫奈 · 杜姆亚特 · 塞得东港" },
      { label: "全流程贯通单证类型", note: "订舱单 → 提单 → 集装箱 → 集卡车牌" },
      { label: "海运演示能力引擎", note: "预测 · 泊位 · 冷链 · 单证 · 记录" },
      { label: "YASLOGIST 运输模式", note: "海运 · 陆运 · 空运" },
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
        desc: "模拟需求、天气与港口压力如何在需要重新调配前显示空箱分布失衡。",
        metric: "DEMO",
        metricLabel: "场景预测",
      },
      {
        title: "泊位拥堵与高额滞期费",
        desc: "模拟五大口岸的船舶与码头输入，展示如何在产生滞期暴露前呈现泊位压力。",
        metric: "5",
        metricLabel: "建模口岸",
      },
      {
        title: "医药冷链脱温断链",
        desc: "使用示意温度轨迹展示冷链偏离如何在集装箱层面、交接之前被呈现。",
        metric: "2–8°C",
        metricLabel: "演示告警温区",
      },
      {
        title: "ACID 与提单核验驳回",
        desc: "在船舶离港前全面校核埃及 ACID 与海运提单 (B/L) 数据一致性，将退单风险拦截在订舱端而非码头闸口。",
        metric: "7",
        metricLabel: "建模单证类型",
      },
      {
        title: "纸质单证伪造与提货欺诈",
        desc: "展示单证与交接的防篡改审计流程，说明重复或被修改的放行引用如何在闸口交接前被识别。",
        metric: "4",
        metricLabel: "建模记录阶段",
      },
    ],
  },
  sim: {
    tag: "第03节 · 交互式场景引擎",
    title1: "一次航行路径优化",
    title2: "究竟价值几何？",
    sub: "输入货量与航程距离，探索演示模型在固定示意假设下如何改变碳排、时间与成本输出。",
    teuLabel: "船队载货量",
    teuUnit: "标准箱 (TEU)",
    nmLabel: "航线距离",
    nmUnit: "海里 (NM)",
    presetsTeu: "货型配置",
    presetsNm: "贸易航道",
    teuPresets: ["支线接驳船", "区域集装箱船", "巴拿马型", "新巴拿马型", "超大型集装箱船"],
    nmPresets: ["地中海及红海短途", "海湾–红海关键走廊", "北欧–地中海主干线", "远东–红海远洋干线"],
    outputs: "场景输出",
    demoNote: "交互式演示 · 使用示意系数展示能力",
    cfTitle: "备选方案 · 航速优先时效走廊",
    cfNote: "仿真场景对比 — 同一算力引擎，优先侧重航运时效而非单纯脱碳",
    cfTime: "时效更快",
    cfCo2: "碳排增加",
    cfCost: "综合减省减少",
    cfTonne: "吨",
    co2: "模型碳排变化",
    co2Unit: "减少二氧化碳当量 (吨)",
    time: "模型时间变化",
    cost: "模型成本变化",
    costUnit: "美元 / 每航次",
    fuel: "模型燃油变化",
    fuelUnit: "燃油吨数 (重油/轻油)",
    esg: "场景评分 /100",
    note: "场景模型 · 固定示意假设 · 非运营基准或航线建议",
    origin: "始发港",
    dest: "目的港",
    eta: "优化到港时间",
    reroute: "场景航线调整",
    day: "天",
    hour: "小时",
  },
  pillars: [
    {
      tag: "引擎 01 · 智能算力",
      pre: "AI ",
      accent: "货运需求与调运预测",
      post: "",
      desc: "以需求、天气、港口压力和燃油作为模拟输入，展示空箱失衡的决策路径；不代表实时运营预测。",
      bullets: [
        "将四类模拟输入组合为一个调运信号",
        "展示需求、天气、港口负荷和燃油对结果的影响",
        "公开演示模型的决策路径便于理解",
      ],
      chips: ["机器学习", "预测性 ETA", "需求感知"],
      statLabel: "场景输入类别",
      panel: { title: "空箱调运智能预测", status: "场景模型" },
      notes: {
        chart: "场景推演",
        legend: "四类模拟输入 · 一个模型信号",
        layerIn: "场景输入",
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
        accuracy: "验证状态",
        accuracyV: "DEMO",
        empty: "结果",
        emptyV: "示意",
      },
    },
    {
      tag: "引擎 02 · 态势感知",
      pre: "",
      accent: "港口泊位态势感知",
      post: "",
      desc: "当前演示以埃及五大口岸展示泊位压力逻辑；随着数据接入扩展，同一能力被设计为可覆盖沙特、红海和海湾港口。",
      bullets: [
        "演示中使用 AIS 风格位置与模拟泊位状态",
        "展示泊位队列增长如何被突出呈现",
        "展示船舶与订舱、提单及集装箱之间的关联",
      ],
      chips: ["AIS 实时数据源", "泊位作业状态", "滞期费主动预警"],
      statLabel: "建模口岸场景",
      panel: { title: "核心口岸泊位全景图", status: "AIS · 模拟" },
      notes: {
        sector: "监控海区",
        sectorV: "07区 · 演示",
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
      desc: "使用模拟温湿度轨迹，展示集装箱层面的示意 2–8°C 温区偏离如何被识别。",
      bullets: [
        "演示轨迹每2秒生成一次温湿度样本",
        "突出展示超出示意 2–8°C 温区的样本事件",
        "展示传感记录如何随货运引用一起流转",
      ],
      chips: ["2–8°C 受控温区", "温湿度越界告警", "单箱级全程存证"],
      statLabel: "演示采样间隔",
      panel: { title: "药品冷链监控控制台", status: "2–8°C 恒温" },
      notes: {
        head: "冷藏集装箱 · CT-118",
        band: "安全温区 · 2–8°C",
        excursion: "温控超标预警",
        logged: "演示采样 · 2秒",
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
        countK: "单证类型 · 展示5项",
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
      statLabel: "演示记录阶段",
      panel: { title: "去中心化共享账本", status: "已完成验证" },
      notes: {
        contract: "多方协作契约 · 交接存证",
        ledger: "已确认区块",
        step1: "上链记录",
        step2: "多方验证",
        step3: "协同对账",
        step4: "终局确认",
        note: "演示将每份单证与交接呈现为四个可见阶段：记录、验证、对账和确认。",
        verified: "已存证验证",
      },
    },
  ],
  closing: {
    tag: "试点与合作咨询",
    title1: "一通直接对话",
    title2: "开启拥有思考能力的现代智慧物流体系。",
    sub: "由创始人直接参与试点设计、合作讨论与企业评估。",
    built: "由供应链与物流专家 Ahmed Yasser Ali 独立架构并全栈研发",
    office: "YASLOGIST 运营总部 — 埃及开罗·新开罗",
    ctaWhats: "讨论试点",
    ctaCall: "致电创始人",
    phone: "+20 104 113 9910",
    note: "试点咨询 · 合作 · 战略讨论",
    short: "立即联系",
  },
  footer: {
    blurb: "面向埃及、沙特、红海与海湾互联航线设计的供应链智能平台 — 结合船舶可视性、预测 ETA 与贯通海陆交接的单一货运记录。",
    cols: [
      { head: "公司信息", links: ["关于 YASLOGIST", "创始人简介", "法律条款", "业务联系"] },
      { head: "业务覆盖", links: ["海运智能", "陆运干线", "红海与海湾", "海陆联运接驳"] },
      { head: "核心技术", links: ["单一数据记录", "预测性 ETA", "单证智能核验", "边界承诺"] },
    ],
    bottom: "© 2026 YASLOGIST · 陆海空单一货运记录 · 面向互联的区域与全球贸易走廊 · 版权所有",
    terms: "使用条款",
    privacy: "隐私政策",
    security: "安全说明",
    back: "返回顶部",
    close: "关闭",
    legal: {
      terms: [
        "Ocean 页面是 YASLOGIST 的交互式能力演示；平台从新开罗开发，以埃及和沙特为初始战略市场，并规划向红海、海湾及国际走廊扩展。这描述的是产品方向，并不表示在所有提及市场已有实时运营。",
        "本站点所展示的船舶遥测数据、港口作业指标及仿真推演输出均为用于概念演示的数学推演模型，非现场实时作业指令，严禁直接用于实际船舶航线调度、租船合约或海关法定申报决策。",
        "推演引擎使用固定示意系数展示场景计算。其输出并非经过运营验证的基准，不应作为真实航次绩效主张。",
        "YASLOGIST 品牌名称、商标、软件界面及算法逻辑均为平台创始人智力成果，未经明确授权许可不得擅自复制或用于商业目的。",
      ],
      privacy: [
        "本演示使用 Vercel Web Analytics 和 Speed Insights 进行汇总流量与性能测量；不运行广告追踪器，也不要求创建账户。",
        "您设备本地仅会存储两项轻量配置参数：主题偏好与所选语言代码。此数据完全保留在您本地浏览器的 localStorage 中，供下次访问时恢复显示，绝不上传至任何服务器，清除浏览器数据即可重置。",
        "本平台无需注册账户，亦绝不索取任何个人身份敏感信息。页面中的联系链接直接唤起您设备本地的电话或即时通讯工具，后续所有沟通均由第三方通讯服务协议保护，脱离本站环境。",
        "背景媒体作为站点内容提供，界面字体通过 Google Fonts 请求。本站没有表单向 YASLOGIST 后端提交数据。",
      ],
      security: [
        "Ocean 演示采用静态前端，不连接 YASLOGIST 后端、数据库或用户会话。",
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
    utc: "UTC · 场景时钟",
    health: "状态 · 演示",
    sys: "DEMO · 静态展示",
    dots: ["全景概览", "解决方案", "决策推演", "需求预测", "泊位态势", "药品冷链", "单证核验", "存证账本", "业务洽谈"],
  },
  clock: { cairo: "开罗", shanghai: "上海", rotterdam: "鹿特丹" },
  model: {
    badge: "能力演示 · 模拟场景 · 无实时客户运营",
    badgeShort: "演示 · 模拟",
  },
};


const tr: Dict = {
  nav: {
    links: ["Tahminleme", "Rıhtım", "Soğuk Zincir", "Belgeler", "Defter"],
    status: "Demo Ortamı",
    sub: "Yeni Nesil Tedarik Zinciri İstihbarat Platformu",
  },
  founder: {
    lead: "Platform Kurucusu",
    name: "Ahmed Yasser Ali",
    title: "Tedarik Zinciri ve Lojistik Uzmanı",
    org: "YASLOGIST · Yeni Kahire, Kahire",
  },
  hero: {
    tag: "Mısır, Suudi Arabistan ve bağlantılı koridorlar için deniz taşımacılığı zekâsı",
    title1: "Her konteyner.",
    title2: "Rıhtımdan kapıya, tek kayıt.",
    sub: "Mevcut demo beş Mısır deniz kapısını kullanır; YASLOGIST ise Suudi Arabistan, Kızıldeniz, Körfez ve daha geniş küresel ticaret koridorlarına uzanacak şekilde tasarlanır — rıhtımdan kara devrine tek sevkiyat kaydıyla.",
    cta1: "Nasıl Çalıştığını İnceleyin",
    cta2: "Filo Görünümünü Aç",
    badges: ["Mısır + Suudi Arabistan stratejik odağı", "Kızıldeniz & Körfez koridor tasarımı", "Konşimentodan kamyon plakasına tek kayıt"],
    scroll: "Derinlemesine incelemek için kaydırın",
    telemetry: {
      vessel: "Gemi · Örnek",
      live: "Simüle",
      speed: "Yere Göre Hız (SOG)",
      flag: "BAYRAK · SGP",
      heading: "Rota Açısı",
      draft: "Draft / Su Çekimi",
      cargo: "Yük",
      eta: "Tahmini Varış",
      route: "Rota",
      etaNote: "Doğu Port Said Tahmini Varış · 2g 04s 12d — senaryo rotası aktif",
    },
  },
  stats: {
    items: [
      { label: "Bu demodaki liman senaryoları", note: "İskenderiye · Dekheila · Suhna · Dimyat · D. Port Said" },
      { label: "Birbirine bağlanan belge türü", note: "rezervasyon → B/L → konteyner → plaka" },
      { label: "Ocean demo motorları", note: "tahmin · rıhtım · soğuk zincir · referans · kayıt" },
      { label: "YASLOGIST taşıma modları", note: "deniz · kara · hava" },
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
        desc: "Talep, hava ve liman baskısının boş konteyner dengesizliğini yeniden konumlandırma gerekmeden önce nasıl gösterebileceğini modeller.",
        metric: "DEMO",
        metricLabel: "Senaryo tahmini",
      },
      {
        title: "Rıhtım Sırası ve Demoraj",
        desc: "Beş limandaki gemi ve terminal girdilerini modelleyerek rıhtım baskısının demoraj maruziyetinden önce nasıl görünür olabileceğini gösterir.",
        metric: "5",
        metricLabel: "Modellenen liman",
      },
      {
        title: "İlaç Soğuk Zincir Kırılmaları",
        desc: "Örnek bir sıcaklık izi kullanarak soğuk zincir sapmasının devirden önce konteyner seviyesinde nasıl gösterilebileceğini sunar.",
        metric: "2–8°C",
        metricLabel: "Demo uyarı aralığı",
      },
      {
        title: "ACID ve B/L Reddi",
        desc: "ACID ve konşimento referansları gemi kalkmadan önce eşleştirilip doğrulanır; böylece ret durumları gümrük kapısında değil rezervasyonda çözülür.",
        metric: "7",
        metricLabel: "Modellenen referans türü",
      },
      {
        title: "Evrak ve Teslim Sahteciliği",
        desc: "Belge ve devirler için kurcalamaya dayanıklı bir denetim akışını gösterir; değiştirilmiş veya yinelenmiş teslim referanslarının kapı öncesinde nasıl işaretlenebileceğini açıklar.",
        metric: "4",
        metricLabel: "Modellenen kayıt aşaması",
      },
    ],
  },
  sim: {
    tag: "Bölüm 03 · Etkileşimli Senaryo Motoru",
    title1: "Optimize edilmiş tek bir seferin",
    title2: "gerçek ekonomik değeri.",
    sub: "Yük hacmini ve rota mesafesini belirleyerek sabit gösterge varsayımları altında demo modelinin karbon, zaman ve maliyet çıktılarını nasıl değiştirdiğini inceleyin.",
    teuLabel: "Filo Kargo Hacmi",
    teuUnit: "TEU",
    nmLabel: "Rota Mesafesi",
    nmUnit: "NM",
    presetsTeu: "Yük profili",
    presetsNm: "Ticaret rotası",
    teuPresets: ["Besleyici (Feeder)", "Bölgesel", "Panamax", "Neo-Panamax", "Megamax"],
    nmPresets: ["Akdeniz & Kızıldeniz kısa mesafe", "Körfez–Kızıldeniz koridoru", "Kuzey Avrupa–Akdeniz", "Uzak Doğu–Kızıldeniz uzun mesafe"],
    outputs: "Senaryo çıktısı",
    demoNote: "Etkileşimli demo · yetenek gösterimi için örnek katsayılar",
    cfTitle: "Alternatif · hız öncelikli koridor",
    cfNote: "Modellenmiş senaryo — aynı motor, karbon yerine transit süreye öncelik verilmiş koridor",
    cfTime: "daha hızlı",
    cfCo2: "daha fazla karbon",
    cfCost: "daha az tasarruf",
    cfTonne: "t",
    co2: "Modellenen karbon farkı",
    co2Unit: "önlenen ton CO₂",
    time: "Modellenen zaman farkı",
    cost: "Modellenen maliyet farkı",
    costUnit: "Sefer başına USD",
    fuel: "Modellenen yakıt farkı",
    fuelUnit: "ton bunker yakıtı",
    esg: "Senaryo skoru /100",
    note: "Senaryo modeli · sabit örnek varsayımlar · operasyonel kıyaslama veya rota önerisi değildir",
    origin: "Çıkış",
    dest: "Varış",
    eta: "Optimize Edilmiş Varış",
    reroute: "Senaryo rota ayarı",
    day: "g",
    hour: "s",
  },
  pillars: [
    {
      tag: "Motor 01 · Akıl",
      pre: "Yapay Zeka ",
      accent: "Talep ve Konumlandırma Tahmini",
      post: "",
      desc: "Talep, hava, liman baskısı ve yakıtı simüle girdiler olarak kullanarak boş konteyner dengesizliğini araştırır; canlı operasyon tahmini değildir.",
      bullets: [
        "Dört simüle girdiyi tek yeniden konumlandırma sinyalinde birleştirir",
        "Talep, hava, liman yükü ve yakıtın sonucu nasıl etkilediğini gösterir",
        "Demo kararının incelenebilmesi için model yolunu görünür kılar",
      ],
      chips: ["Makine Öğrenimi", "Öngörülü ETA", "Talep Algılama"],
      statLabel: "Senaryo girdi sınıfları",
      panel: { title: "Yeniden Konumlandırma Tahmini", status: "Senaryo modeli" },
      notes: {
        chart: "Senaryo çıkarımı",
        legend: "Dört simüle girdi · tek modellenmiş sinyal",
        layerIn: "Senaryo girdileri",
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
        accuracy: "Doğrulama",
        accuracyV: "DEMO",
        empty: "Sonuç",
        emptyV: "Gösterge",
      },
    },
    {
      tag: "Motor 02 · Görünürlük",
      pre: "",
      accent: "Rıhtım ve Gemi Görünürlüğü",
      post: "",
      desc: "Mevcut demo beş Mısır limanında rıhtım baskısı mantığını gösterir; aynı kabiliyet entegrasyonlar eklendikçe Suudi Arabistan, Kızıldeniz ve Körfez terminallerine uzanacak şekilde tasarlanmıştır.",
      bullets: [
        "Bu demoda örnek AIS tarzı konumlar ve simüle rıhtım durumları kullanılır",
        "Büyüyen rıhtım kuyruğunun nasıl vurgulanabileceğini gösterir",
        "Gemi ile rezervasyon, konşimento ve konteyner bağlantısını gösterir",
      ],
      chips: ["AIS Akışı", "Rıhtım Durumu", "Demoraj Takibi"],
      statLabel: "Modellenen liman senaryoları",
      panel: { title: "Liman Rıhtım Görünümü", status: "AIS · simüle" },
      notes: {
        sector: "Sektör",
        sectorV: "07 · Demo",
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
      desc: "Simüle bir sıcaklık ve nem iziyle yapılandırılmış 2–8°C demo bandının dışındaki sapmanın konteyner seviyesinde nasıl gösterilebileceğini sunar.",
      bullets: [
        "Demo izi her iki saniyede bir sıcaklık ve nem örneği üretir",
        "Yapılandırılmış 2–8°C demo bandı dışındaki örnek bir sapmayı vurgular",
        "Sensör geçmişinin sevkiyat referansıyla nasıl taşınabileceğini gösterir",
      ],
      chips: ["2–8°C Aralığı", "Sapma Uyarıları", "Konteyner Başına Kayıt"],
      statLabel: "Demo örnekleme aralığı",
      panel: { title: "Soğuk Zincir Monitörü", status: "2–8°C" },
      notes: {
        head: "Konteyner · CT-118",
        band: "Güvenli aralık · 2–8°C",
        excursion: "Sapma tespit edildi",
        logged: "Demo örneği · 2sn",
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
        countK: "Referans türü · 5 gösteriliyor",
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
      statLabel: "Demo kayıt aşamaları",
      panel: { title: "Güvenli Paylaşımlı Defter", status: "Doğrulandı" },
      notes: {
        contract: "Ortak Kayıt · Devir",
        ledger: "İşlenmiş bloklar",
        step1: "Kayıt",
        step2: "Doğrulama",
        step3: "Mutabakat",
        step4: "İşleme",
        note: "Demo, her belge ve devri dört görünür aşamada gösterir: kayıt, doğrulama, mutabakat ve işleme.",
        verified: "Doğrulandı",
      },
    },
  ],
  closing: {
    tag: "Pilot ve İş Ortaklığı Talepleri",
    title1: "Düşünen bir tedarik zinciriyle",
    title2: "aranızda tek bir doğrudan görüşme var.",
    sub: "Pilot tasarımı, iş ortaklıkları ve kurumsal değerlendirme için kurucu liderliğinde görüşmeler.",
    built: "Tedarik Zinciri ve Lojistik Uzmanı Ahmed Yasser Ali tarafından sıfırdan geliştirildi",
    office: "YASLOGIST Genel Merkez — Yeni Kahire, Kahire, Mısır",
    ctaWhats: "Pilot Görüşmesi",
    ctaCall: "Kurucuyu Ara",
    phone: "+20 104 113 9910",
    note: "Pilot talepleri · İş ortaklıkları · Stratejik görüşmeler",
    short: "İletişim",
  },
  footer: {
    blurb: "Mısır, Suudi Arabistan, Kızıldeniz ve Körfez boyunca bağlantılı koridorlar için tasarlanan tedarik zinciri zekâsı — gemi görünürlüğü, öngörülü ETA’lar ve kara devrine kadar tek sevkiyat kaydı.",
    cols: [
      { head: "Şirket", links: ["YASLOGIST Hakkında", "Kurucu", "Yasal", "İletişim"] },
      { head: "Kapsam", links: ["Deniz", "Kara", "Kızıldeniz & Körfez", "Karayolu Devri"] },
      { head: "Yaklaşım", links: ["Tek Kayıt", "Öngörülü ETA", "Referans Eşleme", "Hizmet Sınırlarımız"] },
    ],
    bottom: "© 2026 YASLOGIST · Kara, deniz ve hava genelinde tek sevkiyat kaydı · Bağlantılı bölgesel ve küresel koridorlar için tasarlandı · Tüm hakları saklıdır",
    terms: "Şartlar",
    privacy: "Gizlilik",
    security: "Güvenlik",
    back: "Yukarı dön",
    close: "Kapat",
    legal: {
      terms: [
        "Bu Ocean sitesi, Yeni Kahire’den geliştirilen YASLOGIST tedarik zinciri istihbarat platformunun etkileşimli yetenek demosudur. Mısır ve Suudi Arabistan ilk stratejik pazarlar olarak ele alınırken Kızıldeniz, Körfez ve uluslararası koridorlara daha geniş bir açılım hedeflenir. Bu ifade ürün yönünü anlatır; adı geçen her pazarda canlı operasyon olduğu anlamına gelmez.",
        "Bu sitede gösterilen tüm gemi telemetrisi, liman rakamları ve simülatör çıktıları tanıtım amacıyla sunulan gösterge modellerdir. Gerçek canlı operasyonel veri değildir; ticari rota belirleme veya yasal uyum kararları için dayanak alınamaz.",
        "Simülatör, senaryo hesaplarını göstermek için sabit örnek katsayılar kullanır. Çıktılar doğrulanmış operasyonel kıyaslamalar değildir ve gerçek sefer performansı olarak sunulmamalıdır.",
        "YASLOGIST adı, logosu ve arayüzü platform kurucusunun fikri mülkiyetidir. Kullanımdan önce izin alınmalıdır.",
      ],
      privacy: [
        "Bu demo, toplu trafik ve performans ölçümü için Vercel Web Analytics ve Speed Insights kullanır. Reklam izleyicileri çalıştırmaz ve hesap gerektirmez.",
        "Cihazınızda saklanan yegane veriler tema ve dil tercihlerinizdir; sonraki ziyaretinizde hatırlanması için tarayıcınızın yerel depolama alanında tutulur ve cihazınızdan asla ayrılmaz.",
        "Hesap açma zorunluluğu yoktur ve hiçbir aşamada kişisel bilgi talep edilmez. İletişim bağlantıları cihazınızdaki yerel uygulamaları açar.",
        "Arka plan medyası site içeriği olarak sunulur ve arayüz yazı tipleri Google Fonts üzerinden istenir. Hiçbir form YASLOGIST arka ucuna veri göndermez.",
      ],
      security: [
        "Bu Ocean demosu, YASLOGIST arka ucu, veritabanı veya kullanıcı oturumuna bağlı olmayan statik bir ön uçtur.",
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
    utc: "UTC · SENARYO SAATİ",
    health: "DURUM · DEMO",
    sys: "DEMO · STATİK GÖSTERİM",
    dots: ["Genel Bakış", "Çözümler", "Simülatör", "Tahminleme", "Rıhtım", "Soğuk Zincir", "Belgeler", "Defter", "İletişim"],
  },
  clock: { cairo: "Kahire", shanghai: "Şanghay", rotterdam: "Rotterdam" },
  model: {
    badge: "Yetenek demosu · simüle senaryolar · canlı müşteri operasyonu yok",
    badgeShort: "Demo · simüle",
  },
};


const fr: Dict = {
  nav: {
    links: ["Prévision", "À Quai", "Chaîne du Froid", "Références", "Registre"],
    status: "Environnement de démo",
    sub: "Plateforme d'Intelligence Logistique Nouvelle Génération",
  },
  founder: {
    lead: "Fondateur de la Plateforme",
    name: "Ahmed Yasser Ali",
    title: "Spécialiste Supply Chain & Logistique",
    org: "YASLOGIST · New Cairo, Le Caire",
  },
  hero: {
    tag: "Intelligence du fret maritime entre l’Égypte, l’Arabie saoudite et les corridors connectés",
    title1: "Chaque conteneur.",
    title2: "Un seul registre, du quai à la porte.",
    sub: "La démo actuelle utilise cinq passerelles égyptiennes, tandis que YASLOGIST est conçu pour des corridors connectés couvrant l’Arabie saoudite, la mer Rouge, le Golfe et des routes commerciales mondiales — avec un dossier unique du quai au relais routier.",
    cta1: "Découvrir le Fonctionnement",
    cta2: "Ouvrir la Vue Flotte",
    badges: ["Égypte + Arabie saoudite : priorité stratégique", "Conçu pour la mer Rouge et le Golfe", "Du B/L à la plaque d’immatriculation"],
    scroll: "Faites défiler pour explorer",
    telemetry: {
      vessel: "Navire · Échantillon",
      live: "Simulé",
      speed: "Vitesse fond (SOG)",
      flag: "PAVILLON · SGP",
      heading: "Cap",
      draft: "Tirant d'eau",
      cargo: "Cargaison",
      eta: "ETA",
      route: "Route",
      etaNote: "ETA Port-Saïd Est · 2j 04h 12m — route du scénario active",
    },
  },
  stats: {
    items: [
      { label: "Scénarios de passerelles dans cette démo", note: "Alexandrie · Dekheila · Sokhna · Damiette · Port-Saïd Est" },
      { label: "Types de références unifiées", note: "booking → B/L → conteneur → plaque" },
      { label: "Moteurs de démonstration Ocean", note: "prévision · quai · froid · références · registre" },
      { label: "Modes de transport YASLOGIST", note: "mer · route · air" },
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
        desc: "Modélise comment la demande, la météo et la pression portuaire peuvent faire apparaître un déséquilibre de conteneurs vides avant qu’un repositionnement ne devienne nécessaire.",
        metric: "DEMO",
        metricLabel: "Prévision de scénario",
      },
      {
        title: "File d'Attente à Quai & Surestaries",
        desc: "Modélise les entrées navire et terminal sur cinq passerelles pour montrer comment la pression à quai peut être mise en évidence avant l’exposition aux surestaries.",
        metric: "5",
        metricLabel: "Passerelles modélisées",
      },
      {
        title: "Ruptures de la Chaîne du Froid Pharma",
        desc: "Utilise une trace de température illustrative pour montrer comment une excursion de chaîne du froid peut être signalée au niveau du conteneur avant le transfert.",
        metric: "2–8°C",
        metricLabel: "Plage d'alerte démo",
      },
      {
        title: "Rejets ACID et Connaissement B/L",
        desc: "Les références ACID et connaissement sont rapprochées avant l'appareillage ; toute non-conformité est signalée dès le booking.",
        metric: "7",
        metricLabel: "Types de références modélisées",
      },
      {
        title: "Fraude Documentaire et Faux Bons de Sortie",
        desc: "Présente un flux d’audit infalsifiable pour les documents et transferts, illustrant comment une référence de mainlevée modifiée ou dupliquée pourrait être détectée avant la porte.",
        metric: "4",
        metricLabel: "Étapes de registre modélisées",
      },
    ],
  },
  sim: {
    tag: "Section 03 · Moteur de Scénario Interactif",
    title1: "La valeur réelle d'un voyage",
    title2: "entièrement optimisé.",
    sub: "Définissez le volume et la distance pour explorer comment le modèle de démonstration fait varier les sorties carbone, temps et coût selon des hypothèses illustratives fixes.",
    teuLabel: "Volume Fret de la Flotte",
    teuUnit: "EVP",
    nmLabel: "Distance de la Route",
    nmUnit: "NM",
    presetsTeu: "Profil cargaison",
    presetsNm: "Corridor maritime",
    teuPresets: ["Feeder", "Régional", "Panamax", "Néo-Panamax", "Megamax"],
    nmPresets: ["Méditerranée & Mer Rouge courte distance", "Corridor Golfe–Mer Rouge", "Europe du Nord–Méditerranée", "Extrême-Orient–Mer Rouge long-courrier"],
    outputs: "Résultats du scénario",
    demoNote: "Démonstration interactive · coefficients illustratifs pour présenter la capacité",
    cfTitle: "Alternative · corridor axé sur la vitesse",
    cfNote: "Scénario modélisé — même moteur, corridor pondéré sur le temps de transit plutôt que sur le carbone",
    cfTime: "plus rapide",
    cfCo2: "plus de carbone",
    cfCost: "moins d'économies",
    cfTonne: "t",
    co2: "Écart carbone modélisé",
    co2Unit: "tonnes de CO₂ évitées",
    time: "Écart temps modélisé",
    cost: "Écart coût modélisé",
    costUnit: "USD par voyage",
    fuel: "Écart carburant modélisé",
    fuelUnit: "tonnes de soutes",
    esg: "Score scénario /100",
    note: "Modèle de scénario · hypothèses illustratives fixes · ni benchmark opérationnel ni recommandation de routage",
    origin: "Origine",
    dest: "Destination",
    eta: "Arrivée Optimisée",
    reroute: "Ajustement de route du scénario",
    day: "j",
    hour: "h",
  },
  pillars: [
    {
      tag: "Moteur 01 · Intelligence",
      pre: "Prévision IA de ",
      accent: "Demande et de Repositionnement",
      post: "",
      desc: "Explore les déséquilibres de conteneurs vides avec la demande, la météo, la pression portuaire et le carburant comme entrées simulées ; il ne s’agit pas d’une prévision opérationnelle en direct.",
      bullets: [
        "Combine quatre entrées simulées en un seul signal de repositionnement",
        "Montre comment la demande, la météo, la charge portuaire et le carburant influencent le résultat",
        "Rend le chemin du modèle visible afin que la décision de démonstration puisse être inspectée",
      ],
      chips: ["Machine Learning", "ETA Prédictive", "Détection de Demande"],
      statLabel: "Classes d'entrées du scénario",
      panel: { title: "Prévision de Repositionnement", status: "Modèle de scénario" },
      notes: {
        chart: "Inférence de scénario",
        legend: "Quatre entrées simulées · un signal modélisé",
        layerIn: "Entrées du scénario",
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
        accuracy: "Validation",
        accuracyV: "DEMO",
        empty: "Résultat",
        emptyV: "Illustratif",
      },
    },
    {
      tag: "Moteur 02 · Visibilité",
      pre: "",
      accent: "Visibilité Navires et Postes à Quai",
      post: "",
      desc: "La démo actuelle modélise cinq passerelles égyptiennes pour illustrer la pression à quai ; la même capacité est conçue pour s’étendre aux terminaux saoudiens, de la mer Rouge et du Golfe à mesure que les intégrations sont ajoutées.",
      bullets: [
        "Utilise des positions de type AIS et des états de quai simulés dans cette démo",
        "Montre comment une file d’attente croissante peut être mise en évidence",
        "Montre le lien entre navire, booking, connaissement et conteneur",
      ],
      chips: ["Flux AIS", "État des Postes à Quai", "Surveillance Surestaries"],
      statLabel: "Scénarios de passerelles modélisés",
      panel: { title: "Vue des Postes Portuaires", status: "AIS · simulé" },
      notes: {
        sector: "Secteur",
        sectorV: "07 · Démo",
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
      desc: "Utilise une trace simulée de température et d’humidité pour montrer comment une dérive hors de la plage démo configurée à 2–8°C peut être signalée au niveau du conteneur.",
      bullets: [
        "La trace de démonstration échantillonne température et humidité toutes les deux secondes",
        "Met en évidence un exemple d’excursion hors de la plage démo 2–8°C",
        "Montre comment l’historique capteur pourrait accompagner la référence d’expédition",
      ],
      chips: ["Plage 2–8°C", "Alertes d'Excursion", "Historique par Conteneur"],
      statLabel: "Cadence d'échantillon démo",
      panel: { title: "Surveillance Chaîne du Froid", status: "2–8°C" },
      notes: {
        head: "Conteneur · CT-118",
        band: "Plage sécurisée · 2–8°C",
        excursion: "Alerte excursion",
        logged: "Échantillon démo · 2s",
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
        countK: "Types de références · 5 affichés",
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
      statLabel: "Étapes du registre démo",
      panel: { title: "Registre Inaltérable Partagé", status: "Vérifié" },
      notes: {
        contract: "Registre Partagé · Transfert",
        ledger: "Blocs validés",
        step1: "Enregistrement",
        step2: "Vérification",
        step3: "Rapprochement",
        step4: "Validation",
        note: "La démo fait passer chaque document et transfert par quatre étapes visibles : enregistrer, vérifier, rapprocher et valider.",
        verified: "Vérifié",
      },
    },
  ],
  closing: {
    tag: "Demandes de pilote et partenariats",
    title1: "Un seul échange direct vous sépare",
    title2: "d'une chaîne logistique intelligente.",
    sub: "Échanges menés avec le fondateur pour concevoir un pilote, discuter d'un partenariat ou évaluer la plateforme en entreprise.",
    built: "Conçu et développé de zéro par Ahmed Yasser Ali — Spécialiste Supply Chain & Logistique",
    office: "YASLOGIST · Siège Opérationnel — New Cairo, Le Caire, Égypte",
    ctaWhats: "Discuter d'un pilote",
    ctaCall: "Appeler le fondateur",
    phone: "+20 104 113 9910",
    note: "Pilotes · Partenariats · Discussions stratégiques",
    short: "Contact",
  },
  footer: {
    blurb: "Intelligence supply chain conçue pour les corridors connectés entre l’Égypte, l’Arabie saoudite, la mer Rouge et le Golfe — visibilité navires, ETA prédictives et dossier d’expédition unique jusqu’au relais routier.",
    cols: [
      { head: "Entreprise", links: ["À propos de YASLOGIST", "Le Fondateur", "Mentions Légales", "Contact"] },
      { head: "Couverture", links: ["Maritime", "Terrestre", "Mer Rouge & Golfe", "Relais Routier"] },
      { head: "Approche", links: ["Registre Unique", "ETA Prédictive", "Rapprochement des Références", "Ce Que Nous Ne Faisons Pas"] },
    ],
    bottom: "© 2026 YASLOGIST · Dossier d’expédition unique route, mer et air · Conçu pour des corridors régionaux et mondiaux connectés · Tous droits réservés",
    terms: "Conditions",
    privacy: "Confidentialité",
    security: "Sécurité",
    back: "Haut de page",
    close: "Fermer",
    legal: {
      terms: [
        "Ce site Ocean est une démonstration interactive des capacités de YASLOGIST, développée depuis New Cairo avec l’Égypte et l’Arabie saoudite comme marchés stratégiques initiaux et une trajectoire d’expansion vers la mer Rouge, le Golfe et les corridors internationaux. Cela décrit l’orientation du produit, pas des opérations en direct dans chaque marché cité.",
        "Les données de télémétrie navire, les métriques portuaires et les résultats du simulateur présentés sont des modèles de démonstration indicatifs. Ils ne constituent pas des données d'exploitation en direct et ne doivent pas servir de base à des décisions de routage ou de conformité.",
        "Le simulateur utilise des coefficients illustratifs fixes pour démontrer les calculs de scénario. Ses résultats ne sont pas des benchmarks opérationnels validés et ne doivent pas être présentés comme des performances réelles de voyage.",
        "Le nom YASLOGIST, sa marque et son interface sont l'œuvre exclusive du fondateur. Toute reproduction requiert une autorisation préalable.",
      ],
      privacy: [
        "Cette démo utilise Vercel Web Analytics et Speed Insights pour mesurer le trafic agrégé et les performances. Elle n'utilise pas de traqueurs publicitaires et ne nécessite aucun compte.",
        "Seules deux préférences locales sont conservées sur votre appareil : le thème d'affichage et la langue choisie, stockés dans le localStorage de votre navigateur pour votre confort lors des visites suivantes. Ils ne quittent jamais votre appareil.",
        "Aucun compte n'est requis et aucune information personnelle n'est demandée. Les liens de contact ouvrent vos applications natives de téléphone ou de messagerie.",
        "Les médias de fond sont servis comme contenu du site et les polices d'interface sont demandées à Google Fonts. Aucun formulaire ne transmet de données à un back-end YASLOGIST.",
      ],
      security: [
        "Cette démo Ocean est un front-end statique sans back-end, base de données ni session utilisateur YASLOGIST attachés à l'interface de démonstration.",
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
    utc: "UTC · HORLOGE DU SCÉNARIO",
    health: "STATUT · DÉMO",
    sys: "DEMO · PRÉSENTATION STATIQUE",
    dots: ["Aperçu", "Solutions", "Simulateur", "Prévision", "À Quai", "Chaîne du Froid", "Références", "Registre", "Contact"],
  },
  clock: { cairo: "Le Caire", shanghai: "Shanghai", rotterdam: "Rotterdam" },
  model: {
    badge: "Démo de capacité · scénarios simulés · aucune opération client en direct",
    badgeShort: "Démo · simulé",
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
