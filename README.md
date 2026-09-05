# YASLOGIST — Ocean

[![Language: TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6)]()
[![Build: Vite](https://img.shields.io/badge/build-Vite-646cff)]()
[![Surface: ocean.yaslogist.me](https://img.shields.io/badge/live-ocean.yaslogist.me-0284c7)]()

The **Ocean** surface of YASLOGIST — the Egyptian sea-freight view of a single shipment record.

A shipment carries many identities on its way through a port: a booking reference, a bill of lading, a container number, an ACID, a gate pass, a truck plate. YASLOGIST reads those references onto **one record** and keeps it intact across the handover from sea to road. This repository is the front end for the ocean view of that record.

---

## What this is — and what it is not

YASLOGIST **observes and unifies shipment data. It does not move cargo, and it does not file declarations.**

- Not a freight forwarder, a shipping agent, or a customs broker.
- No fleet, no vessels, no warehouses, no customs filing on anyone's behalf.
- Customs milestones reach YASLOGIST through the customer or their licensed broker — never by direct authority access.

The boundary is a design constraint, not a disclaimer. Every claim on the site is written to stay inside it.

## The five engines

The page frames five recurring, costly bottlenecks in Egyptian ocean freight, and pairs each with the capability that reads it — one to one:

| # | Bottleneck | Engine (what the record reads) |
|---|------------|--------------------------------|
| 1 | Empty repositioning cost | Predictive ETA & repositioning signal |
| 2 | Berth queue & demurrage | Vessel AIS & berth visibility |
| 3 | Pharma cold-chain breaks | Cold-chain monitoring (2–8 °C) |
| 4 | ACID & B/L rejections | ACID & B/L reference stitching |
| 5 | Document & release fraud | Tamper-evident shared record |

Every figure shown on these engines is an **illustrative model output**, marked inline with a model badge rather than presented as a live operational feed. You will not find shipment counts, container volumes, customer counts, or uptime figures here — because they would not be true yet.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** with `vite-plugin-singlefile` (the production build inlines to a single HTML file)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- `clsx` + `tailwind-merge` for class composition
- `@vercel/analytics` + `@vercel/speed-insights`

## Design system

- **Bilingual** English / Arabic, switched by paired `lang` spans with CSS visibility — never JS text swapping — with full RTL via logical properties.
- **Light / dark** themes via `[data-theme]` with a pre-paint head script; every color is a token, and both theme blocks define an identical token set with documented contrast ratios.
- Identifiers are the imagery: no stock photography, no world map, no fabricated dashboards. One accent, used sparingly.

## Quick start

```bash
git clone https://github.com/YASLOGIST/OCEAN-YASLOGIST.git
cd OCEAN-YASLOGIST
npm install
npm run dev        # Vite dev server, http://localhost:5173
```

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (single-file output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` — types, JSX and imports |
| `npm run test` | Scroll-harness checks (requires `bun`) |
| `npm run check:bundle` | Bundle-size gate |
| `npm run gate` | Full gate: typecheck → test → build → bundle check |

Run `npm run gate` before every push. Ship only when it is clean.

## Building & deploying

`npm run build` emits a single-file production build to `dist/`. The site is deployed on Vercel and is Git-connected on `main`, so a push to `main` triggers a production build and deploy. Verify locally with `npm run preview` first.

## Verification

Beyond `npm run gate`, every visual change is checked across **5 viewports (360 / 375 / 390 / 412 / 430) × 2 languages × 2 themes** for document overflow, element spill, sub-44px tap targets, caption collisions, and text truncation. A change ships only at zero issues.

## Credits & contact

Built from scratch by **Ahmed Yasser Ali** — supply chain & logistics, New Cairo, Cairo, Egypt.

- Web: [yaslogist.me](https://yaslogist.me) · Ocean: [ocean.yaslogist.me](https://ocean.yaslogist.me)
- New enquiries: `contact@yaslogist.me` · Existing shipments: `support@yaslogist.me`
- WhatsApp: +20 104 113 9910

The YASLOGIST name, mark and interface are the founder's work. Please ask before reusing them.
