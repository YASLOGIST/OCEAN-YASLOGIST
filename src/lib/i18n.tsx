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
  clock: { cairo: string; singapore: string; rotterdam: string };
};

const en: Dict = {
  nav: {
    links: ["Analytics", "Fleet", "Warehousing", "Green", "Chain"],
    status: "All Systems Nominal",
    sub: "The Next-Gen Supply Chain Intelligence Platform",
  },
  founder: {
    lead: "Platform Founder",
    name: "Ahmed Yasser Ali",
    title: "Supply Chain & Logistics Specialist",
    org: "YASLOGIST · Dokki, Cairo",
  },
  hero: {
    tag: "The Next-Gen Supply Chain Intelligence Platform",
    title1: "Intelligent Freight.",
    title2: "Boundless Oceans.",
    sub: "A revolutionary engine across 240+ ships and 86 ports — demand predicted before it happens, routes that self-optimise, and carbon cut on every mile of global trade.",
    cta1: "Explore the Network",
    cta2: "Watch the Fleet Live",
    badges: ["AI Routing Active", "86 Ports Linked", "Zero-Tamper Ledger"],
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
      etaNote: "ETA LAX · 2d 04h 12m — AI re-route active",
    },
  },
  stats: {
    items: [
      { label: "TEU moved / year", note: "+18% YoY" },
      { label: "Smart vessels", note: "100% sensor-fitted" },
      { label: "Deep-sea ports", note: "34 countries" },
      { label: "On-time delivery", note: "industry avg 92%" },
    ],
  },
  pillarsIntro: {
    tag: "The Five Engines",
    title1: "One platform.",
    title2: "Five revolutions.",
    sub: "Every layer of the chain — from forecast to final mile — runs on YASLOGIST's intelligence stack. Scroll the engines that move the world.",
  },
  solutions: {
    tag: "The Top 5 Global Bottlenecks",
    title1: "The revolutionary engine that solves",
    title2: "the world's biggest bottlenecks.",
    sub: "Five problems that cost the industry billions. One platform. Zero excuses.",
    items: [
      {
        title: "AI Demand Forecasting",
        desc: "Forecasts demand before it happens — reads global flows, weather and port pressure, then places capacity exactly where the market needs it.",
        metric: "94.2%",
        metricLabel: "Forecast accuracy",
      },
      {
        title: "Real-Time IoT Telemetry",
        desc: "Every box, every second. 2,148 sensors stream position, temperature and cargo health straight to your pocket.",
        metric: "2,148",
        metricLabel: "Sensors live",
      },
      {
        title: "Autonomous Smart Warehousing",
        desc: "Dark, silent, tireless. Robots pick, sort and ship 24/7 at machine speed — near-zero mistakes.",
        metric: "12,480",
        metricLabel: "Units / hour",
      },
      {
        title: "Zero-Emission Green Logistics",
        desc: "Cleaner fuels, smarter routes, verified offsets. Every voyage lighter on the planet.",
        metric: "−42%",
        metricLabel: "CO₂ per TEU",
      },
      {
        title: "Blockchain Smart Contracts",
        desc: "One unbreakable ledger. Documents, payments and handovers that settle themselves.",
        metric: "2.1s",
        metricLabel: "Settlement",
      },
    ],
  },
  sim: {
    tag: "Section 03 · Live Decision Engine",
    title1: "Price your advantage",
    title2: "before you sail.",
    sub: "Set your cargo and your distance. The engine returns what optimisation is worth on that exact voyage — carbon, days and dollars, recalculated as you drag.",
    teuLabel: "Fleet Cargo Volume",
    teuUnit: "TEU",
    nmLabel: "Route Distance",
    nmUnit: "NM",
    presetsTeu: "Cargo profile",
    presetsNm: "Trade lane",
    teuPresets: ["Feeder", "Regional", "Transpacific", "Ultra", "Megamax"],
    nmPresets: ["Intra-Asia", "Transpacific", "Asia–Europe", "Global"],
    outputs: "Live engine output",
    demoNote: "Interactive demo · simulated data — the same engine runs on live port and vessel feeds",
    cfTitle: "Alternative · speed-priority corridor",
    cfNote: "Modelled scenario — same engine, corridor weighted for transit time instead of carbon",
    cfTime: "faster",
    cfCo2: "more carbon",
    cfCost: "less reclaimed",
    cfTonne: "t",
    co2: "Carbon Cut",
    co2Unit: "tonnes CO₂ avoided",
    time: "Days Recovered",
    cost: "Operating Cost Reclaimed",
    costUnit: "USD per voyage",
    fuel: "Fuel Preserved",
    fuelUnit: "tonnes bunker",
    esg: "Green Score",
    note: "Model v9.4 · IMO DCS baselines · illustrative estimates, not operational advice",
    origin: "Origin",
    dest: "Destination",
    eta: "Optimised Arrival",
    reroute: "Neural re-route holding",
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
      statLabel: "Forecast accuracy across 86 lanes",
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
        "342 AGVs + 5,000 robotic pickers across 12 hyper-ports",
        "12,480 units sorted per hour, per facility",
        "Lights-out 24/7 — zero idle time, near-zero errors",
      ],
      chips: ["AGV Fleet", "Smart Fulfillment", "Auto-Sorting"],
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
      pre: "Zero-Emission ",
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
      panel: { title: "Low-Carbon Voyage Profile", status: "Net-Zero 2040" },
      notes: {
        fuel: "Alternative fuel mix",
        shore: "Shore-power ports",
        eco: "Eco corridors",
        ecoV: "38 routes",
        offset: "Carbon offset 58.2M kg / yr",
        since: "CO₂ per TEU vs the 2021 baseline — lower is better",
        co2: "CO₂ / TEU",
      },
    },
    {
      tag: "Engine 05 · Trust",
      pre: "Blockchain ",
      accent: "Smart Contracts",
      post: "",
      desc: "Proof, not promises. Every document, payment and handover locked on an unbreakable ledger — visible to everyone.",
      bullets: [
        "Every document locked on a tamper-proof ledger",
        "Payments release themselves when cargo crosses checkpoints",
        "One shared truth for partners, ports and customs",
      ],
      chips: ["Smart Contracts", "Digital BOL", "Zero-Tamper"],
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
    built: "Built from scratch by Ahmed Yasser Othman El-Sayed — Supply Chain & Logistics Specialist",
    office: "YASLOGIST · Corporate Branch — Dokki, Cairo, Egypt",
    ctaWhats: "Message the Founder Directly",
    ctaCall: "Call Now",
    phone: "+201002029997",
    note: "Available 24/7 · Direct calls & messages",
    short: "Connect",
  },
  footer: {
    blurb: "The next-gen intelligence platform for global supply chains — 240+ ships, 86 ports, one smart brain.",
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
        "YASLOGIST is a supply-chain intelligence platform operated from its corporate branch in Dokki, Cairo, Egypt.",
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
    health: "SYS.HEALTH 100%",
    sys: "LINK · SECURE AES-256 · UPLINK 12.4 GB/S",
    dots: ["Overview", "Solutions", "Simulator", "AI Analytics", "IoT Fleet", "Warehousing", "Green Chain", "Blockchain", "Connect"],
  },
  clock: { cairo: "Cairo", singapore: "Singapore", rotterdam: "Rotterdam" },
};

const ar: Dict = {
  nav: {
    links: ["التحليلات", "الأسطول", "المستودعات", "الاستدامة", "السلسلة"],
    status: "جميع الأنظمة سليمة",
    sub: "منصة الجيل القادم لذكاء سلاسل الإمداد",
  },
  founder: {
    lead: "مؤسس المنصة",
    name: "أحمد ياسر علي",
    title: "أخصائي وخبير سلاسل الإمداد واللوجستيات",
    org: "YASLOGIST · الدقي، القاهرة",
  },
  hero: {
    tag: "منصة الجيل القادم لذكاء سلاسل الإمداد",
    title1: "شحنٌ ذكي.",
    title2: "محيطاتٌ بلا حدود.",
    sub: "محرك ثوري يقود أكثر من 240 سفينة و86 ميناءً — طلب يُتنبأ به قبل حدوثه، مسارات ذاتية التحسين، وكربون أقل في كل ميل من التجارة العالمية.",
    cta1: "استكشف الشبكة",
    cta2: "شاهد الأسطول مباشرة",
    badges: ["توجيه ذكي بالذكاء الاصطناعي", "86 ميناءً مرتبطًا", "سجل غير قابل للتلاعب"],
    scroll: "مرّر للغوص أعمق",
    telemetry: {
      vessel: "سفينة · IQ-4271",
      live: "مباشر",
      speed: "السرعة فوق الأرض",
      flag: "الراية · سنغافورة",
      heading: "الاتجاه",
      draft: "الغاطس",
      cargo: "البضاعة",
      eta: "الوصول",
      route: "المسار",
      etaNote: "الوصول لوس أنجلوس · بعد يومين و4 ساعات — إعادة توجيه ذكية نشطة",
    },
  },
  stats: {
    items: [
      { label: "حاوية مكافئة تُنقل سنويًا", note: "+18% سنويًا" },
      { label: "سفينة ذكية", note: "مجهّزة بالكامل بأجهزة استشعار" },
      { label: "ميناءً في المياه العميقة", note: "في 34 دولة" },
      { label: "تسليم في الموعد", note: "متوسط القطاع 92%" },
    ],
  },
  pillarsIntro: {
    tag: "المحركات الخمسة",
    title1: "منصة واحدة.",
    title2: "خمس ثورات.",
    sub: "كل طبقة من سلسلة التوريد — من التنبؤ حتى الميل الأخير — تعمل على منصة YASLOGIST الذكية. مرّر عبر المحركات التي تحرّك العالم.",
  },
  solutions: {
    tag: "أكبر 5 اختناقات عالمية",
    title1: "المحرك الثوري الذي يحلّ",
    title2: "أكبر اختناقات العالم.",
    sub: "خمس مشاكل تكلّف القطاع مليارات. منصة واحدة. بلا أعذار.",
    items: [
      {
        title: "الذكاء الاصطناعي والتنبؤ المستقبلي بالطلب",
        desc: "تنبؤ بالطلب قبل حدوثه — يقرأ التدفقات العالمية والطقس وضغط الموانئ، ثم يضع القدرة حيث يحتاجها السوق تمامًا.",
        metric: "94.2%",
        metricLabel: "دقة التنبؤ",
      },
      {
        title: "التتبع المباشر للأسطول عبر إنترنت الأشياء",
        desc: "كل حاوية، كل ثانية. 2,148 جهاز استشعار تبث الموقع والحرارة وصحة البضاعة مباشرة إلى جيبك.",
        metric: "2,148",
        metricLabel: "جهاز استشعار مباشر",
      },
      {
        title: "المستودعات الأوتوماتيكية والأتمتة الذكية",
        desc: "مظلمة، صامتة، لا تتعب. روبوتات تلتقط وتفرز وتشحن 24/7 بسرعة الآلة وأخطاء شبه معدومة.",
        metric: "12,480",
        metricLabel: "وحدة / ساعة",
      },
      {
        title: "سلاسل الإمداد الخضراء وخفض الكربون",
        desc: "وقود أنظف، مسارات أذكى، تعويضات موثّقة. كل رحلة أخف على الكوكب.",
        metric: "−42%",
        metricLabel: "كربون / حاوية",
      },
      {
        title: "الشفافية المطلقة وأتمتة العقود عبر البلوكشين",
        desc: "سجل واحد لا يُكسر. مستندات ومدفوعات وتسليمات تُنفّذ نفسها بنفسها.",
        metric: "2.1ث",
        metricLabel: "زمن التسوية",
      },
    ],
  },
  sim: {
    tag: "القسم 03 · محرك القرار الحي",
    title1: "احسب أفضليتك",
    title2: "قبل أن تُبحر.",
    sub: "حدّد حمولتك ومسافتك، ليعيد المحرك قيمة التحسين على هذه الرحلة بالتحديد — كربونٌ وأيامٌ وأموال، تُحتسب لحظة تحريكك للمؤشر.",
    teuLabel: "حجم حمولة الأسطول",
    teuUnit: "حاوية مكافئة",
    nmLabel: "مسافة المسار",
    nmUnit: "ميل بحري",
    presetsTeu: "نمط الحمولة",
    presetsNm: "الممر التجاري",
    teuPresets: ["ناقل مغذٍّ", "إقليمي", "عابر للهادئ", "فائق", "ميجاماكس"],
    nmPresets: ["داخل آسيا", "عابر للهادئ", "آسيا–أوروبا", "عالمي"],
    outputs: "مخرجات المحرك الحية",
    demoNote: "عرض تفاعلي · بيانات محاكاة — والمحرك نفسه يعمل على تدفقات الموانئ والسفن الحية",
    cfTitle: "بديل · ممر يُعطي الأولوية للسرعة",
    cfNote: "سيناريو نمذجي — المحرك نفسه، وممر مُرجَّح لزمن العبور بدلًا من الكربون",
    cfTime: "أسرع",
    cfCo2: "كربون إضافي",
    cfCost: "توفير أقل",
    cfTonne: "طن",
    co2: "خفض البصمة الكربونية",
    co2Unit: "طن كربون مُتجنَّب",
    time: "أيام مُستردَّة",
    cost: "تحجيم التكاليف التشغيلية",
    costUnit: "دولار لكل رحلة",
    fuel: "وقود محفوظ",
    fuelUnit: "طن وقود",
    esg: "الدرجة الخضراء",
    note: "النموذج 9.4 · معايير IMO DCS · تقديرات استرشادية لا تُغني عن القرار التشغيلي",
    origin: "نقطة الانطلاق",
    dest: "الوجهة",
    eta: "الوصول المُحسَّن",
    reroute: "إعادة توجيه عصبية نشطة",
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
      chips: ["تعلّم آلي", "توجيه عصبي", "استشعار الطلب"],
      statLabel: "دقة التنبؤ عبر 86 ممرًا",
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
        "342 مركبة AGV و5,000 روبوت عبر 12 ميناءً فائقًا",
        "12,480 وحدة تُفرز في الساعة لكل منشأة",
        "تشغيل بلا إضاءة 24/7 — صفر توقّف",
      ],
      chips: ["أسطول AGV", "تلبية ذكية", "فرز آلي"],
      statLabel: "وحدة تُفرز في الساعة لكل منشأة",
      panel: { title: "خليج التلبية الذاتية 07", status: "342 مركبة" },
      notes: {
        sort: "الرصيف 07 · تشغيل بلا إضاءة",
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
      panel: { title: "ملف الرحلة منخفض الكربون", status: "صافي صفر 2040" },
      notes: {
        fuel: "مزيج الوقود البديل",
        shore: "موانئ الطاقة الشاطئية",
        eco: "ممرات بيئية",
        ecoV: "38 مسارًا",
        offset: "تعويض كربون 58.2 مليون كجم سنويًا",
        since: "الكربون لكل حاوية مقارنةً بخط أساس 2021 — الأقل أفضل",
        co2: "كربون / حاوية",
      },
    },
    {
      tag: "المحرك 05 · الثقة",
      pre: "الشفافية المطلقة وأتمتة العقود عبر ",
      accent: "البلوكشين",
      post: "",
      desc: "إثبات، لا وعود. كل مستند ودفعة وتسليم مقفل في سجل لا يُكسر — مرئي للجميع.",
      bullets: [
        "كل مستند مقفل على سجل غير قابل للتلاعب",
        "مدفوعات تُطلق نفسها تلقائيًا عند عبور النقاط",
        "حقيقة واحدة مشتركة للشركاء والموانئ والجمارك",
      ],
      chips: ["عقود ذكية", "بوليصة رقمية", "صفر تلاعب"],
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
    built: "بُنيت من الصفر على يد أحمد ياسر عثمان السيد — أخصائي سلاسل الإمداد واللوجستيات",
    office: "YASLOGIST · الفرع المؤسسي — الدقي، القاهرة، مصر",
    ctaWhats: "راسل المؤسس مباشرة",
    ctaCall: "اتصل الآن",
    phone: "+201002029997",
    note: "متاح على مدار الساعة · اتصال ورسائل مباشرة",
    short: "تواصل",
  },
  footer: {
    blurb: "منصة الجيل القادم لذكاء سلاسل الإمداد العالمية — 240+ سفينة و86 ميناءً وعقل واحد.",
    cols: [
      { head: "الشركة", links: ["عن YASLOGIST", "الوظائف", "الصحافة", "المستثمرون"] },
      { head: "الشبكة", links: ["شبكة السفن", "شركاء الموانئ", "الموانئ الفائقة", "الجو والبر"] },
      { head: "التقنية", links: ["منصة الذكاء الاصطناعي", "أجهزة الاستشعار", "البلوكتشين", "واجهة API مفتوحة"] },
    ],
    bottom: "© 2026 YASLOGIST · منصة الجيل القادم لذكاء سلاسل الإمداد · جميع المسارات محفوظة",
    terms: "الشروط",
    privacy: "الخصوصية",
    security: "الأمان",
    back: "العودة إلى السطح",
    close: "إغلاق",
    legal: {
      terms: [
        "YASLOGIST منصة لذكاء سلاسل الإمداد تُدار من فرعها المؤسسي في الدقي، القاهرة، مصر.",
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
    utc: "UTC · مزامنة الأسطول طبيعية",
    health: "صحة النظام 100%",
    sys: "الرابط · تشفير AES-256 · ناقل علوي 12.4 جيجابايت/ث",
    dots: ["نظرة عامة", "الحلول", "المحاكي", "تحليلات الذكاء", "أسطول إنترنت الأشياء", "المستودعات", "السلسلة الخضراء", "البلوكتشين", "تواصل"],
  },
  clock: { cairo: "القاهرة", singapore: "سنغافورة", rotterdam: "روتردام" },
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
