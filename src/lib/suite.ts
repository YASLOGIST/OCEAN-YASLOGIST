/* ── The YASLOGIST suite ──────────────────────────────────────────────────
   One table describing every surface in the ecosystem, so the navbar switcher
   and the cross-modal handoff cards cannot drift apart.

   All four surfaces are live. Air was scaffolded after the switcher shipped —
   `air/` now carries its own Vite app (CargoSimAir, CargoVillageFlow,
   FlightRadarHUD, …) on port 3200 — so its entry was promoted from the
   disabled state it launched with.
────────────────────────────────────────────────────────────────────────── */

export type SurfaceId = "hub" | "land" | "ocean" | "air";

/* Vite serves each surface from its own dev port, so a switcher hard-coded to
   the production hosts would bounce a developer out of localhost mid-session. */
const DEV = import.meta.env.DEV;

export type Surface = {
  id: SurfaceId;
  href: string;
  live: boolean;
  /* Per-surface accent, so the active chip reads as that platform's colour:
     amber for land, cyan for ocean, neutral chrome for the hub. */
  accent: string;
  glow: string;
  en: { name: string; note: string };
  ar: { name: string; note: string };
};

export const SURFACES: Surface[] = [
  {
    id: "hub",
    href: "https://yaslogist.me",
    live: true,
    accent: "#C3CBD1",
    glow: "rgba(195, 203, 209, 0.35)",
    en: { name: "Hub", note: "Corporate" },
    ar: { name: "الرئيسية", note: "المنصة الأم" },
  },
  {
    id: "land",
    href: DEV ? "http://localhost:3000" : "https://land.yaslogist.me",
    live: true,
    accent: "#E8B317",
    glow: "rgba(232, 179, 23, 0.4)",
    en: { name: "Land", note: "Road freight" },
    ar: { name: "البري", note: "الشحن البري" },
  },
  {
    id: "ocean",
    href: DEV ? "http://localhost:3100" : "https://ocean.yaslogist.me",
    live: true,
    accent: "#22E4FF",
    glow: "rgba(34, 228, 255, 0.45)",
    en: { name: "Ocean", note: "Maritime" },
    ar: { name: "البحري", note: "الشحن البحري" },
  },
  {
    id: "air",
    href: DEV ? "http://localhost:3200" : "https://air.yaslogist.me",
    live: true,
    accent: "#9BB0BC",
    glow: "rgba(155, 176, 188, 0.3)",
    en: { name: "Air", note: "CAI Cargo Village" },
    ar: { name: "الجوي", note: "قرية البضائع CAI" },
  },
];

export const SUITE_LABEL = {
  en: "Logistics Suite",
  ar: "منظومة الخدمات",
};
