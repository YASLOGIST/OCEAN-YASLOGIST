# YASLOGIST — Handoff

**Rewritten: 2026-08-21. This file supersedes every prior version.** It is
self-contained: a new session needs nothing but this document and the repo. Do
not append to it — rewrite it, so it never becomes a log again.

Every number here was measured on this machine during the session that wrote it.
Where something is unmeasured, unverified, or merely claimed, it says so
explicitly. Treat an unlabelled number as measured and an unlabelled claim as
suspect.

---

## 0 · IF YOU READ NOTHING ELSE

```bash
cd ~/Desktop/.claude/yaslogist && npm run gate
```

Expect `41/41 assertions passed`, `dist/index.html 896.87 kB`, and
`✓ dist/index.html: 0 academic references (4 tokens checked)`, exit 0.

The working tree is **clean**, `main` equals `origin/main` at `9a6512a`, and the
live site serves a byte-identical copy of the local build — confirmed by hashing the
response, not by trusting deployment status. The Bug A/B/C/D, legibility and
glass work in §4 is **shipped**.
Nothing is currently broken in production. The only open work is §6.

A prior version of this section named `b880e3f` as HEAD while the tree was
already at `e343c4a`; every number here is re-read from `git rev-parse`.

---

## 1 · WHAT THIS IS

| Field | Value |
|---|---|
| **Name** | YASLOGIST |
| **Purpose** | One-page bilingual (EN/AR) marketing and interactive-demo site for a supply-chain intelligence platform, presented as a **commercial** product. Corporate branch: Dokki, Cairo, Egypt. |
| **Path** | `/Users/ahmede/Desktop/YASLOGIST`, reached through the ASCII symlink `~/Desktop/.claude/yaslogist`. **Use the symlink.** A prior version of this file said the project had moved to `Desktop/𓂀/YASLOGIST`; that is **false and was corrected 2026-08-21** — the hieroglyph folder exists but contains unrelated files, and `git rev-parse --show-toplevel` resolves to `Desktop/YASLOGIST`. |
| **Stack** | Vite `7.3.2` · React `19.2.6` · React-DOM `19.2.6` · TypeScript `5.9.3`. **Not Next.js.** |
| **Styling** | Tailwind CSS `4.1.17`, CSS-first. **No `tailwind.config.*`, no `postcss.config.*`.** Tokens live in the `@theme` block at the top of `src/index.css`. Plugin: `@tailwindcss/vite`. |
| **Runtime deps** | `react@19.2.6`, `react-dom@19.2.6`, `clsx@2.1.1`, `tailwind-merge@3.4.0`, `@vercel/analytics@^2.0.1`, `@vercel/speed-insights@^2.0.0` — **six, not four**. A prior version of this file listed only the first four and called that "the complete list"; the two Vercel packages were already in `package.json`. |
| **Build plugin** | `vite-plugin-singlefile@2.3.0` — inlines every imported asset as base64 into one `index.html`. Files in `public/` bypass this and stay external. This is the single most important constraint on the project: **anything you import becomes bundle weight**, which is exactly how the AASTMT leak (§4) happened. |
| **i18n** | Hand-rolled dictionary in `src/lib/i18n.tsx`. Access via `t()` / `ta()` from `useLang()`. Direction is set imperatively on `document.documentElement.dir`. Persisted to `localStorage["oq-lang"]`. |
| **Theming** | `data-theme` attribute on `<html>`, set in `src/lib/theme.tsx`. Persisted to `localStorage["oq-theme"]`. Default **dark**. |

**No academic affiliation anywhere.** The platform was repositioned from an
academic project. `AASTMT`, `Arab Academy`, `CITL` and the registration ID
`211010469` must not appear in the built artifact. **This is enforced, not
merely asserted** — see §4 and §7.2. The previous wording ("verified: 0
occurrences") was documentation only, and it had silently become false.

---

## 2 · HOW TO VERIFY

```bash
cd ~/Desktop/.claude/yaslogist && npm run gate
```

That path is an **ASCII symlink** to the project and it is the command to use.
`npm run typecheck` invokes `tsc` through npm, which puts `node_modules/.bin`
first on PATH, so it cannot be shadowed by a global TypeScript. Do **not** use
bare `npx tsc` — see §5.3.

`gate` = `typecheck && test && build && check:bundle`. The final step runs
`scripts/check-bundle.mjs` against the built artifact; it is the only gate step
that inspects `dist/` rather than source, so **it must stay last**.

### Exact expected values (all measured 2026-08-21)

| Gate | Exact value |
|---|---|
| TypeScript | **0 errors**, compiler **5.9.3** |
| Scroll harness | **41/41 assertions passed** |
| `dist/index.html` | **897279 bytes** (Vite prints `897.28 kB`) — was 896872 before the §4 F3–F6 fixes; the **+407 B** is **+395 B CSS** and **+12 B JS**, and the JS is exactly the string `"site-footer "` added to the footer's class list. The CSS splits into one new token pair, three new rules and four removed declarations; every selector in the built sheet was diffed before and after, and the only additions are `.site-footer`, `.glass.card-lift:hover` and `[data-theme=light] .glass.card-lift:hover`. **Superseded figure:** **896872 bytes** (`896.87 kB`) — was 895790 before the §4 fixes; the **+1082 B** is **+611 B CSS** and **+471 B JS**. All the JS is Bug A's clamp; the CSS splits +238 B (Bugs B/C), +293 B (contrast + glass) and +80 B (Bug D). |
| gzip, local | **472.93 kB** (`gzip -9` reports 472467 B) — was 472.84 kB |
| gzip, on Vercel | **471.23 kB** — different zlib on the build image compressing an identical file. Not a discrepancy. |
| `check:bundle` | `✓ dist/index.html: 0 academic references (4 tokens checked)` |
| `.DS_Store` in dist | **0** |
| `scroll-harness` in bundle | **0** |
| `dist/` top level | exactly `frames` and `index.html` |
| `dist/frames/night` | 60 files, **2,953,663 bytes** |
| `dist/frames/day` | 60 files, **1,980,016 bytes** |
| `dist/frames/night-sm` | 60 files, **1,111,411 bytes** |
| `dist/frames/day-sm` | 60 files, **466,983 bytes** |
| SHA-256 of `dist/index.html` | `0514d01ec7b86a0630204a12dce45c9691600bdd5e64617d17ffab1ef486b365` — the F3–F6 build, confirmed byte-reproducible across two consecutive builds. The pre-fix artifact was `19d1eb0f84f2b084d2a6b845a8ea5df215cc3a5d31ff9edc5c6ae570080bde7b` and is what production still serves. **Superseded note:** `19d1eb0f84f2b084d2a6b845a8ea5df215cc3a5d31ff9edc5c6ae570080bde7b` — this is the **fixed, uncommitted** build. `yaslogist.me` still serves `1365502a6ee110f2504aed7cba40ef8177dfa8fc492a6f269217d6c7a9ea1725`, the pre-fix artifact. They will match again once §0's outstanding commit and deploy happen. |
| Console errors on load | **0** (last measured 2026-08-15) |
| Mounted components | `canvases: 2` · `videoElements: 0` · `solutionCards: 5` · `.nf: 1` · `.bay: 1` · `.radar-scope: 1` · `chainNodes: 7` · `.clock-value: 3` (last measured 2026-08-15) |

**Correction to the previous file:** it listed `dist/frames/night` as "3260 KB".
The measured content is 2,953,663 bytes (2884 KiB), and `du -sk` reports 3020.
The other three sets matched. The frames are unchanged in git, so the old figure
was simply wrong; it is corrected above rather than carried forward.

**Markdown leak guard:** `src/index.css` contains `@source not "../*.md";`
immediately after `@import "tailwindcss"`. Without it Tailwind scans this file
and compiles quoted class names into production CSS. Verified again 2026-08-21:
this document contains the banned tokens in prose and the bundle still reports
zero. **Do not remove that line** — if you do, `check:bundle` will start failing
on the strings in this very file.

---

## 3 · ARCHITECTURE — the parts that bite

### 3.1 Scroll engine (`src/lib/scroll.ts`)
One rAF loop, zero layout reads inside it. Exposes `startScrollLoop`,
`stopScrollLoop`, `wakeScrollLoop`, `subscribeScroll`. Frame shape is exactly
nine keys: `dir, progress, raw, rawProgress, reduced, scrub, vel, vh, y`. Sleeps
when motion converges; wakes on gesture, `ResizeObserver`, or a 250 ms watchdog.
`tests/scroll-harness.ts` covers it with 41 assertions and imports the real
`ScrollFrame` type, so a contract change fails the typecheck.

### 3.2 Parallax must stay anchored (`src/components/ui.tsx`)
`Parallax` has two modes. The default displaces by `f.y * speed` — **absolute
scroll, unbounded**. `anchor` displaces from the element's own centre and clamps
to its on-screen travel. **Every repeated section must pass `anchor`.**
`PillarSection` does; the Hero deliberately does not. The previous file pointed
here at "§6, B2" for the Hero rationale, but **no B2 entry has ever existed** in
any version of this document or in git history — see §6.4.

**Both modes are now additionally bounded by the clip box** (added 2026-08-21
with Bug A, §4). `measure()` walks up to the nearest ancestor whose computed
`overflowY` is not `visible`, and the per-frame shift is clamped to the slack
the element has inside it, less `CLIP_MARGIN` (52px — the reach of
`--glass-sshadow` below a card's border box, so the box-shadow stays inside the
clip too). Without that bound the default mode rides content straight through
the clipping edge and the ancestor slices it flat. `overflowY` and not the
`overflow` shorthand: the page wrapper sets only `overflow-x`, and the shorthand
reads back there as a two-axis value that a naive `!== "visible"` test would
mistake for a clip box.

**The Hero's exemption from `anchor` is therefore now safe rather than merely
undocumented** — it still starts at zero displacement on load, which is what the
unanchored mode buys, but it can no longer grow without limit.

### 3.3 SVG text in RTL (`src/lib/svgText.ts`)
Three stacked traps. `text-anchor` resolves against the element's own direction,
not geometry, so under RTL `start` becomes the right edge. `letter-spacing`
breaks Arabic cursive joining. `font-family: monospace` has no Arabic coverage.
`svgTextProps(side, rtl)` resolves all three; `svgNumProps(side)` is the
LTR-locked variant for numerals. **Never partially override its output** —
mixing an RTL-derived anchor with an LTR direction puts text on the wrong side
of its own `x`.

### 3.4 Background frames (`src/components/Background.tsx`)
No `<video>` anywhere. Two canvases blit a JPEG frame sequence. The frame set is
chosen once per load: `innerWidth × min(devicePixelRatio, 2) <= 900` selects
`640×360`, otherwise `1280×720`. The first 6 frames load at
`fetchpriority="high"`; frames 7–60 load after `load` plus `requestIdleCallback`
at `fetchpriority="low"`. **There is deliberately no cancellation flag in that
effect** — React StrictMode's throwaway unmount would set it and permanently
silence the only `Image` objects created.

### 3.5 Theme tokens
Anything coloured that appears **outside** a dark well must be token-driven
(`--stat-hero`, `--hairline`, `--tile-bg`, `--tile-brd-hover`, `--glow-soft`).
Hardcoded mint or cyan lands near-white-on-white in the light theme. This defect
class has now recurred **five** times — instances four and five were the two
mint literals in `.live-eyebrow-ok` and `.live-eyebrow.is-computing`, found and
tokenised 2026-08-21 (§4). The `.nf`, `.bay` and `.radar-scope` wells keep dark
backgrounds in both themes **by design** — they are instrument screens.

**Their fills are only 55–75% opaque, so the ground beneath them decides what
they look like.** That ground is `--well-base`: `transparent` in dark, where the
page already supplies a dark backdrop, and an opaque `#0a1730` in light, where
it does not. Without it the same declaration renders a six-fold brighter, washed
panel in light and lets the background footage through — Bug D in §4. **If you
change a well's fill alpha, re-check both themes**, because only one of them has
a backdrop of its own.

**All three wells share one material, declared once on `.card-inset`.** Do not
put a `box-shadow` on `.nf`, `.bay` or `.radar-scope` — `.card-inset` is later
in the sheet at equal specificity and will silently replace it, which is exactly
what had already happened to the rim-and-falloff those two wells thought they
had (§4, Bug D).

**The same trap applies to every state variant, and it had already caught three
more surfaces** (§4, F5/F6). `box-shadow` is a single property: a `:hover` or a
compound rule that sets it restates the entire list and cannot add a layer, so
any rule that outranks `.glass` or `.glass-strong` silently discards the pane
material unless it restates that too. The two lit edges now live in one token,
**`--glass-edges`**, and every rule that sets `box-shadow` on a glass surface
starts with it. **If you add a state rule to a glass surface, its `box-shadow`
must open with `var(--glass-edges)`** — and if the class it hangs on is also
worn by a non-glass element, scope the restatement so that element does not
inherit edges it never had. `.card-lift` is exactly that case: the Hero
micro-card is `.glass`, the four Stats tiles are not.

### 3.6 Declared viewport floor: 360 px
The site supports **≥360 px normally** and deliberately degrades below that. The
floor is expressed as `max-[360px]:` arbitrary variants — Tailwind emits
`@media not all and (min-width:360px)`, so it is **active at ≤359 px and off at
≥360 px** (both boundaries measured). Five occurrences, greppable with
`rg 'max-\[360px\]' src`. It exists because three separate surfaces run out of
width below 360 px and no sizing tweak reaches 320 px (§4, B6). **If you add
anything to the header bar or that panel, re-check 320 px** — the floor is what
keeps the mobile menu button reachable there.

### 3.8 Footer ground (`--footer-ground`)
The footer declares no surface of its own, so its copy composites straight onto
the scroll-scrubbed footage. That is fine in dark and **measured**: with
`.bg-night-veil` in front of the sequence, the brightest tenth of the night
frames still leaves `--c-text` at **14.9:1** and `--c-muted` at **7.7:1**, so
`--footer-ground` is `none` there and the dark footer renders byte-identically
to how it always has. Light has no such veil at mid-viewport — the veil
gradient's middle stop is `transparent` — and the same copy measured **3.7:1**
over the mean of the day sequence, **1.6:1** over its darkest tenth. Light
therefore supplies an opaque ground on `--c-bg`, which restores **9.5:1**, the
same figure the muted tier already gets on a light card.

The ramp is **2rem — the footer's own top padding** — so the ground reaches
full strength exactly at the hairline above the first column (both measured at
32 px in the browser) and no copy ever lands on a partial ground. Same shape as
`--well-base` one level up, and the same reason: only one theme has a backdrop
of its own.

**`.site-footer` sets `background-image` and nothing else.** No `contain`, no
`isolation`, no `z-index`, no `transform` — `LegalModal` is a DOM child of the
footer and escapes to the viewport on `position: fixed`, and any one of those
would make the footer a containing block or a stacking context and trap it.
Verified after the change: the dialog root still measures exactly
`innerWidth × innerHeight`, hit-tests as itself, and holds focus.

### 3.7 Brand asset resolution (`src/assets/brand.ts`)
`import.meta.glob` with `eager: true`, enumerating **only the basenames actually
consumed**: `./brand/{founder,yaslogist-logo}.{png,jpg,jpeg,webp,svg,…}`. It is
not a wildcard, and that is deliberate — see §4, issue #1.

**This resolver fails silently by design.** `Brand.tsx` renders
`brandLogo ? <img> : <BrandGlyph>`, so a glob that matches nothing replaces the
real logo and founder portrait with the built-in SVG mark and the "AY" monogram
while typecheck, harness, build and `check:bundle` all stay green. **If you
touch that glob, verify the assets are still inlined**, do not just re-run the
gate. Current values, for comparison: `founder.jpg` **34,727 B**,
`yaslogist-logo.png` **50,134 B** as data URIs in the bundle.

---

## 4 · CLOSED — with technical cause

| Item | Cause and fix |
|---|---|
| **F3 — the footer had no ground in either theme** (2026-08-22) | The largest ungrounded surface on the site: `<footer>` computed `background-color: rgba(0, 0, 0, 0)` and `background-image: none` over **971 px**, so four link columns, the blurb, the phone number, the legal line and three 40 × 40 social keys at `bg-chrome/[0.04]` (4% opaque, no blur) all sat on raw footage. Same defect class as Bug D, on a surface Bug D never looked at. Measured before fixing: light theme, viewport centre, `--c-muted` **3.7:1** falling to **1.6:1** over the darkest tenth of the day sequence, against a 4.5:1 threshold — and screenshots show the hull cutting through the copyright line. Dark measured **14.9:1 / 7.7:1** at its own worst case, so it needs nothing. Fixed with `--footer-ground` (§3.8): `none` in dark, a 2rem ramp into an opaque `--c-bg` in light, restoring **9.5:1**. `background-image` only — see §3.8 for why nothing else may go on that element. |
| **F4 — four surfaces shipped a `backdrop-filter` Chrome cannot parse** (2026-08-22) | `.nf`, `.bay`, `.brand-mark` and `.lang-pill` each declared the standard property and the vendor spelling by hand, so Lightning CSS kept only the vendor line and all four computed `none` — the mechanism §6.2 documents. Resolved in **two different directions, deliberately**. `.nf` and `.bay` are opaque instrument screens whose blur would buy a dark-theme-only softening of the card gradient behind an already dark panel and pay a compositor surface for it, so **both declarations were deleted**: rendering is unchanged, the source now says what the browser does, and nobody can "restore" an effect that was never wanted. `.brand-mark` and `.lang-pill` are the opposite case — §6.2's rationale never covered them — because at scroll 0 the header and its inner bar are both fully see-through, making these two pills the only surfaces between the reader and the footage at 38% (dark) and 28% (light) transmission. For those, **only the hand-written `-webkit-` line was removed**, and the minifier now emits both spellings. Verified in Chrome: `.nf` and `.bay` compute `none`; `.brand-mark` computes `blur(8px) saturate(1.4)` and `.lang-pill` `blur(12px) saturate(1.4)`. |
| **F5 — two hover states deleted the shared glass material** (2026-08-22) | Bug D's latent defect again, on surfaces that pass did not examine. `.solution-card:hover` (0,2,0) and `.card-lift:hover` / `[data-theme="light"] .card-lift:hover` (0,2,0 and 0,3,0) all outrank `.glass` (0,1,0), and `box-shadow` is one property, so the five Solutions cards and the Hero micro-card threw away both lit edges the moment the pointer arrived. Fixed by restating `var(--glass-edges)` first in `.solution-card:hover`, and — because `.card-lift` is also worn by the four Stats tiles, which are **not** `.glass` and never had edges to lose — by adding `.glass.card-lift:hover` (0,3,0) and `[data-theme="light"] .glass.card-lift:hover` (0,4,0) rather than touching the base pair. The (0,4,0) rule is what keeps the light variant from being beaten by the (0,3,0) `[data-theme="light"] .card-lift:hover` above it; that tie is the whole reason the light rule exists separately. Verified by reproducing the cascade against the shipped stylesheet with `:hover` forced on and resolving every `var()` from the element's own computed properties: both glass surfaces keep two inset layers on hover in both themes, and the Stats tile's hover value is **unchanged, character for character**. |
| **F6 — the Closing card was permanently missing its under-edge** (2026-08-22) | `.connect-card.glass-strong` (0,2,0) restated the head rim so its added glow would not lose it, but omitted `inset 0 -1px 0 var(--glass-edge)` — one inset layer where every other glass surface has two. Not hover-only; it had always rendered that way. Fixed by the same `var(--glass-edges)` restatement. Verified: the computed shadow now carries both edges in both themes. |
| **Root cause behind F5 and F6** | Three separate rules had drifted into dropping the pane material because each restated it by hand. The two lit edges are now a single token, `--glass-edges`, used by `.glass`, `.glass-strong`, `.connect-card.glass-strong`, `.solution-card:hover` and both `.glass.card-lift:hover` rules. The token refactor is a **rendering no-op** — the resolved `box-shadow` on `.glass` and `.glass-strong` is identical to the pre-change build in both themes — so the only behavioural change is on the three surfaces that were losing layers. |


Each row is a defect that is fixed, verified, and must not be re-opened without
new evidence.

| Item | Cause / resolution |
|---|---|
| **Issue #1 — AASTMT emblem still inlined in production** (closed 2026-08-21) | The repositioning deleted the *components* (`AastmtEmblem`, `AastmtBadge`, `aastmtLogo`, `.credential-badge`) but left `src/assets/brand/aastmt.png` on disk, where `brand.ts` swept it up with an **eager wildcard glob**. `eager: true` imports every match whether or not anything consumes it, so `vite-plugin-singlefile` kept base64-inlining the emblem: **26,290 B of data URI**, 2.85% of the artifact, reachable in the glob map, rendered by nothing, and shipped to `yaslogist.me`. Nothing caught it because "0 occurrences" was documentation, not a check. Fixed three ways: asset deleted; glob narrowed to the two consumed basenames (§3.7); `check:bundle` added (§7.2). Bundle **922110 → 895790 B (−26,320)**, accounted as 26,292 B quoted data URI + 24 B glob-map entry + 3 B assignment = 26,319, the last byte from minifier identifier reallocation as module count fell 63 → 62. Both surviving assets verified byte-identical. Live site re-fetched and confirmed: **0 occurrences**, SHA-256 matching the local build. |
| **Bug A — hero cards sliced flat against the hero's clip edge** (2026-08-21) | Reported as "a ticker-like card overlapping the Stats card's top edge, a jagged horizontal line where the two cards meet". Neither the reveal nor a card collision: `Parallax` in the Hero runs **unanchored**, so it displaces by `f.y × 0.22` — absolute scroll, unbounded — while the hero's content column leaves only `pb-36` (**144px**) of slack above the section's `overflow:hidden` edge. Past scroll ≈654 the content rides through that edge and is **sliced flat**: no border, no radius, straight through whatever card is there, with the Stats card's own clean top edge a constant **24px** below it — two horizontal edges 24px apart, which is exactly what was screenshotted. Measured on mobile 390×664: slice grows linearly at 22px per 100px of scroll, reaching **186px at y=1500**; the cut sweeps up through the vessel card's 2×2 HEADING/DRAFT/CARGO/ETA tile row, which is the "ticker" in the report. **Present on desktop too**, on a different card — the first desktop scan inspected only `.glass-strong` and wrongly read clean; re-measured at 1280×800 the **FounderBadge is sliced by 54px at y=900** (predicted 54, measured 54 on a pre-fix build). Fixed in `Parallax` for both modes by clamping the shift to the element's slack inside its nearest `overflowY != visible` ancestor, less a 52px `CLIP_MARGIN` (§3.2). Shift now caps at **92px**; worst card position **−52px** (inside the edge) in all four EN/AR × dark/light combinations at 390×664 and at 1280×800. Pillars/FIX A re-verified unaffected: max escape **−73px**, closest pair separation **169.7px**. **+471 B JS**, shared with Bug B. |
| **Bug B — mobile menu: row 01 unreachable, row 02 clipped by the header** (2026-08-21) | Nine rows at `text-3xl`/`py-4` measure **685px against a 664px** phone viewport. `justify-content: center` splits an overflow across **both** ends, and the start-edge half cannot be scrolled to — a flex container will not scroll above its own content origin. Measured: row 01 at top **−10.5px**, entirely behind the header (which is `z-9999` against the menu's `z-9998`), row 02 clipped **16.5px**, row 09 cut **10.5px** below. The header collision is **not** merely a consequence of the overflow — at 375×812, where the rows fit, row 01 still landed at 63.5 against a header bottom of 103, i.e. 39.5px obscured, because the menu is `inset-0` with no reserved header space. Both halves fixed: `.nav-menu` declares `justify-content: safe center` (with plain `center` first as the fallback for engines that reject the keyword), `overflow-y: auto`, `overscroll-behavior: contain`, and `padding-top: var(--nav-clear)` = **7rem**, sized to the tallest the header ever gets below `lg` (103px, unscrolled); rows step to `py-2`/`text-2xl` below `sm`, bringing the stack to **505px**. Verified in all four combinations: 9 rows, numbering `01`→`09`, first row top **119.5** against a header bottom of **87**, last row bottom **624.5** in a 664 viewport, **0 offenders**, no scrolling needed. Worst case re-checked on a fresh load with the header at its full 103px: row 01 clears by **16.5px**. Short-viewport fallback checked at 390×420: content 649px, `safe center` correctly degrades to flex-start, row 01 at **112px** (clears by 9px, not above the viewport) and the last row is reachable by scrolling. **+238 B CSS** total with Bug C. |
| **Bug C — light theme washed the animated background out** (2026-08-21) | **Not the §3.5 hardcoded-token defect class**, which is what it looked like: `--veil-1/2/rad` were already tokenised with real `[data-theme="light"]` values. The light *values* were simply miscalibrated. Measured from the live canvas (day frame mean luminance **122.1**, sd **35.7**): `brightness(1.22)` then a white veil at **α 0.62** and a pale-blue radial at **α 0.30** composited to mean **215.5**, sd **11.6** — a Weber contrast of **5.4%** against the dark theme's **25.4%** for the same stack. The footage was still drawing and still animating; it had been compressed into the top 5% of the luminance range, where the eye cannot resolve it. A white veil over a light ground is not the mirror of a dark veil over a dark one — it raises the mean and divides the contrast simultaneously. Retuned to **0.18 / 0.38 / 0.18**, chosen by solving for the largest reduction that keeps body copy over the background at AA: the darkest patch of veiled footage (mean − 2sd) still holds **4.92:1** against `--c-text`. Result **11.4%** Weber, a 2.1× gain, verified in EN and AR light; dark theme byte-identical (veil alphas in the shipped bundle read 0.349/0.600/0.259 unchanged). Confirmed visually — the vessel hull, containers and water tone are legible where before they were a featureless wash. **Every card surface was separately checked for theme adaptation**; all adapt, and `.stat-tile` is transparent in both themes so there is nothing to adapt. `.nf`/`.bay`/`.radar-scope` keep dark instrument-screen treatments **by design** (§3.5) and were left alone. |
| **Legibility pass — text tiers re-grounded** (2026-08-21) | The readable tiers were measured against the surfaces they actually sit on: the composited light card (`--glass-a` over the retuned ground, luminance **237.9**) and the composited dark card (`--glass-sa`, luminance **21.1**). `--c-text` went `#e8f7ff → #ffffff` in dark (16.67:1 → **18.25:1**; the old value carried a cyan cast that read as dimmed beside the accent) and `#0b2a4a → #0a1119` in light (12.53:1 → **16.35:1**). `--c-muted` was **lifted but deliberately kept a step below** so the hierarchy survives: dark `#8aa3c7 → #a8bcd8` (7.08 → **9.43:1**), light `#47688e → #2c4059` (4.97 → **9.12:1** on card, and 1.95 → **5.94:1** on the open background at its mean). Two hardcoded mint literals — `.live-eyebrow-ok` `#6ee7b7` and `.live-eyebrow.is-computing` `#5eead4` — were **the §3.5 defect class again, instances four and five**: both sit on `.glass-strong`, which is near-white in the light theme, where mint measured **1.31:1**. Replaced with `--status-ok` / `--status-busy`, whose dark values are the exact literals they replace (dark renders identically, verified: `rgb(110, 231, 183)`) and whose light values measure **4.72:1** and 4.62:1. `[data-theme="light"] .cf-val-cost` was nudged `#a16207 → #945906` (4.24 → **4.90:1**) — it had a light override already but sat just under AA at its 17px weight. **The cyan accent system was not touched**, per instruction; see §6.7 for what that leaves outstanding. |
| **Glass material — the blur had never rendered** (2026-08-21) | B3 (§6.2) root-caused and fixed for the card surfaces. The source declared `backdrop-filter` **and** `-webkit-backdrop-filter` by hand; Lightning CSS treats the later hand-written vendor line as the winner and **drops the standard property**, and Chrome does not implement the prefixed spelling at all — measured directly: `CSS.supports('-webkit-backdrop-filter','blur(6px)')` is **false** on Chrome 148, and a probe element set only via the prefixed form computes `none`. So `.glass` and `.glass-strong` resolved to `backdrop-filter: none`; the signature cards had never blurred in a production build. `.btn-ghost` was the one rule that always worked, and the reason is instructive: it declares **only** the unprefixed property, so the minifier auto-prefixes and emits both. Fixed by matching that — the hand-written vendor lines were deleted from `.glass`/`.glass-strong`, and the build now emits both spellings for each. Verified on live elements: both compute `blur(6px) saturate(1.4)` in all four combinations. Refraction was deepened with an inset under-edge (`--glass-edge`, tokenised per theme) paired with the existing top rim light, giving the pane two lit edges — **inset shadows only, no extra layer**. **A prior version of §6.2 recorded that the minifier "drops the declaration entirely for `.glass-strong`" — that is wrong**: it emits the prefixed form there exactly as it does for `.glass`. The earlier reading came from a naive substring search rather than a rule-level scan. |
| **Bug D — light-theme instrument wells washed out and leaking the background** (2026-08-21) | Reported from a real device: the Global Fleet Telemetry and Neural Route Forecast panels looked transparent and noisy in light mode against a clean, opaque dark mode. Measured cause: `.nf`, `.bay` and `.radar-scope` declare a fill that is only **55–75% opaque**, so the result is decided by the backdrop — and the two themes' backdrops differ by 11× in luminance. The identical declaration composites to **19.0 → 11.3** over the dark card and **116.6 → 65.6** over the light one (`.bay` 18.8 → 10.7 vs 105.6 → 54.1), a six-fold brighter panel that also transmits **45% of the backdrop at its top edge** — which is how the hull and sea came through. **Part 2 made it worse**, honestly: halving the light veil roughly doubled the footage contrast arriving behind these wells. Fixed with `--well-base`, an opaque ground under the existing gradients — `transparent` in dark (renders byte-identically, re-measured 19.0 → 11.3) and `#0a1730` in light, a navy at luminance 22.05 chosen to reproduce the dark theme's own ground of 21.0. Light now composites to **19.4 → 11.6** with **0% transmission**, i.e. within 0.4 luminance of dark on every well. The wells are *not* lightened — §3.5 is explicit that they read as dark instrument screens in both themes. **Also fixed a latent defect found while measuring:** `.nf` and `.bay` each carried a three-layer recessed rim-and-falloff that **had never rendered** — `.card-inset` is later in the sheet at equal specificity (0,1,0), so its single-layer box-shadow replaced theirs, and all three wells computed only `rgba(255,255,255,0.03) 0 1px 0 inset`. The material now lives once on `.card-inset` (restated in its light override, which outranks it), the dead copies are gone, and the radar scope has the family treatment for the first time. **Zero new compositor surfaces** — background-color and inset shadows only. **+80 B CSS.** |
| **Bundle-content guard** (2026-08-21) | `scripts/check-bundle.mjs` greps `dist/index.html` for all four banned tokens and exits non-zero on any hit. Wired as the last step of `npm run gate` **and** into Vercel's `buildCommand`, so a violation fails the deploy, not just the local gate. **Verified by making it fail, not only pass** — see §7.2 for the method and the trap that invalidated the first attempt. |
| **npm adopted as canonical** (2026-08-20) | A parallel agent had introduced pnpm: `pnpm-lock.yaml` plus a malformed `pnpm-workspace.yaml` (`allowBuilds: esbuild: set this to true or false` — no `packages:` key, not a real pnpm field), and `@vercel/analytics` was installed through pnpm so it never reached `package-lock.json`, which meant **`npm ci` was broken**. Both pnpm files deleted, `npm install` re-synced the lock, `npm ci` verified green, and the hybrid `node_modules` (carrying both `.pnpm/` and `.package-lock.json`) was rebuilt clean. `bun.lock` was removed in the same pass, owner-confirmed: a stale lockfile from a past `bun install` and a third claimant for package-manager auto-detection. Deleting it does **not** affect the bun-run test harness, which executes a TS file directly and installs nothing. `package-lock.json` is now the sole lockfile. |
| **Vercel was building with pnpm** (2026-08-20) | The production build for commit `07fbc19` logged `Detected pnpm-lock.yaml … Using pnpm@10.x`, so the live site was built by a package manager the repo had not sanctioned. Fixed by pinning `installCommand: "npm ci"` in `vercel.json`. Confirmed resolved on the `b880e3f` build, which logs `Running "install" command: npm ci`. |
| **AUDIT Row 3 — Neural Route Forecast labels illegible on phones** | A scaling problem, not a sizing one. The diagram's viewBox is **460 user units** wide but the card is only ~226 px on a phone, so everything inside scales by **0.491**: labels declared at 7.5–9.5 user units render at **3.7–4.7 effective CSS px**. Raising the declared size was **not available** — the gutters hold only 11.3 (left) and 10.3 (right) units of slack, and enlarging the viewBox lowers the scale by the same factor, netting nothing. Labels are therefore **hidden below `sm`** (`.nf svg text { display: none }`). Nothing is lost: the `<svg>` is already `aria-hidden`, and the HTML band underneath states the same content at full size — the legend *"Four live signals · one committed route"* plus the **Accuracy 94.2%** figure. With labels gone the drawing occupies **86.8%** of the SVG width. **At ≥640 px the labels stay** (card is 470 px, labels reach 7.63 / 8.65 / 9.67 px). Verified in all four combinations at 390 px (0/11 shown) and 640 px (11/11). **+26 B.** |
| **AUDIT Row 1 — Bay 07 process ribbon clipped** | `.bay-flow` is `repeat(4, 1fr)`, and **`1fr` carries an implicit `auto` (min-content) minimum**, so each column was pinned to its word plus 24 px of padding rather than a quarter of the track — measured `65.2 / 65.2 / 48.4 / 70.8 px` = **261.6 px against a 228 px container** at 390 px. `overflow-hidden` cut the terminal step: `Outbound` clipped 79.6 px @320, 39.6 @360, 9.6 @390; Arabic `الصادر` 39.4 px @320. Fixed in CSS only, below `sm`: step padding `0.75rem → 0.3125rem`, tracking `0.16em → 0.06em`; below the 360 px floor the ribbon becomes `repeat(2, 1fr)` with `::after` chevrons suppressed (the chevron's `-0.3rem` inset overhangs by 4.8 px and would dangle at the row break). **Two ordering traps:** the chevron override must sit *after* the base `.bay-flow-step::after` rule (equal specificity, source order decides) **and** must also name `[dir="rtl"] .bay-flow-step::after`, which outranks it (0,2,1 vs 0,1,1) — the first attempt failed silently in Arabic only. Overflow **0** everywhere; ≥640 px untouched. |
| **AUDIT Row 2 — Stats figure clipped** | The tile grid is `grid-cols-2` below `lg` with `p-7` (28 px) and a `text-4xl` (36 px) figure. At 320 px each column is **127.5 px** while `99.98%` alone renders **132.4 px** — wider than the column *before any padding* — so it overflowed and was cut: 33.9 px past the card edge @320, 13.9 @360, 1.1 px of margin @390. Fixed below `sm` only: tile `p-7 → p-4`, figure `text-4xl → text-2xl`. Settled ink **88.3 px in a 94.5 px box** at 320 px EN (24.5 px AR), overflow 0; ≥640 px untouched. **Measurement note:** `CountUp` figures never settle under programmatic scrolling here, so early samples read `0.00%` and made the deficit look smaller — and made dark and light look different (28 vs 34 px) when the geometry is theme-invariant. Measure the *settled string's ink* with an offscreen probe at the live font. |
| **AUDIT Rows 4–7 — 320 px bleed, two distinct causes** | The four "cosmetic bleed" rows did **not** share one root cause; batching them blindly would have mis-fixed half. **Family A (Rows 5, 7)** — both Simulator output strips are `grid-cols-3`, giving 60.7 px columns at 320 px whose padding leaves 32.7 px (`.metric-tile`) / 36.7 px (`.stat-tile`) for content inking at 53.3–58.5 px. Unfixable by padding or type, so below the floor both become `grid-cols-1` — one column, not two, because three items into two orphans one. Result: 206 px columns, 13–15 px clearance. **Family B (Rows 4, 6)** — a large figure beside a `min-w-0` caption inside a flex row, so flex shrank the block below its own content and `overflow: visible` let the ink bleed: the Vessel figure inked **139 px in a 118.7 px box**, physically overlapping the `shrink-0` FLAG/IMO column by 4.1 px. Fixed by **stacking the pair** (`flex-col items-start`) below the floor rather than shrinking type — these are hero figures and the point is that they read large. Bleed **0**; caption box 12.1 → 116 px; ≥360 px reverts exactly. **+444 B**, accounted as 270 B new floor utilities + 174 B class strings. |
| **B1 — theme toggle 30.89 px at ≥1536 px, English** | **The originally recorded cause was wrong.** The row's *natural* content at ≥2xl is **1222.69 px** against the **1158 px** `max-w-7xl` leaves — a **64.69 px** deficit, not ~9 px; the old figure was the toggle's *share* of the shrink, read from post-shrink widths. Flex spread the deficit across the logo (−21.64), the status pill (−33.70, wrapping to two lines at 41 px tall) and the toggle (−9.11). Raising the clock's breakpoint is **disproven**: `max-width` is a flat 1280 px at every viewport ≥1280 px, so the budget is identical at 1536 and 2560 px (both measured: avail 1158, toggle 30.89). Narrowing `GlobalClock` cannot reach 64.69 px either — its two inter-column gaps total 32 px. Fixed by widening the header container at ≥2xl to `2xl:max-w-[85rem]` (1360 px outer → 1280 px bar, exactly the section width), applied **in English only**, since Arabic already fits with 176.16 px to spare. Result: toggle **40 × 40**, status pill on one line, logo at its natural 257.63 px, row overflow 0, 15.31 px slack. Verified in all four EN/AR × dark/light combinations; Arabic **pixel-identical** on every header rect. **Status queried by the owner 2026-08-21 — see §6.1 before assuming this is still true.** |
| **B4 — Blockchain `VERIFIED` chip clipped** | **The originally recorded cause was wrong.** `-end-2` is not the problem: at 1920 px the chip sits 21 px clear in all four combinations. The real cause is the ledger row's intrinsic width — each node wrapper is sized by its **hash caption**, not the node, giving a **268 px** minimum against the **198 px** the panel leaves at 360 px. The row overflowed by 70 px and pushed the final node and its chip outside, where `overflow-hidden` cut them (chip 45 px outside EN, 29 px AR). Fixed by tuning the existing sub-`sm` step: node `h-14 w-14 → h-10 w-10`, connector `mx-1.5 → mx-1`, hash `text-[6px] tracking-[0.04em]` with `sm:` restoring 8 px / 0.1em. Row intrinsic **268 → 206 px**; chip now 17 px inside. ≥640 px untouched. |
| **B5 — smart-contract steps row cut in English** | Measured rather than assumed, and it did **not** match B4's numbers: at 360 px the four step columns are sized by their labels (Initiate 44.8 px, rest 33.6 px; the 28 px circles never bind, and `max-w-[4.5rem]` never binds because nothing wraps), needing **193.6 px** against **164 px** — a 29.6 px deficit. Arabic already fit. Fixed with spacing and type inside existing elements, no restructure: connector `mx-2 → mx-1 sm:mx-2` (−24 px) and label `tracking-[0.16em] → tracking-[0.06em] sm:tracking-[0.16em]` (−15 px), keeping 8 px type so the caps stay legible. Row intrinsic **193.6 → 148.8 px**, 15.2 px slack. ≥640 px untouched. |
| **B6 — 320 px structural failure (ledger row + steps row + header)** | Three surfaces, not two: at 320 px the header needed 308.7 px against 262 (hamburger **17.7 px off-screen**), the ledger row 184 against 158 (chip 9 px outside), the steps row 149 against 124. Sizing was genuinely exhausted — the ledger row fits only at ≥~346 px, the steps row ≥~345 px — so this is the one item that took structure. **A hard floor is declared at 360 px** (§3.6). Below it both panel rows become `grid grid-cols-2 justify-items-center gap-y-4` with connectors `hidden` — all four blocks, hashes and steps survive; only the connector line, decoration rather than information, is dropped. The header hides the wordmark, reclaiming 92.7 px against a 46.7 px deficit — removing *decoration* rather than *function*, since the language pill, theme toggle and menu button all stay. Alternatives rejected on evidence: `overflow-x-auto` on the ledger row clips the `-top-2` chip vertically (setting one overflow axis to auto forces the other) and re-opens B4; dropping to three nodes edits content; hiding the hashes removes the evidence the panel exists to show. At 320 px: header overflow **0** with the hamburger 29 px inside, both rows overflow 0, chip 36.5 px inside. Identical at 359 px; ≥360 px untouched. |
| **B7 — 390 px header overflow, menu button unreachable** | The phone bar was over-subscribed: logo 194.5 + controls 192 + a 24 px gap needed **410.5 px** against **316 px** — 94.5 px over in English, 66.7 px in Arabic (which was **also broken**, contrary to B1's language split). The row carried the hamburger 57.5 px off-screen EN / 29.7 px off the left edge AR, **silently**, because `overflow-x-clip` on the page wrapper suppresses any scrollbar and `document.scrollWidth` still read 390. Fixed by reclaiming width below `sm` only, every step restoring its value at `sm`: outer padding `px-4 sm:px-5`, bar `px-3 gap-2 sm:gap-6 sm:px-5`, control cluster `gap-1.5 sm:gap-2.5`, logo `gap-2 sm:gap-3`, mark `h-10 w-10 sm:h-11 sm:w-11`, wordmark `text-[13px]`, decorative `CORE` badge `hidden sm:inline-block`, and a `@media (max-width:639px)` rule tightening `.lang-opt` from `min-width:2.5rem`/`padding:0 .5rem` to `2rem`/`0 .25rem` — the pill was 92 px, the widest control on the bar. **Verified functionally, not just geometrically:** the button hit-tests as its own target, clicking it flips the overlay to `pointer-events-auto opacity-100`, its links hit-test as clickable, and a screenshot shows the menu open with all 9 links. ≥640 px untouched. |
| **FIX A — p2×p3 and p4×p5 card collision** | `Parallax` displaced by unbounded absolute `scrollY`, and `PillarSection` alternates the sign, so `(+,−)` neighbours converged at `\|2·speed\|·scrollY`. At scroll 7170 that sliced 205 px off the p4 card and 201 px off p5 (sections are exactly adjacent and `overflow:hidden`). Fixed by anchoring displacement to element centre and clamping to travel; max offset fell from 370 px to ≤41 px. 0 overlaps across 9 viewport × language × theme combinations. |
| **Commercial repositioning** | All academic references removed from source, dictionary, meta description and built artifact. `AastmtEmblem`, `AastmtBadge`, `aastmtLogo` and `.credential-badge` deleted. Completed at the asset layer only on 2026-08-21 (issue #1, above). |
| **RTL SVG text** | Three stacked defects — direction-relative anchors, letter-spacing severing cursive joins, monospace fallback with no Arabic coverage — fixed via `src/lib/svgText.ts` (§3.3). |
| **Phase 2 — Neural Route Forecast** | Column captions, committed path derived from the edge set (so it cannot drift from the topology), confidence pinned to its node, hero metric band. |
| **Phase 2 — Autonomous Bay 07** | Process ribbon `INBOUND › STORAGE › PICK › OUTBOUND` (4 nodes; connectors are `::after` chevrons that flip under RTL), throughput promoted to hero. |
| **Phase 3 — Connect card** | Moved onto shared `.glass-strong`, decorative glows 3 → 1, typographic hierarchy, provenance block. Credibility line split from the promise line so they are complementary rather than duplicate. |
| **Phase 3 — Simulator** | `useAnimatedNumber` returns `[value, settling]`; `is-computing` state propagates slider → outputs → route. Tactile `:active` slider. Demo-provenance chip. **Computation logic unchanged.** |
| **Counterfactual readout** | A second evaluation of the *same* formulas at an alternate corridor weighting. Verified against hand arithmetic at 500,000 TEU × 12,000 NM: `+1d 17h`, `+17,010 t`, `−$50.4M` all match. |
| **P1/P3 — frame delivery** | Mobile 640×360 set added; deferred loading. Mobile transfer **2902 KB → 1103 KB (−62%)**, decoded bitmap **211 MB → 53 MB (−75%)**. Desktop unchanged. |
| **R1/R2/R3 — compositor cleanup** | `blur-3xl` washes → `.glow-wash` radial gradients (no element `filter`, no promotion); `will-change` removed from `.solution-card`, `.nf-node`, `.bay-*`, `.chain-pulse`, `.radar-blip`, `.radar-trail`. **`will-change` 46 → 10**, element filters **7 → 1**, estimated layer memory **77.9 MB → 36.2 MB (−54%)**. Kept on `.bg-camera`, `.radar-sweep`, `.cta-primary`, which do continuous transform work. All animations verified still running. |
| **`tsc` shadowing** | `npx tsc` resolved a different TypeScript (7.0.2) and printed help instead of compiling, **exiting 0** — a silent no-op typecheck. Permanently fixed by using `npm run typecheck` / `npm run gate`, which resolve `node_modules/.bin` first. Verified 5.9.3. |
| **Visual verification, English** | Real Chrome, motion enabled: neural card packets animate, committed path renders, Bay 07 ribbon and floor plan correct, p4/p5 cards intact at the seam. |
| **Visual verification, Arabic** | Real Chrome, `dir=rtl`: cursive joining intact, `عربي` pill in Aref Ruqaa, Cairo-first clock, founder line `YASLOGIST · الدقي، القاهرة`, numerals LTR-pinned, counterfactual strip direction-coded correctly. |

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

**Do not re-open this as a performance item.** There is no evidence a
compositing bottleneck exists.

### 5.2 Frame rate is NOT reliably measurable with this tooling
With page identity asserted, four consecutive **identical** baselines gave
**10.0, 29.3, 19.8, 12.1 fps** — a 3× spread with nothing changed between runs.
Every run reported `document.hasFocus() === false`, and fronting Chrome first
did not change it. Every measurement path requires a Bash or osascript round
trip that leaves Chrome unfocused.

**A second trap:** an ablation matrix once showed a flat 60 fps for every group
because the active tab had silently become `chrome://new-tab-page`. Any harness
must assert `location.host` **and** site markers inside every result row.

**What the page's real cost is, measured focus-independently** via Long
Animation Frame attribution across a full scroll: style and layout **510 ms**,
script **~285 ms**, together **0.8%** of long-frame time. The worst frames carry
almost nothing — a 2283 ms frame contained 34 ms of script and **0.9 ms** of
style and layout; a 1302 ms frame contained **zero** scripts. That is the browser
not scheduling, not the page being expensive. **The page's own per-frame work is
~1–2 ms.** If frame rate must be measured, it requires a real Chrome performance
trace driven by a human at the keyboard.

### 5.3 `npx tsc` is not a trustworthy gate
It resolved TypeScript 7.0.2 at least once and printed help text while exiting
0. Use `npm run gate`.

### 5.4 Two "recorded causes" in §4 were wrong before being corrected
B1 and B4 both carry a note that the originally filed cause was mistaken. The
lesson generalises: **a cause recorded without a measurement is a hypothesis.**
Re-measure before building on one.

---

## 6 · OPEN BACKLOG

### 6.1 B1 — status disputed, needs one measurement
§4 records B1 as **closed**, with the `2xl:max-w-[85rem]` fix verified in all
four EN/AR × dark/light combinations and Arabic pixel-identical on every header
rect. The owner listed B1 as **open** on 2026-08-21.

**No measurement was taken this session to settle it**, and this document will
not move a closed item on an unverified basis. If the defect is visible again,
the repro is: load the built artifact at **≥1536 px in English**, and measure the
theme toggle's rendered box. Closed means **40 × 40** with the status pill on one
line and row overflow 0. Anything else re-opens B1 with the header container
(`2xl:max-w-[85rem]`) as the first suspect — and note from §4 that raising the
clock's breakpoint is already **disproven** as a fix, so do not retry it.

### 6.2 B3 — remaining unblurred surfaces (`.nf`, `.bay`, `.brand-mark`, `.lang-pill`)
**Mostly closed 2026-08-21** — see the glass-material row in §4 for the root
cause and the fix. `.glass` and `.glass-strong` now genuinely blur. Two
corrections to what this entry used to say: the minifier does **not** drop the
declaration entirely for `.glass-strong` (it emits the prefixed form there just
like `.glass`), and the trigger is not the prefix being "inert" on its own but
**declaring both properties by hand** — Lightning CSS then keeps only the
vendor line, which Chrome cannot parse.

**Note after Bug D:** in the light theme the wells now sit on an opaque base,
so `.nf` and `.bay` have nothing left to blur there even if the property were
fixed. Any value in restoring it would be dark-theme only.

**CLOSED 2026-08-22 — see §4, F4.** All four are resolved, in two directions:
`.brand-mark` and `.lang-pill` now genuinely blur (the hand-written `-webkit-`
line was deleted and the minifier emits both spellings), because they are the
only surfaces between the reader and the footage while the page sits at the
head of the document. `.nf` and `.bay` had **both** declarations deleted
instead — the entry below is the reasoning, and it holds; removing the dead
code was preferred to repairing an effect nobody wanted, so no compositor
surface was added. What follows is the original entry, kept because its
reasoning is still the reason those two wells stay flat.

**Was open, deliberately:** `.nf`, `.bay`, `.brand-mark` and `.lang-pill` were
prefixed-only and therefore flat. They were left out of scope by an
explicit call — the two instrument wells are opaque dark screens by design
(§3.5) and gain almost nothing from a blur they would pay a compositor surface
for. The one-line fix, if it is ever wanted, is to **delete the hand-written
`-webkit-backdrop-filter` line** and let the minifier prefix it.

### 6.3 B8 — radar bearing labels below the site's own type floor
**Raised by the owner 2026-08-21. It had no prior entry in any version of this
document or in git history**, so the arithmetic below was measured fresh this
session and is the only evidence that exists.

`src/components/FleetRadar.tsx:59` renders the scope as
`<svg viewBox="0 0 100 100" class="… h-[15rem] w-[15rem] …">`. There is no
rem-base override in `src/index.css` (`html` sets only scroll properties), so
15rem is **240 px** and the internal scale is **240 / 100 = 2.4**. The four
bearing labels `000 / 090 / 180 / 270` at `FleetRadar.tsx:117–122` are declared
`fontSize="3"` user units, so they render at **3 × 2.4 = 7.2 effective CSS px** —
**0.8 px below the 8 px micro-type floor** the site uses everywhere else
(`text-[8px]` in Hero, BlockchainSection and Simulator).

**How this differs from Row 3, which is closed.** Row 3's labels fell to
3.7–4.7 px *because the card shrank on phones*. The radar SVG is a **fixed**
`15rem` at every viewport, with no responsive variant on that element, so 7.2 px
is what it renders at on desktop and on a phone alike. It is marginal, not
severe, and it does not degrade.

**Not yet decided, and deliberately not acted on:** whether 7.2 px is judged
illegible at all. **No visual verification was performed.** Note before fixing
that the `<svg>` is `aria-hidden`, so assistive technology never reads these —
the same fact that made hiding Row 3's labels lossless. Raising `fontSize` to
`3.34` would reach exactly 8 px; whether the surrounding geometry has the slack
for that is **unmeasured**.

### 6.4 B2 — a dangling reference with no entry
`src/components/ui.tsx` behaviour in §3.2 is annotated "(see §6, B2)", but **no
B2 entry exists** in this document, in any prior committed version, or anywhere
in git history (`git log --all -S'B2 ' -- HANDOFF.md` returns nothing). Either
the rationale for the Hero's unanchored `Parallax` was never written down, or it
was lost in the 2026-08-15 distillation. **Low priority**, but if you work on
Hero parallax, know that the reason it is exempt from the anchoring rule is
undocumented rather than obvious.

**Partly overtaken by Bug A (§4, 2026-08-21).** The exemption's *risk* is now
gone — the default mode is bounded by its clip box regardless of why the Hero
opted out — so the missing rationale is no longer load-bearing. What the
exemption still buys, and the likeliest reason it was chosen, is that the
unanchored mode is the only one that renders **zero displacement at scroll 0**,
so the Hero's first paint is its designed composition. That is inference from
the code, **not a recovered rationale**; it is recorded as such.

### 6.7 Cyan accent text below AA on light cards — flagged, not changed
`--c-neon` in the light theme is `#0284c7`, which measures **3.53:1** on a light
card and **2.30:1** over the open background. Every `text-neon` run at normal
size therefore sits under the 4.5:1 threshold: measured instances include the
ticker lane names (`Singapore`, `Rotterdam`, … 22 of them at 10px), the
telemetry eyebrows at 11px, `KN`, `SIN → LAX → ROT`, the `CORE` badge, and the
section tags. The large simulator figures pass, because at 36px the threshold
drops to 3.0.

**Not changed, by instruction** — the cyan accent system is the site's colour
identity and was explicitly out of scope for the legibility pass. It is recorded
here because it is real and measured, and because there are two ways to resolve
it that do *not* touch the palette:

1. Move the runs that are **content rather than colour-coding** off `text-neon`
   onto the readable tier — the lane names are the clearest case.
2. Keep the accent only where the colour *means* something (state, origin vs
   destination, section tag) and accept the ratio there as decorative.

Either is a design call, not a defect fix. **Do not "fix" this by darkening
`--c-neon`** without an explicit decision to change the brand colour.

### 6.5 npm audit — 3 advisories, none reaching production
`npm audit` reports **3 vulnerabilities (1 low, 2 high)**. Measured 2026-08-21:

| Package | Severity | Advisory | Reaches production? |
|---|---|---|---|
| `esbuild` 0.27.7 | low | arbitrary file read when running the **dev server on Windows** | No |
| `nanoid` 3.3.17 | high | custom generators can loop indefinitely when size is zero | No |
| `vite` 7.3.2 | high | `launch-editor` NTLMv2 hash disclosure via UNC path on **Windows**; `server.fs.deny` bypass on **Windows** alternate paths | No |

**`npm audit --omit=dev` reports `found 0 vulnerabilities`.** All three sit in
the devDependency tree only — `vite → esbuild` and `vite → postcss → nanoid`.
The project ships a static single-file artifact with no server, and the
production dependency tree contains only React, React-DOM, clsx, tailwind-merge
and the two Vercel packages. Two of the three advisories are additionally
**Windows-only**, and this machine is darwin.

**Why it is still open rather than dismissed:** the `vite` fix requires
**7.3.6**, which `npm audit fix --force` warns is *outside the stated dependency
range* — the project pins 7.3.2 exactly. Taking it means a deliberate version
bump plus a full gate run to confirm the 895,790-byte artifact and 41/41
assertions survive, not an `audit fix`. **Do not run `npm audit fix --force`
casually**; it will move a pinned build dependency that every measured number in
§2 depends on.

### 6.6 Verified only by arithmetic, never on hardware
The mobile frame work (§4, P1/P3) is a byte and arithmetic fact — transfer
−62%, decoded bitmap −75% — and is environment-independent. **Whether the site
feels fast on an actual handset has never been checked.** This needs a human
with a phone and remains the single highest-value unknown.

---

## 7 · INFRASTRUCTURE STATE

### 7.1 Toolchain — npm is canonical
**npm is the package manager of record**, owner-confirmed 2026-08-20.
`package-lock.json` is the **sole** lockfile; `npm ci` is the install of record
and passes. There is no `pnpm-lock.yaml` and no `bun.lock`, and none should be
reintroduced — see §4.

**bun is still required**, but not as a package manager: it is the *runtime* for
`npm run test` (`bun tests/scroll-harness.ts`), which is a step of
`npm run gate`. The harness executes a TypeScript file directly and installs
nothing.

**Local versions measured 2026-08-21 — and they have drifted:**

| Tool | Recorded 2026-08-20 | Measured 2026-08-21 |
|---|---|---|
| node | v26.7.0 | **v20.20.2** (`/usr/local/opt/node@20/bin/node`) |
| npm | 11.19.0 | **10.8.2** |
| bun | 1.3.14 | 1.3.14 |
| tsc | 5.9.3 | 5.9.3 |

The `/usr/local/bin/node` symlink into the Homebrew `node@20` keg is dated
**2026-08-21 03:31**, so node was changed on this machine shortly before the
session that wrote this. **Nothing pins it** — there is no `.nvmrc`, no
`.node-version`, and no `engines` field in `package.json`. The full gate passes
on node 20.20.2, so this is recorded rather than treated as a problem, but a
future session seeing different numbers should suspect the host rather than the
repo. Vercel builds on its own image and is unaffected.

### 7.2 The bundle-content guard
`scripts/check-bundle.mjs` reads `dist/index.html` and greps for `AASTMT`,
`Arab Academy`, `CITL` and `211010469`, case-insensitively, exiting 1 with the
offending token and its count on any hit. It runs in **two** places:

- **`npm run gate`** — `typecheck && test && build && check:bundle`, last, since
  it is the only step that inspects `dist/`.
- **`vercel.json` → `buildCommand`** — `npm run build && npm run check:bundle`,
  so a violation **fails the deployment** rather than shipping.

**Why the deploy path is not `npm run gate`, and must not become it.** `gate`
includes `test`, which is `bun tests/scroll-harness.ts`, and **bun is not on the
Vercel build image**. Both halves of the current chain are node-only:
`npm ci` → `vite build` → `node scripts/check-bundle.mjs`. Promoting
`buildCommand` to `gate` would break every deploy.

**The guard was verified by making it fail, and the first attempt was
worthless.** Injecting `const _tmpProbe = "AASTMT"` into a source file left the
gate **green** — dead code is tree-shaken before it reaches the bundle, so that
test proved nothing. A probe that actually ships (`alt="YASLOGIST AASTMT"` on
the brand image) turned the full gate **red** with `AASTMT — 1 occurrence`, and
running `vercel.json`'s exact `buildCommand` string produced exit 1 the same
way. **If you ever change this guard, re-verify with a probe that survives
minification.**

### 7.3 Vercel
`vercel.json` pins `installCommand: "npm ci"` and
`buildCommand: "npm run build && npm run check:bundle"`. Project `framework` is
**null** (Other preset), so build and output settings otherwise come from
dashboard configuration not visible in the repo. **`outputDirectory` is
deliberately left unset** so the working detection is not disturbed.

- Project `prj_jAONLzFYAxJvdHF2Yu4GSXNSUdb2`, team
  `team_40txApd9c7pODaJ664QGtRnt`, from `.vercel/project.json`.
- The Vercel **CLI is not installed** on this machine (`which vercel` → not
  found). Use the Vercel MCP tools, or install the CLI if you need
  `vercel logs`.
- Deployment-specific `*.vercel.app` URLs return a **deployment-protection
  page**, not the site. Verify against `yaslogist.me`, not the preview host —
  a protected URL returning ~481 KB of Vercel HTML is not your build.

**`dist/` is not self-contained.** `dist/frames/` is 240 files across four
directories (§2). A pipeline that uploads only `index.html` ships a site with no
background. Verified live 2026-08-21: all four sets serve `image/jpeg` at HTTP
200, including the last frame of the sequence.

### 7.4 Git and production parity — measured 2026-08-21

| Fact | Value |
|---|---|
| Branch | `main` |
| `HEAD` | `3504b74` plus this document's own commit on top of it — `git rev-parse HEAD` for the exact value, which a doc commit cannot contain |
| `origin/main` | same as `HEAD` |
| Ahead / behind | **0 / 0** |
| Working tree | **clean** |
| Remote | `https://github.com/YasauraTeam/YASLOGIST.git` |
| Latest production deployment | `dpl_9yz2r2seLGMaqS2EbmaMYUtX8MAZ`, commit `b880e3f`, state **READY** |
| Live artifact SHA-256 | `1365502a6ee110f2504aed7cba40ef8177dfa8fc492a6f269217d6c7a9ea1725` |
| Local `dist/index.html` SHA-256 | `1365502a6ee110f2504aed7cba40ef8177dfa8fc492a6f269217d6c7a9ea1725` |

**Re-established 2026-08-22 after the F3–F6 work (§4) shipped.** `ebb8c5c`
(the fix) and `9a6512a` (this document) are pushed, `main` equals `origin/main`,
the tree is clean, and `yaslogist.me` returns **897279 bytes** hashing to
`0514d01ec7b86a0630204a12dce45c9691600bdd5e64617d17ffab1ef486b365` — identical
to the local artifact. Verified in the served HTML rather than inferred from
deployment status: `.site-footer` is present, `--footer-ground` is `none` in
dark and the ramp in light, `.nf` and `.bay` carry no `backdrop-filter` while
`.brand-mark` and `.lang-pill` carry the unprefixed form, both
`.glass.card-lift:hover` rules exist, `.connect-card.glass-strong` opens with
`var(--glass-edges)`, and `.card-lift:hover` is unchanged. All four frame sets
re-checked live at HTTP 200 `image/jpeg`, first and last frame of each.

**`main`, `origin/main` and production are the same code**, confirmed by hashing
the live response rather than by trusting deployment status. Production
deployment `dpl_Bc6NLQjfRC7Ghw9WgtBh5AgGh3oP` (commit `3504b74`) is **READY**,
and `yaslogist.me` returned **896872 bytes** with SHA-256
`19d1eb0f84f2b084d2a6b845a8ea5df215cc3a5d31ff9edc5c6ae570080bde7b`, matching the
local artifact exactly. All four frame sets re-verified live at HTTP 200
`image/jpeg`, first and last frame of each.

**The apex redirects.** `https://yaslogist.me/` answers **308** to
`https://www.yaslogist.me/`, so any live check must follow redirects — a bare
`curl` without `-L` returns a 15-byte redirect stub, not the site. Recent history:

```
(this doc commit)  docs: record the committed git state in HANDOFF
f74d3e8  fix: bound hero parallax, repair mobile menu, rebalance the light theme
e343c4a  docs: rewrite HANDOFF as a standalone zero-context document
b880e3f  ci: enforce the banned-token guard on the Vercel deploy path
426d704  fix: stop inlining the AASTMT emblem into the production bundle
a76de40  fix: hide sub-5px Neural Route Forecast labels on phones
1918cee  docs: repoint the HANDOFF verify command at a path that actually works
```

GitHub issue **#1 is closed** (completed) — the AASTMT emblem leak, auto-closed
by the `Closes #1` trailer on `426d704`. There are no other open issues.

### 7.5 HawkScan
A session hook fires after every commit asking for a HawkScan DAST scan.
**No scan has been run**, and none was run for `f74d3e8` either: the
environment still reports `hawk runtime=false, HAWK_API_KEY=false` and the app
is not running. Do not
report scan results that were never produced.

---

## 8 · NEXT STEPS — ranked by measured impact

1. **Settle B1** (§6.1). One measurement at ≥1536 px in English decides whether
   a closed item is actually closed. Cheapest open question here.
2. **Get one real Chrome performance trace, human-driven.** Everything in §5
   says this tooling cannot measure frame rate. A DevTools trace during scroll,
   on both desktop and a throttled mobile profile, would settle whether any
   runtime problem remains. Until then treat "the site feels slow" as
   **unexplained**, not as diagnosed.
3. **Confirm the mobile frame work on a real phone** (§6.6). Needs a human with
   a handset.
4. **Nothing here — this slot is clear.** It held B3 (restore backdrop blur or
   accept its absence), which is closed in §6.2 and §4, F4. The F3–F6 work that
   briefly occupied it is committed (`ebb8c5c`, `9a6512a`), deployed, and
   confirmed live by hash (§7.4).
5. **Decide B8** (§6.3) — 7.2 px bearing labels against an 8 px floor. Needs a
   judgement call before any code.
6. **Plan the `vite` bump** (§6.5) if the advisories matter to you. Deliberate
   version change plus a full gate run, never `npm audit fix --force`.
7. **Counterfactual coefficients.** `ALT_TIME_GAIN 0.13`, `ALT_CO2_CUT 0.09`,
   `ALT_COST_GAIN 0.04` in `src/components/Simulator.tsx` are **invented**,
   unlike the IMO-DCS-derived constants above them. They are labelled as a
   modelled scenario in the UI and in a source comment. If real corridor data
   arrives, replace all three and delete the comment. **Never re-tune the
   committed constants to flatter the comparison.**

---

## 9 · DEFERRED — not started, not urgent

| Item | Status |
|---|---|
| **Tech Stack strip** | Not started. No design or copy exists yet. |
| **Blockchain disclaimer text** | Not started. The Blockchain card carries no equivalent of the Simulator's `sim.demoNote` provenance line. |
| **Video demo** | Not started. Requires an external tool; nothing in this repo depends on it. |

*(Named by the project owner as known-pending. No further detail was supplied
and none is invented here.)*

---

## 10 · WORKING RULES THAT HAVE PAID FOR THEMSELVES

- **A documented guarantee is not a guarantee.** "0 academic references" sat in
  this file as a verified fact while the emblem shipped for weeks. If a rule
  must hold, put it in the gate — §7.2 is the pattern.
- **Verify a guard by making it fail.** A check that has only ever passed is
  untested. And pick a probe that survives minification: dead code is
  tree-shaken and will fake a pass (§7.2).
- **Watch for silent fallbacks.** `brand.ts` degrades to an SVG mark instead of
  erroring, so a broken glob is invisible to the whole gate (§3.7). When a
  change touches something with a fallback, verify the *positive* case.
- **Assert page identity inside every browser measurement.** Two separate false
  conclusions came from measuring the wrong page or an unfocused window (§5).
- **Reload after every viewport resize, before measuring.** Sections carry
  `content-visibility: auto` and `contain: content`, so a resized window keeps
  the *previous* width's layout until the section re-renders. This produced a
  fake "B4 regressed" reading that vanished on reload.
- **Verify variant and sizing behaviour on the production build, not the dev
  server.** Tailwind's dev sheet appends newly-seen utilities in discovery
  order, so a base utility added mid-session can land *after* its own `sm:`
  variant and win the cascade at every width. Production sorts canonically.
- **Check the language before calling a computed value a regression.** Arabic
  deliberately neutralises `letter-spacing` to protect cursive joining, so a
  label computing `1.28px` in English computes `0.08px` in Arabic with the
  identical class. Correct, not a bug.
- **Test the hypothesis, don't assert it.** "The minifier's missing space breaks
  `backdrop-filter`" was wrong; a two-line probe disproved it and found the real
  cause (§6.2).
- **Verify in all four combinations** (EN/AR × dark/light). Three light-theme
  contrast defects and two RTL defects were caught only this way.
- **Account for every byte of bundle delta.** It has repeatedly surfaced changes
  nobody intended, and it is how the −26,320 B of issue #1 was confirmed to be
  exactly the emblem and nothing else. It earned its keep again on 2026-08-21:
  a CSS delta 243 B larger than the source change could explain turned out to be
  **a code comment leaking a utility into the stylesheet** (below).
- **Tailwind scans your comments.** `@source not "../*.md"` keeps Markdown out,
  but `.ts`/`.tsx`/`.css` are still scanned in full, comments included, and a
  bare word matching a utility name compiles that utility into production CSS.
  Writing "drop shadow" in a `Parallax` comment emitted a dead `.shadow` rule —
  **243 B** nothing referenced. Hyphenated forms (`box-shadow`) do not trigger
  it; the bare noun does, and so does the class written out with its leading
  dot. Diff the built CSS when a delta does not match the source change.
  A `.blur` rule from the same cause is **already in the bundle and predates
  this session** — it was present in the pre-change baseline, so it is not part
  of any recent delta. Small, and left alone rather than swept up in unrelated
  work, but it is the same leak.
- **A recorded cause without a measurement is a hypothesis** (§5.4).
- **Docs are part of done.** This file is the only durable memory across
  sessions. Rewrite it; never append.
