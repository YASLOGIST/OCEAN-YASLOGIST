# YASLOGIST — Handoff

**Rewritten:** 2026-08-15. **This file supersedes every prior version.** It is
self-contained: a new session needs nothing but this document and the repo.
Earlier handoffs were append-only logs across eleven sessions; that history has
been distilled here and the append log discarded. Where a number appears it was
measured on this machine, not estimated. Where something is unmeasured it says so.

---

## 1 · WHAT THIS IS

| Field | Value |
|---|---|
| **Name** | YASLOGIST |
| **Purpose** | One-page bilingual (EN/AR) marketing + interactive-demo site for a supply-chain intelligence platform, presented as a **commercial** product. Corporate branch: Dokki, Cairo, Egypt. |
| **Path** | `Desktop/𓂀/YASLOGIST` — **moved 2026-08-20** from `Desktop/YASLOGIST`. The non-ASCII segment breaks some runtimes' module resolution, so `Desktop/.claude/launch.json` points at an ASCII symlink `Desktop/.claude/yaslogist` instead. |
| **Stack** | Vite `7.3.2` · React `19.2.6` · React-DOM `19.2.6` · TypeScript `5.9.3`. **Not Next.js.** |
| **Styling** | Tailwind CSS `4.1.17`, CSS-first. **No `tailwind.config.*`, no `postcss.config.*`.** Tokens live in the `@theme` block at the top of `src/index.css`. Plugin: `@tailwindcss/vite`. |
| **Runtime deps** | `clsx@2.1.1`, `tailwind-merge@3.4.0`, `react@19.2.6`, `react-dom@19.2.6`. That is the complete list. |
| **Build plugin** | `vite-plugin-singlefile@2.3.0` — inlines all imported assets as base64 into one `index.html`. Files in `public/` bypass this and stay external. Single most important constraint on the project. |
| **i18n** | Hand-rolled dictionary in `src/lib/i18n.tsx`. Access via `t()` / `ta()` from `useLang()`. Direction set imperatively: `document.documentElement.dir`. Persisted to `localStorage["oq-lang"]`. |
| **Theming** | `data-theme` attribute on `<html>`, set in `src/lib/theme.tsx`. Persisted to `localStorage["oq-theme"]`. Default **dark**. |
| **Toolchain** | **npm is canonical** (confirmed by the owner 2026-08-20). node `v26.7.0` · npm `11.19.0` · bun `1.3.14`. `npm ci` is the install of record and **passes**. **bun is still required** — not as a package manager, but as the *runtime* for `npm run test` (`bun tests/scroll-harness.ts`), which is a step of `npm run gate`. Vercel does not need it: `vercel.json` builds with `npm run build`, not `npm run gate`. |
| **Package-manager cleanup (2026-08-20)** | A parallel agent had introduced pnpm: `pnpm-lock.yaml` + a malformed `pnpm-workspace.yaml` (`allowBuilds: esbuild: set this to true or false` — no `packages:` key, not a real pnpm field), and `@vercel/analytics` was installed through pnpm so it never reached `package-lock.json` — **`npm ci` was broken**. Both pnpm files deleted, `npm install` re-synced the lock, `npm ci` verified green, and the hybrid `node_modules` (it carried *both* `.pnpm/` and `.package-lock.json`) was rebuilt clean. Pinned versions never drifted: vite 7.3.2 · react 19.2.6 · typescript 5.9.3 · tailwindcss 4.1.17. **`bun.lock` was removed in the same pass** (owner-confirmed): it was a stale dependency lockfile from a past `bun install`, and a third claimant for package-manager auto-detection. Deleting it does **not** affect the bun-run test harness, which executes a TS file directly and installs nothing. `package-lock.json` is now the sole lockfile; `npm ci` re-verified green and the built artifact was byte-identical (922084 B) before and after. |
| **Vercel build** | `vercel.json` pins `installCommand: "npm ci"` and `buildCommand: "npm run build"`. This is **not cosmetic**: the production build for commit `07fbc19` logged `Detected pnpm-lock.yaml … Using pnpm@10.x … Done in 592ms using pnpm v10.28.0`, so the live site on `yaslogist.me` was being built by pnpm, not npm. Project `framework` is **null** (Other preset), so build/output otherwise come from dashboard settings not visible in the repo — `outputDirectory` was deliberately **left unset** so the working detection is not disturbed. |

**No academic affiliation anywhere.** The platform was repositioned from an
academic project in an earlier session. `AASTMT`, `Arab Academy`, `CITL` and the
registration ID `211010469` are absent from the built artifact (verified: 0
occurrences). Do not reintroduce them.

---

## 2 · HOW TO VERIFY — run this first

```bash
cd ~/Desktop/.claude/yaslogist && npm run gate
```

That path is an **ASCII symlink** to the project, and it is the command to use.
The project itself lives in a `~/Desktop` folder whose name is a single Egyptian
hieroglyph (see §1). Do not retype that character: it does not survive shell or
tooling round-trips here — `cd` fails, `find -print` drops the segment, and
Python's `realpath` returns a lossy path. The symlink is the reliable handle;
`Desktop/.claude/launch.json` points at it for the same reason.

`gate` = `typecheck && test && build`. **Always use it.** `npm run typecheck`
invokes `tsc` through npm, which puts `node_modules/.bin` first on PATH, so it
cannot be shadowed by a global TypeScript. Do **not** use bare `npx tsc` — see
§5.3.

### Exact expected values (measured 2026-08-15)

| Gate | Exact value |
|---|---|
| TypeScript | **0 errors**, compiler **5.9.3** |
| Scroll harness | **41/41 assertions passed** |
| `dist/index.html` | **922110 bytes** (Vite prints `922.11 kB`) |
| gzip | **491.87 kB** |
| `.DS_Store` in dist | **0** |
| `scroll-harness` in bundle | **0** |
| `dist/` top level | exactly `frames` and `index.html` |
| `dist/frames/night` | 60 files, 3260 KB |
| `dist/frames/day` | 60 files, 2072 KB |
| `dist/frames/night-sm` | 60 files, 1180 KB |
| `dist/frames/day-sm` | 60 files, 504 KB |
| Academic references in bundle | **0** |
| Console errors on load | **0** |
| Mounted components | `canvases: 2` · `videoElements: 0` · `solutionCards: 5` · `.nf: 1` · `.bay: 1` · `.radar-scope: 1` · `chainNodes: 7` · `.clock-value: 3` |

Any deviation means something changed after this was written.

**Markdown leak guard:** `src/index.css` contains `@source not "../*.md";`
immediately after `@import "tailwindcss"`. Without it, Tailwind scans this file
and compiles quoted class names into production CSS. Verified: the bundle is
byte-identical with and without `HANDOFF.md` present. Do not remove that line.

---

## 3 · CURRENT ARCHITECTURE — the parts that bite

### 3.1 Scroll engine (`src/lib/scroll.ts`)
One rAF loop, zero layout reads inside it. Exposes `startScrollLoop`,
`stopScrollLoop`, `wakeScrollLoop`, `subscribeScroll`. Frame shape is exactly 9
keys: `dir, progress, raw, rawProgress, reduced, scrub, vel, vh, y`. Sleeps when
motion converges; wakes on gesture, `ResizeObserver`, or a 250 ms watchdog.
`tests/scroll-harness.ts` covers it with 41 assertions and imports the real
`ScrollFrame` type, so a contract change fails the typecheck.

### 3.2 Parallax must stay anchored (`src/components/ui.tsx`)
`Parallax` has two modes. Default displaces by `f.y * speed` — **absolute scroll,
unbounded**. `anchor` displaces from the element's own centre and clamps to its
on-screen travel. **Every repeated section must pass `anchor`.** `PillarSection`
does. Hero deliberately does not (see §6, B2).

### 3.3 SVG text in RTL (`src/lib/svgText.ts`)
`text-anchor` resolves against the element's own direction, not geometry, so
under RTL `start` becomes the right edge. `letter-spacing` breaks Arabic cursive
joining. `font-family: monospace` has no Arabic coverage. `svgTextProps(side,
rtl)` resolves all three; `svgNumProps(side)` is the LTR-locked variant for
numerals. **Never partially override its output** — mixing an RTL-derived anchor
with an LTR direction puts text on the wrong side of its own `x`.

### 3.4 Background frames (`src/components/Background.tsx`)
No `<video>` anywhere. Two canvases blit a JPEG frame sequence. Frame set is
chosen once per load: `innerWidth × min(devicePixelRatio, 2) <= 900` selects
`640×360`, else `1280×720`. First 6 frames load at `fetchpriority="high"`; frames
7–60 load after `load` + `requestIdleCallback` at `fetchpriority="low"`.
**No cancellation flag in that effect** — React StrictMode's throwaway unmount
would set it and permanently silence the only `Image` objects created.

### 3.5 Theme tokens
Anything coloured that appears **outside** a dark well must be token-driven
(`--stat-hero`, `--hairline`, `--tile-bg`, `--tile-brd-hover`, `--glow-soft`).
Hardcoded mint/cyan lands near-white-on-white in the light theme. This defect
class has recurred three times. The `.nf` and `.bay` wells keep dark backgrounds
in both themes **by design** — they are instrument screens.

### 3.6 Declared viewport floor: 360 px
The site supports **≥360 px normally**; below that it deliberately degrades. The
floor is expressed as `max-[360px]:` arbitrary variants — Tailwind emits
`@media not all and (min-width:360px)`, so it is **active at ≤359 px and off at
≥360 px** (both boundaries measured). Five occurrences, all greppable with
`rg 'max-\[360px\]' src`: the Blockchain ledger row and steps row switch to a
2 × 2 grid with their connectors hidden, and the header hides its wordmark.
It exists because three separate surfaces run out of width below 360 px and no
sizing tweak reaches 320 px (§4, B6). **If you add anything to the header bar or
that panel, re-check 320 px** — the floor is what keeps the mobile menu button
reachable there.

---

## 4 · CLOSED — with technical cause

| Item | Cause / resolution |
|---|---|
| **§4.5 visual verification, English** | Real Chrome, motion enabled: neural card packets animate, committed path renders, Bay 07 ribbon and floor plan correct, p4/p5 cards intact at the seam. |
| **§4.5 visual verification, Arabic** | Real Chrome, `dir=rtl`: cursive joining intact, `عربي` pill in Aref Ruqaa, Cairo-first clock, founder line `YASLOGIST · الدقي، القاهرة`, numerals LTR-pinned, counterfactual strip direction-coded correctly. |
| **FIX A — p2×p3 and p4×p5 card collision** | `Parallax` displaced by unbounded absolute `scrollY`; `PillarSection` alternates the sign, so `(+,−)` neighbours converged at `\|2·speed\|·scrollY`. At scroll 7170 that sliced 205 px off the p4 card and 201 px off p5 (sections are exactly adjacent and `overflow:hidden`). Fixed by anchoring displacement to element centre and clamping to travel; max offset fell from 370 px to ≤41 px. 0 overlaps across 9 viewport×language×theme combinations. |
| **Commercial repositioning** | All academic references removed from source, dictionary, meta description and built artifact. `AastmtEmblem`, `AastmtBadge`, `aastmtLogo` and `.credential-badge` deleted. |
| **RTL SVG text** | Three stacked defects (direction-relative anchors, letter-spacing severing joins, monospace fallback) fixed via `src/lib/svgText.ts`. |
| **Phase 2 — Neural Route Forecast** | Column captions, committed path derived from the edge set (cannot drift from the topology), confidence pinned to its node, hero metric band. |
| **Phase 2 — Autonomous Bay 07** | Process ribbon `INBOUND › STORAGE › PICK › OUTBOUND` (4 nodes; connectors are `::after` chevrons that flip under RTL), throughput promoted to hero. |
| **Phase 3 — Connect card** | Moved onto shared `.glass-strong`, decorative glows 3→1, typographic hierarchy, provenance block. Credibility line split from the promise line so they are complementary, not duplicate. |
| **Phase 3 — Simulator** | `useAnimatedNumber` returns `[value, settling]`; `is-computing` state propagates slider→outputs→route. Tactile `:active` slider. Demo-provenance chip. **Computation logic unchanged.** |
| **Counterfactual readout** | Second evaluation of the *same* formulas at an alternate corridor weighting. Verified against hand arithmetic at 500,000 TEU × 12,000 NM: `+1d 17h`, `+17,010 t`, `−$50.4M` all match. |
| **P1/P3 — frame delivery** | Mobile 640×360 set added; deferred loading. Mobile transfer **2902 KB → 1103 KB (−62%)**, decoded bitmap **211 MB → 53 MB (−75%)**. Desktop unchanged (verified `lg`, 1280×720, 2902 KB). |
| **R1/R2/R3 — compositor cleanup** | `blur-3xl` washes → `.glow-wash` radial-gradients (no element `filter`, no promotion); `will-change` removed from `.solution-card`, `.nf-node`, `.bay-*`, `.chain-pulse`, `.radar-blip`, `.radar-trail`. **`will-change` 46 → 10**, element filters **7 → 1**, estimated layer memory **77.9 MB → 36.2 MB (−54%)**. Kept on `.bg-camera`, `.radar-sweep`, `.cta-primary` — those do continuous transform work. All animations verified still running. |
| **tsc shadowing** | `npx tsc` resolved a different TypeScript (7.0.2) and printed help instead of compiling, exiting 0 — a silent no-op typecheck. Permanently fixed by `npm run typecheck` / `npm run gate`, which resolve `node_modules/.bin` first. Verified 5.9.3. |
| **B1 — theme toggle 30.89 px at ≥1536 px, English** | **The recorded cause was wrong.** The row's *natural* content at ≥2xl is **1222.69 px** against the **1158 px** `max-w-7xl` leaves — a **64.69 px** deficit, not ~9 px. The old figure was the toggle's *share* of the shrink, read from post-shrink widths. Flex spread the deficit across the logo (−21.64 px), the status pill (−33.70 px — it was wrapping to two lines, 41 px tall) and the toggle (−9.11 px). Raising the clock's breakpoint is **disproven** as a fix: `max-width` is a flat 1280 px at every viewport ≥1280 px, so the budget is identical at 1536 px and at 2560 px (both measured: avail 1158, toggle 30.89) — a higher threshold only relocates the defect. Narrowing `GlobalClock` cannot reach 64.69 px either: its two inter-column gaps total just 32 px. Fixed by widening the header container to the section content grid at ≥2xl — `2xl:max-w-[85rem]` (1360 px outer → 1280 px bar, exactly the section width, so the bar aligns with section content instead of sitting 40 px inside it) — applied **in English only**, since Arabic already fits with 176.16 px to spare and any shared-path change would move it. Result: toggle **40 × 40**, status pill on **one line** (166.55 × 27.5), logo at its natural 257.63 px, row overflow 0, 15.31 px slack. Verified in all four EN/AR × dark/light combinations on the built artifact; Arabic **pixel-identical** on every header rect (x, y, w, h). |
| **AUDIT Row 3 — Neural Route Forecast labels illegible on phones** | A scaling problem, not a sizing one. The diagram's viewBox is **460 user units** wide but the card is only ~226 px on a phone, so everything inside is scaled by **0.491**: labels declared at 7.5–9.5 user units render at **3.7–4.7 effective CSS px**, roughly a third of any comfortable minimum. **Raising the declared size is not available** — measured gutters hold only **11.3 units (left)** and **10.3 units (right)** of slack, so larger text overflows the viewBox immediately; and enlarging the viewBox lowers the scale by the same factor, netting nothing. The labels are therefore **hidden below `sm`** (`.nf svg text { display: none }`). Nothing is lost: the `<svg>` is already `aria-hidden`, so assistive tech never had them, and the HTML band underneath states the same content at full size — the legend line *"Four live signals · one committed route"* plus the **Accuracy 94.2%** figure. The diagram still reads as a deliberate visual: with labels gone the drawing occupies **86.8%** of the SVG width, leaving only ~27 px of the former right gutter empty. **At ≥640 px the labels stay** — the card is 470 px there and they reach **7.63 / 8.65 / 9.67 px**, in line with the 8 px micro-type used across the site. Verified in all four combinations at 390 px (0/11 shown) and 640 px (11/11, unchanged). **+26 B**, exactly `.nf svg text{display:none}` folded by the minifier into the existing `max-width:639px` block. CSS-only — the `<text>` elements are untouched in source. |
| **AUDIT Rows 4–7 — 320 px bleed, two distinct causes** | The four "cosmetic bleed" rows did **not** share one root cause; batching them blindly would have mis-fixed half. **Family A (Rows 5, 7)** — both Simulator output strips are `grid-cols-3`, giving 60.7 px columns at 320 px whose tile padding leaves **32.7 px** (`.metric-tile`) / **36.7 px** (`.stat-tile`) for content that inks at 53.3–58.5 px. Unfixable by padding or type (21.6 px would have to fall to ~12 px), so below the 360 px floor both become `grid-cols-1` — one column, not two, because three items into two columns orphans one. Result: 206 px columns, **13–15 px of clearance** instead of bleed. **Family B (Rows 4, 6)** — a large figure beside a `min-w-0` caption inside a flex row, so flex shrank the block below its own content and `overflow: visible` let the ink bleed: the Vessel figure inked **139 px in a 118.7 px box**, physically overlapping the `shrink-0` FLAG/IMO column by 4.1 px, and VoyageProfile's caption box was squeezed to **12.1 px** against 20.5/43.5 px of ink. Fixed by **stacking the pair** (`flex-col items-start`) below the floor rather than shrinking type — these are hero figures and the whole point is that they read large. Result: bleed **0**, caption box 12.1 → 116 px. Verified all four combinations at 320 px in both languages; **≥360 px reverts exactly** (hero `row`, grids 3-up, p4 `row`), so ≥640 is untouched. **+444 B**, accounted exactly: 270 B new floor utilities + 174 B class strings. No new `will-change` or `backdrop-filter` surfaces (P5/P6 guardrail). |
| **AUDIT Row 1 — Bay 07 process ribbon clipped** | Found by the 2026-08-20 proactive audit, not by a report. `.bay-flow` is `grid-template-columns: repeat(4, 1fr)`, and **`1fr` carries an implicit `auto` (min-content) minimum**, so each column was pinned to its word plus 24px of padding rather than to a quarter of the track — measured `65.2 / 65.2 / 48.4 / 70.8px` = **261.6px against a 228px container** at 390px. The grid overflowed and `overflow-hidden` cut the terminal step: **`Outbound` clipped 79.6px @320, 39.6px @360, 9.6px @390**; Arabic `الصادر` 39.4px @320. Fixed in CSS only, below `sm`: step padding `0.75rem → 0.3125rem`, tracking `0.16em → 0.06em`; and below the 360px floor (§3.6) the ribbon becomes `repeat(2, 1fr)` with the `::after` chevrons suppressed — the chevron's `-0.3rem` inset overhangs the track by 4.8px and would dangle at the row break. **Two ordering traps:** the chevron override must sit *after* the base `.bay-flow-step::after` rule (equal specificity, source order decides) **and** must also name `[dir="rtl"] .bay-flow-step::after`, which outranks it (0,2,1 vs 0,1,1) — the first attempt failed silently in Arabic only. Result: overflow **0** everywhere; true min-content margin **13.2px EN / 32.6px AR** at 360px; 25px inside the clip edge at 320px, all four combinations. **≥640px untouched** (12px padding, 1.28px tracking, chevrons, 4 × 144px). |
| **AUDIT Row 2 — Stats figure clipped** | The tile grid is `grid-cols-2` below `lg` with `p-7` (28px) and a `text-4xl` (36px) figure. At 320px each column is **127.5px** while `99.98%` alone renders **132.4px** — wider than the column *before any padding* — so it overflowed its tile and the container's `overflow-hidden` cut it: **33.9px past the card edge @320, 13.9px @360**, and only **1.1px** of margin left @390. Fixed below `sm` only: tile `p-7 → p-4` and figure `text-4xl → text-2xl` (24px). Settled ink now **88.3px in a 94.5px box = 6.3px slack** at 320px EN (24.5px AR), overflow 0. **≥640px untouched** (43.2px figure, 32px padding). **Measurement note:** the `CountUp` figures never settle under programmatic scrolling here, so early samples read `0.00%` and made the deficit look smaller — and made dark/light look different (28 vs 34px) when the geometry is in fact theme-invariant. Measure the *settled string's ink* with an offscreen probe at the live font, not the animated element. |
| **B6 — 320 px structural failure (ledger row + steps row + header)** | Three surfaces, not two: at 320 px the header needed 308.7 px against 262 px (hamburger **17.7 px off-screen**), the ledger row 184 px against 158 px (chip **9 px outside**), and the steps row 149 px against 124 px. Sizing was genuinely exhausted — the ledger row fits only at viewport ≥ ~346 px and the steps row ≥ ~345 px — so this is the one item that took structure. **A hard floor is now declared at 360 px**, the width every other fix is verified at, expressed as `max-[360px]:` arbitrary variants (Tailwind emits `@media not all and (min-width:360px)`, so it is active at ≤359 px and off at ≥360 px — both boundaries measured). Below the floor: both panel rows become `grid grid-cols-2 justify-items-center gap-y-4` and their connectors are `hidden` — **all four blocks, all four hashes and all four steps survive**; only the connector line, which is decoration rather than information, is dropped. The header hides the wordmark (`.leading-none` → `max-[360px]:hidden`), reclaiming 92.7 px against a 46.7 px deficit and removing *decoration* rather than *function* — the language pill, theme toggle and menu button all stay. Alternatives rejected on evidence: `overflow-x-auto` on the ledger row would clip the `-top-2` chip vertically (setting one overflow axis to auto forces the other) and re-open B4; dropping to three nodes edits content; hiding the hashes removes the ledger evidence the panel exists to show. Result at 320 px, all four combinations: header overflow **0** with the hamburger **29 px inside the viewport**, both rows overflow **0**, chip **36.5 px inside**, every step label on one line. Verified identical at 359 px. **≥360 px is untouched** — at 360 px the floor reads inactive, the wordmark is `block`, both rows are `flex` with connectors `block`, and every B4/B5/B7 value is unchanged. |
| **B5 — smart-contract steps row cut in English** | Measured rather than assumed, and it did **not** match B4's numbers: at 360 px the four step columns are sized by their labels (Initiate 44.8 px, the rest 33.6 px; the 28 px circles never bind, and `max-w-[4.5rem]` never binds because nothing wraps), needing **193.6 px** against the **164 px** the inner box leaves — a **29.6 px** deficit. Arabic already fit (labels 10.8–20.4 px, columns pinned to the 28 px circles). Fixed in B4's category — spacing and type inside the existing elements, no restructure: connector `mx-2` → `mx-1 sm:mx-2` (−24 px) and label `tracking-[0.16em]` → `tracking-[0.06em] sm:tracking-[0.16em]` (−15 px), keeping the 8 px type so the caps stay legible. Row intrinsic **193.6 → 148.8 px**, leaving **15.2 px** of slack; no padding change was needed. Verified in all four combinations at 360 px: overflow 0, every label on one line and inside the panel. **≥640 px is untouched** — English tracking back to 1.28 px and label widths back to 44.8/33.6/33.6/33.6. (Arabic computes 0.08 px there by design: the project neutralises letter-spacing in Arabic to protect cursive joining — that is not a regression.) |
| **B7 — 390 px header overflow, menu button unreachable** | The phone bar was over-subscribed: logo 194.5 px + controls 192 px + a 24 px gap needed **410.5 px** against the **316 px** a 390 px viewport left — **94.5 px** over in English (66.7 px in Arabic, which was **also broken**, contrary to B1's language split). The row spilled past its box and carried the hamburger **57.5 px off-screen** in English and 29.7 px off the left edge in Arabic, silently, because `overflow-x-clip` on the page wrapper suppresses any scrollbar — `document.scrollWidth` still read 390. Fixed by reclaiming width below `sm` only, every step restoring its current value at `sm`: outer padding `px-4 sm:px-5`, bar `px-3` + `gap-2 sm:gap-6 sm:px-5`, control cluster `gap-1.5 sm:gap-2.5`, logo `gap-2 sm:gap-3`, brand mark `h-10 w-10 sm:h-11 sm:w-11`, wordmark `text-[13px]` (`sm:text-lg` unchanged), the decorative `CORE` badge `hidden sm:inline-block`, and a `@media (max-width:639px)` rule tightening `.lang-opt` from `min-width:2.5rem`/`padding:0 .5rem` to `2rem`/`0 .25rem` — the pill was 92 px, the single widest control on the bar. Result at 390 px, all four combinations: row overflow **0**, hamburger **13 px inside the bar / 29 px inside the viewport**, wordmark on one line. At 360 px it also passes (6.3 px inside the bar in English, 13 px in Arabic). **Verified functionally, not just geometrically:** the button hit-tests as its own target, clicking it flips the overlay to `pointer-events-auto opacity-100`, its links hit-test as clickable, and a screenshot shows the menu open with all 9 links. **≥640 px is untouched** — padding 20/20, gaps 24/10/12, mark 44 px, wordmark 18 px, `CORE` visible, pill 92 px, all re-measured. |
| **B4 — Blockchain `VERIFIED` chip clipped** | **The recorded cause was wrong.** `-end-2` is not the problem: at 1920 px the chip sits **21 px clear** of the panel in all four combinations. The real cause is the ledger row's intrinsic width. Each node wrapper is sized by its **hash caption**, not the node, giving the row a **268 px** minimum against the **198 px** the panel leaves at a 360 px viewport. The row overflowed by 70 px and pushed the final node *and* its chip outside the panel, where `overflow-hidden` cut them — measured at 360 px: chip **45 px** outside in English, **29 px** outside in Arabic (node itself 37 px / 21 px outside). Fixed by tuning the row's existing sub-`sm` step so it fits: node `h-14 w-14` → `h-10 w-10`, connector `mx-1.5` → `mx-1`, hash `text-[6px] tracking-[0.04em]` with `sm:` restoring 8 px / 0.1em. Row intrinsic **268 → 206 px**. Chip now **17 px inside**, node 25 px inside, in all four combinations at 360 px. **≥640 px is untouched** (node 64 px, hash 8 px / 0.8 px tracking, connectors 10 px, chip 21 px clear). `clip-angled` unchanged. |

---

## 5 · RETRACTED — do not re-investigate these

### 5.1 The "3.5 fps during scroll" claim is FALSE
An earlier session reported 20 fps idle / 3.5 fps scrolling and filed it as the
top performance item. **It was a measurement artifact.** Chrome throttles
`requestAnimationFrame` severely for **unfocused windows**, and every benchmark
ran while the terminal held OS focus. The identical code re-run produced **182
frames at 60.2 fps**. `FCP 1348 ms` and `loadEventEnd 3021 ms` from the same
session are retracted for the same reason; re-measured with Chrome focused:
**FCP 460 ms**, `domInteractive` **84 ms**, `loadEventEnd` **181 ms**.

### 5.2 Frame rate is NOT reliably measurable with this tooling
With page identity asserted, four consecutive **identical** baselines gave
**10.0, 29.3, 19.8, 12.1 fps** — a 3× spread with nothing changed between runs.
Every run reported `document.hasFocus() === false`, and fronting Chrome first did
not change it. Every measurement path requires a Bash/osascript round trip that
leaves Chrome unfocused.

**A second trap:** an ablation matrix once showed a flat 60 fps for every group
because the active tab had silently become `chrome://new-tab-page`. Any harness
must assert `location.host` **and** site markers inside every result row.

**What the page's real cost is, measured focus-independently** via Long Animation
Frame attribution across a full scroll: style+layout **510 ms**, script **~285 ms**,
together **0.8%** of long-frame time. The worst frames carry almost nothing — a
2283 ms frame contained 34 ms of script and **0.9 ms** of style+layout; a 1302 ms
frame contained **zero** scripts. That is the browser not scheduling, not the page
being expensive. **The page's own per-frame work is ~1–2 ms.**

**Conclusion for a future session:** do not chase a compositing bottleneck. There
is no evidence one exists. If frame rate must be measured, it requires a real
Chrome performance trace driven by a human at the keyboard.

### 5.3 `npx tsc` is not a trustworthy gate
It resolved TypeScript 7.0.2 at least once and printed help text while exiting 0.
Use `npm run gate`.

---

## 6 · OPEN BACKLOG

### B3 — `.glass` / `.glass-strong` / `.nf` / `.bay` have no backdrop blur in production
**Root cause, confirmed.** `-webkit-backdrop-filter` is **inert in current
Chrome** — every prefixed form returns `none`, including `blur()` alone (tested
directly). The minifier emits **only** the prefixed property for `.glass`, `.nf`
and `.bay`, and drops the declaration **entirely** for `.glass-strong`. Only
Tailwind's `backdrop-blur-*` utilities emit the unprefixed property and actually
blur — those are the 8 surfaces that remain.

**Consequence:** the site's signature glass cards have never blurred in a
production build. This also explains why moving the Connect card onto
`.glass-strong` produced no visible change.

**Explicitly NOT fixed, by decision.** Restoring blur would add ~10 backdrop
surfaces. Weigh it against §7 before acting; it is a visual-fidelity change, not
a performance fix.

---

## 7 · DEFERRED — not started, not urgent

| Item | Status |
|---|---|
| **Tech Stack strip** | Not started. No design or copy exists yet. |
| **Blockchain disclaimer text** | Not started. The Blockchain card currently carries no equivalent of the Simulator's `sim.demoNote` provenance line. |
| **Video demo** | Not started. Requires an external tool; nothing in this repo depends on it. |

*(These three were named by the project owner as known-pending. No further detail
was supplied and none is invented here.)*

---

## 8 · NEXT STEPS — ranked by measured impact, not assumed impact

1. **Deploy correctly — `dist/frames/` must ship.** `dist/` is **not** a single
   self-contained file. `dist/frames/` is 7016 KB across 240 files in four
   directories. A pipeline that uploads only `index.html` ships a site with no
   background. This is the only item that is currently *broken in production* if
   mishandled. **Verify before anything else.**

2. **Confirm the mobile frame work on a real phone.** The measured wins are
   transfer **−62%** and decoded bitmap **−75%** on mobile — those are byte and
   arithmetic facts, environment-independent. What has *never* been verified is
   whether the site now feels fast on an actual handset. This is the single
   highest-value unknown and it needs a human with a phone.

3. **Get one real Chrome performance trace, human-driven.** Everything in §5 says
   this tooling cannot measure frame rate. A DevTools trace during scroll on both
   desktop and a throttled mobile profile would settle whether any runtime
   problem remains. Until then, treat "the site feels slow" as **unexplained**,
   not as diagnosed.

4. **Decide B3** (restore backdrop blur) — a visual-fidelity call, informed by
   step 3. Do not treat it as a bug fix.

5. **B3 is the only open item left** (§6). It is a visual-fidelity decision, not
   a bug — take it after step 3, not before. Every mobile overflow found this
   session is closed and the site now has a declared 360 px floor (§3.6).

6. **Counterfactual coefficients.** `ALT_TIME_GAIN 0.13`, `ALT_CO2_CUT 0.09`,
   `ALT_COST_GAIN 0.04` in `src/components/Simulator.tsx` are **invented**, unlike
   the IMO-DCS-derived constants above them. They are labelled as a modelled
   scenario in the UI and in a source comment. If real corridor data arrives,
   replace all three and delete the comment. **Never re-tune the committed
   constants to flatter the comparison.**

---

## 9 · WORKING RULES THAT HAVE PAID FOR THEMSELVES

- **Assert page identity inside every browser measurement.** Two separate false
  conclusions came from measuring the wrong page or an unfocused window.
- **Reload after every viewport resize, before measuring.** Sections carry
  `content-visibility: auto` + `contain: content`, so a resized window keeps the
  *previous* width's layout until the section re-renders. This produced a fake
  "B4 regressed" reading — a 64 px node at a 360 px viewport with
  `matchMedia('(min-width:640px)')` returning false — that vanished on reload.
- **Verify variant/sizing behaviour on the production build, not the dev server.**
  Tailwind's dev sheet appends newly-seen utilities in discovery order, so a base
  utility added mid-session can land *after* its own `sm:` variant and win the
  cascade at every width. Production sorts variants canonically (verified: `.h-10`
  at byte 829568, `.sm\:h-16` at 868622). Same class of trap as the one above and
  it presents identically.
- **Check the language before calling a computed value a regression.** Arabic
  deliberately neutralises `letter-spacing` to protect cursive joining, so a
  label that computes `1.28px` in English computes `0.08px` in Arabic with the
  identical class. That is correct, not a bug.
- **Test the hypothesis, don't assert it.** "The minifier's missing space breaks
  `backdrop-filter`" was wrong; a two-line probe disproved it and found the real
  cause.
- **Verify in all four combinations** (EN/AR × dark/light). Three separate
  light-theme contrast defects and two RTL defects were caught only this way.
- **Account for every byte of bundle delta.** It has repeatedly surfaced changes
  nobody intended.
- **Docs are part of done.** This file is the only durable memory across sessions.
