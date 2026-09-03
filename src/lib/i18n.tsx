import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";
export type Dir = "ltr" | "rtl";

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
    links: ["Forecast", "Fleet", "Warehouse", "Emissions", "Ledger"],
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
      vessel: "Vessel · IQ-4271",
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
    sub: "Every layer of the chain — from forecast to final mile — runs on YASLOGIST's intelligence stack. Scroll the engines that move the world.",
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
        desc: "2,148 sensors stream vessel position and berth status in real time, so a queue building at the terminal shows up before it becomes a demurrage invoice.",
        metric: "2,148",
        metricLabel: "Sensors live",
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
      desc: "Routes that rethink themselves. The engine learns from millions of TEUs, live weather and ports — then plots the smartest voyage before cargo even leaves.",
      bullets: [
        "Forecasts demand 12 hours to 12 months ahead",
        "Re-plans routes around weather, traffic and fuel in real time",
        "Ships the right cargo, to the right port, at the right time",
      ],
      chips: ["Machine Learning", "Neural Routing", "Demand Sensing"],
      statLabel: "Forecast accuracy across covered lanes",
      panel: { title: "Neural Route Forecast", status: "Model v9.4" },
      notes: {
        chart: "Live inference",
        legend: "Four live signals · one committed route",
        layerIn: "Live signals",
        layerHidden: "Model",
        layerOut: "Route candidates",
        in0: "Demand",
        in1: "Weather",
        in2: "Port load",
        in3: "Fuel",
        rt0: "Route A",
        rt1: "Committed",
        rt2: "Route C",
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
      accent: "IoT Telemetry",
      post: "",
      desc: "Every box, every second. 2,148 sensors stream position, temperature and the heartbeat of your cargo straight to your pocket.",
      bullets: [
        "Position, vibration, temp & humidity every 2 seconds",
        "Alerts fire before problems reach your customer",
        "Keeps streaming even in satellite dead zones",
      ],
      chips: ["GPS / Sensor", "Live Telemetry", "Edge Computing"],
      statLabel: "Active sensors streaming right now",
      panel: { title: "Global Fleet Telemetry", status: "2,148 Sensors" },
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
      tag: "Engine 03 · Automation",
      pre: "Autonomous ",
      accent: "Smart Warehousing",
      post: "",
      desc: "Dark, silent warehouses that never blink. Robots pick, sort and ship 24/7 at machine speed — with almost zero mistakes.",
      bullets: [
        "342 AGVs + 5,000 robotic pickers across partner facilities",
        "12,480 units sorted per hour, per facility",
        "Unmanned 24/7 — no idle window, error rate under 0.1%",
      ],
      chips: ["AGV Fleet", "Order Fulfillment", "Auto-Sorting"],
      statLabel: "Units sorted per hour, per facility",
      panel: { title: "Autonomous Fulfillment Bay 07", status: "342 AGVs" },
      notes: {
        sort: "Bay 07 · Lights-out",
        inbound: "Inbound",
        outbound: "Outbound",
        zoneStorage: "Storage",
        zonePick: "Pick",
        charge: "Charge",
        laden: "Laden",
        empty: "Empty",
        throughput: "Throughput",
        perHr: "/hr",
        pick: "Pick Accuracy",
        downtime: "Downtime",
        pct: "%",
      },
    },
    {
      tag: "Engine 04 · Planet",
      pre: "Low-Carbon ",
      accent: "Green Logistics",
      post: "",
      desc: "Shipping that gives back. Cleaner fuels, smarter routes and shore power — every voyage lighter on the planet.",
      bullets: [
        "Low-carbon corridors powered by alternative fuels",
        "Routes scored on emissions, not just price",
        "Verified carbon offsets on every voyage",
      ],
      chips: ["Low-Carbon", "Alternative Fuels", "Eco Corridors"],
      statLabel: "CO₂ cut per TEU since 2021",
      panel: { title: "Low-Carbon Voyage Profile", status: "−42% vs 2021 baseline" },
      notes: {
        fuel: "Alternative fuel mix",
        shore: "Shore-power ports",
        eco: "Eco corridors",
        ecoV: "38 routes",
        offset: "58,200 t CO₂ offset / yr",
        since: "CO₂ per TEU vs the 2021 baseline — lower is better",
        co2: "CO₂ / TEU",
      },
    },
    {
      tag: "Engine 05 · Trust",
      pre: "Blockchain ",
      accent: "Smart Contracts",
      post: "",
      desc: "Proof, not promises. Every document, payment and handover logged on a tamper-evident ledger — visible to everyone.",
      bullets: [
        "Every document logged on a tamper-evident ledger",
        "Payments release themselves when cargo crosses checkpoints",
        "One shared truth for partners, ports and customs",
      ],
      chips: ["Smart Contracts", "Digital B/L", "Tamper-Evident"],
      statLabel: "Average ledger settlement time",
      panel: { title: "Immutable Ledger · Voyage 9928117", status: "Verified" },
      notes: {
        contract: "Smart Contract · Cargo Release",
        ledger: "Committed blocks",
        step1: "Initiate",
        step2: "Verify",
        step3: "Escrow",
        step4: "Settle",
        note: "Payment releases itself the moment cargo crosses the geo-fence — 2.1s to settle, across 12,408 committed blocks.",
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
      { head: "Company", links: ["About YASLOGIST", "Careers", "Press", "Investors"] },
      { head: "Network", links: ["Vessel Network", "Port Partners", "Hyper-Ports", "Air & Land"] },
      { head: "Technology", links: ["AI Platform", "IoT Sensors", "Blockchain", "Open API"] },
    ],
    bottom: "© 2026 YASLOGIST · The Next-Gen Supply Chain Intelligence Platform · All routes reserved",
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
    dots: ["Overview", "Solutions", "Simulator", "AI Analytics", "IoT Fleet", "Warehousing", "Green Chain", "Blockchain", "Connect"],
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
    links: ["التنبؤ", "الأسطول", "المستودعات", "الانبعاثات", "السجل"],
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
      vessel: "سفينة · IQ-4271",
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
    sub: "كل طبقة من سلسلة التوريد — من التنبؤ حتى الميل الأخير — تعمل على منصة YASLOGIST الذكية. مرّر عبر المحركات التي تحرّك العالم.",
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
        desc: "2,148 جهاز استشعار يبث موقع السفينة وحالة الرصيف لحظيًا، فيظهر تكدّس الطابور في المحطة قبل أن يتحوّل إلى فاتورة أرضيات.",
        metric: "2,148",
        metricLabel: "جهاز استشعار مباشر",
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
      desc: "مسارات تعيد التفكير بنفسها. محرك يتعلم من ملايين الحاويات والطقس الحي والموانئ — ثم يرسم أذكى رحلة قبل مغادرة البضاعة.",
      bullets: [
        "تنبؤ بالطلب من 12 ساعة إلى 12 شهرًا",
        "إعادة تخطيط فورية حول الطقس والازدحام والوقود",
        "الشحنة الصحيحة إلى الميناء الصحيح في الوقت الصحيح",
      ],
      chips: ["تعلّم آلي", "توجيه بالشبكات العصبية", "رصد إشارات الطلب"],
      statLabel: "دقة التنبؤ عبر الممرات المغطاة",
      panel: { title: "توقعات المسار العصبية", status: "النموذج 9.4" },
      notes: {
        chart: "استدلال حي",
        legend: "أربع إشارات حية · مسارٌ واحد مُعتمَد",
        layerIn: "إشارات حية",
        layerHidden: "النموذج",
        layerOut: "المسارات المرشحة",
        in0: "الطلب",
        in1: "الطقس",
        in2: "ضغط الموانئ",
        in3: "الوقود",
        rt0: "مسار أ",
        rt1: "المُعتمَد",
        rt2: "مسار ج",
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
      pre: "التتبع المباشر للأسطول عبر ",
      accent: "إنترنت الأشياء",
      post: "",
      desc: "كل حاوية، كل ثانية. 2,148 جهاز استشعار تبث الموقع والحرارة ونبض بضاعتك مباشرة إلى جيبك.",
      bullets: [
        "الموقع والاهتزاز والحرارة والرطوبة كل ثانيتين",
        "إنذارات تُطلق قبل وصول المشاكل إلى عميلك",
        "بث مستمر حتى في مناطق انقطاع الأقمار",
      ],
      chips: ["GPS / أجهزة استشعار", "بث مباشر", "حوسبة الحافة"],
      statLabel: "جهاز استشعار يبث الآن",
      panel: { title: "بث الأسطول العالمي", status: "2,148 جهاز استشعار" },
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
      tag: "المحرك 03 · الأتمتة",
      pre: "المستودعات الأوتوماتيكية و",
      accent: "الأتمتة الذكية",
      post: "",
      desc: "مستودعات مظلمة صامتة لا ترمش. روبوتات تلتقط وتفرز وتشحن 24/7 بسرعة الآلة وأخطاء شبه معدومة.",
      bullets: [
        "342 مركبة AGV و5,000 روبوت عبر منشآت الشركاء",
        "12,480 وحدة تُفرز في الساعة لكل منشأة",
        "تشغيل بلا تدخل بشري 24/7 — دون توقّف ونسبة خطأ أقل من 0.1%",
      ],
      chips: ["أسطول AGV", "تجهيز الطلبات", "فرز آلي"],
      statLabel: "وحدة تُفرز في الساعة لكل منشأة",
      panel: { title: "صالة التجهيز الآلي 07", status: "342 مركبة" },
      notes: {
        sort: "صالة 07 · تشغيل بلا تدخل بشري",
        inbound: "الوارد",
        outbound: "الصادر",
        zoneStorage: "التخزين",
        zonePick: "الالتقاط",
        charge: "الشحن",
        laden: "محمَّل",
        empty: "فارغ",
        throughput: "الإنتاجية",
        perHr: "/ساعة",
        pick: "دقة الالتقاط",
        downtime: "التوقّف",
        pct: "%",
      },
    },
    {
      tag: "المحرك 04 · الكوكب",
      pre: "سلاسل الإمداد الخضراء و",
      accent: "خفض الكربون",
      post: "",
      desc: "شحن يعيد للبيئة. وقود أنظف، مسارات أذكى، وطاقة شاطئية — كل رحلة أخف على الكوكب.",
      bullets: [
        "ممرات منخفضة الكربون بوقود بديل",
        "تقييم المسارات بالانبعاثات لا بالسعر فقط",
        "تعويضات كربون موثّقة في كل رحلة",
      ],
      chips: ["منخفض الكربون", "وقود بديل", "ممرات بيئية"],
      statLabel: "خفض الكربون لكل حاوية منذ 2021",
      panel: { title: "ملف الرحلة منخفض الكربون", status: "−42% مقارنة بخط أساس 2021" },
      notes: {
        fuel: "مزيج الوقود البديل",
        shore: "موانئ الطاقة الشاطئية",
        eco: "ممرات بيئية",
        ecoV: "38 مسارًا",
        offset: "58,200 طن كربون معوَّض سنويًا",
        since: "الكربون لكل حاوية مقارنةً بخط أساس 2021 — الأقل أفضل",
        co2: "كربون / حاوية",
      },
    },
    {
      tag: "المحرك 05 · الثقة",
      pre: "الشفافية المطلقة وأتمتة العقود عبر ",
      accent: "البلوك تشين",
      post: "",
      desc: "إثبات، لا وعود. كل مستند ودفعة وتسليم مسجَّل في سجل يكشف أي تلاعب — مرئي للجميع.",
      bullets: [
        "كل مستند مسجَّل على سجل يكشف أي تلاعب",
        "مدفوعات تُطلق نفسها تلقائيًا عند عبور النقاط",
        "حقيقة واحدة مشتركة للشركاء والموانئ والجمارك",
      ],
      chips: ["عقود ذكية", "بوليصة رقمية (B/L)", "قابل لكشف التلاعب"],
      statLabel: "متوسط زمن تسوية السجل",
      panel: { title: "سجل غير قابل للتغيير · الرحلة 9928117", status: "موثّق" },
      notes: {
        contract: "عقد ذكي · إفراج البضاعة",
        ledger: "كتل مُثبَّتة",
        step1: "بدء",
        step2: "تحقق",
        step3: "ضمان",
        step4: "تسوية",
        note: "تُحرَّر الدفعة تلقائيًا لحظة عبور الشحنة النقطة الجغرافية — تسوية في 2.1 ثانية عبر 12,408 كتلة مُثبَّتة.",
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
      { head: "الشركة", links: ["عن YASLOGIST", "الوظائف", "الصحافة", "المستثمرون"] },
      { head: "الشبكة", links: ["شبكة السفن", "شركاء الموانئ", "الموانئ الفائقة", "الجو والبر"] },
      { head: "التقنية", links: ["منصة الذكاء الاصطناعي", "أجهزة الاستشعار", "البلوك تشين", "واجهة API مفتوحة"] },
    ],
    bottom: "© 2026 YASLOGIST · منصة الجيل القادم لذكاء سلاسل الإمداد · جميع الحقوق محفوظة",
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
    dots: ["نظرة عامة", "الحلول", "المحاكي", "تحليلات الذكاء", "أسطول إنترنت الأشياء", "المستودعات", "السلسلة الخضراء", "البلوك تشين", "تواصل"],
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
    return saved === "ar" ? "ar" : "en";
  });

  const dir: Dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("oq-lang", lang);
  }, [lang, dir]);

  const t = (key: string): string => {
    const dict = lang === "ar" ? ar : en;
    const v = resolve(dict, key);
    if (typeof v === "string") return v;
    const fallback = resolve(en, key);
    return typeof fallback === "string" ? fallback : key;
  };

  const ta = (key: string): string[] => {
    const dict = lang === "ar" ? ar : en;
    const v = resolve(dict, key);
    if (Array.isArray(v)) return v as string[];
    const fallback = resolve(en, key);
    return Array.isArray(fallback) ? (fallback as string[]) : [];
  };

  return (
    <I18nCtx.Provider value={{ lang, dir, t, ta, setLang }}>{children}</I18nCtx.Provider>
  );
}

export function useLang() {
  return useContext(I18nCtx);
}
