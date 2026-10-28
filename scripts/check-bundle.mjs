/* ── Bundle guard ─────────────────────────────────────────────────────
   Fails the gate when the built artifact drifts from the contract this
   project ships. Every check below was added because a real defect slipped
   through an earlier version of this file; do not delete a check without
   replacing it with one that covers the same ground.

   Runs in two places:
     · `npm run gate`  — locally, last, since it is the only step that
       inspects dist/.
     · `vercel.json` → `buildCommand` (npm run gate) — so a violation fails
       the deployment rather than shipping.

   ── History ──────────────────────────────────────────────────────────
   The platform is presented as a commercial product; the repositioning
   removed every academic component from source. It did not remove the
   AASTMT emblem from `src/assets/brand/`, where an eager wildcard glob
   kept re-inlining it as a data URI long after the code was gone (issue #1).
   "0 occurrences" was documented but nothing checked it, so the artifact
   drifted silently. This file asserts it instead.

   The single-file invariant was added when the build began inlining the
   whole app into index.html: a plugin change that emitted a second JS or
   CSS asset would otherwise ship unnoticed, and the HTML would reference
   a file the deployment does not carry.

   The self-hosted type stack, the off-origin and the unsafe-eval checks
   were added together: the type stack moved off Google Fonts and a
   Content-Security-Policy was introduced at the same time, and the policy
   is only meaningful if those two facts stay true.
────────────────────────────────────────────────────────────────────── */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const BUNDLE = "dist/index.html";
const BANNED = ["AASTMT", "Arab Academy", "CITL", "211010469"];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let html;
try {
  html = readFileSync(BUNDLE, "utf8");
} catch {
  console.error(`✗ ${BUNDLE} not found — run the build before this check.`);
  process.exit(1);
}

let failed = false;
const fail = (line) => {
  console.error(`✗ ${line}`);
  failed = true;
};

/* ── 1. Academic references ─────────────────────────────────────────── */
const hits = BANNED.map((token) => [
  token,
  (html.match(new RegExp(escape(token), "gi")) ?? []).length,
]).filter(([, count]) => count > 0);

if (hits.length > 0) {
  console.error(`✗ ${BUNDLE}: academic references must not ship`);
  for (const [token, count] of hits) {
    console.error(`    ${token} — ${count} occurrence${count === 1 ? "" : "s"}`);
  }
  console.error("  See HANDOFF.md §1. Do not reintroduce these.");
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 academic references (${BANNED.length} tokens checked)`);
}

/* ── 2. Self-hosted type stack ──────────────────────────────────────── */
/* The interface fonts moved off fonts.googleapis.com. A regression here is
   invisible in a code review — the page still renders — so the artifact is
   pinned to it. */
const FONT_ORIGINS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const fontHits = FONT_ORIGINS.filter((origin) =>
  new RegExp(escape(origin), "i").test(html),
);
if (fontHits.length > 0) {
  console.error(`✗ ${BUNDLE}: the type stack must be self-hosted, not fetched`);
  for (const origin of fontHits) console.error(`    external origin: ${origin}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 external font origins (type stack self-hosted)`);
}

/* ── 3. Nothing loads from another origin ───────────────────────────── */
/* This is the fact the Content-Security-Policy in vercel.json is written
   against. Resource-loading attributes and CSS url() are the only places a
   document can pull bytes from another origin; navigation links (rel=canonical,
   plain <a href>) are deliberately not covered. */
const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
const SITE_ORIGIN = canonical ? new URL(canonical).origin : null;

const RESOURCE_TAGS = /^(script|link|img|source|video|audio|iframe|embed|object|track|input)$/;
const RESOURCE_ATTRS = /\b(src|href|data|poster|srcset|formaction)\s*=\s*["']([^"']+)["']/g;
/* A <link> is a resource only for these relations; canonical, alternate,
   preconnect and the like are metadata and never fetch a body. */
const LINK_RESOURCE_REL =
  /^(stylesheet|icon|shortcut icon|preload|modulepreload|manifest|apple-touch-icon|mask-icon|search|dns-prefetch|prefetch)$/i;

const isAbsoluteHttp = (url) => /^(https?:)?\/\//i.test(url);
const originOf = (url) => {
  try {
    return new URL(url.startsWith("//") ? `https:${url}` : url).origin;
  } catch {
    return null;
  }
};

const offenders = [];
for (const tagMatch of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*>/gi)) {
  const tag = tagMatch[1].toLowerCase();
  if (!RESOURCE_TAGS.test(tag)) continue;
  const tagText = tagMatch[0];
  if (tag === "link") {
    const rel = tagText.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
    if (!LINK_RESOURCE_REL.test(rel)) continue;
  }
  for (const attrMatch of tagText.matchAll(RESOURCE_ATTRS)) {
    const url = attrMatch[2].trim();
    /* Only absolute http(s) URLs can leave the origin. Relative paths,
       fragments, data: and blob: URIs are local by definition. */
    if (!isAbsoluteHttp(url)) continue;
    const origin = originOf(url);
    if (!origin) continue;
    if (SITE_ORIGIN && origin === SITE_ORIGIN) continue;
    offenders.push(`${tag} ${attrMatch[1]}="${url}"`);
  }
}

for (const cssUrl of html.matchAll(/url\(\s*["']?([^)"']+)["']?\s*\)/gi)) {
  const url = cssUrl[1].trim();
  if (!isAbsoluteHttp(url)) continue; /* fragments and relatives are local */
  const origin = originOf(url);
  if (!origin || (SITE_ORIGIN && origin === SITE_ORIGIN)) continue;
  offenders.push(`inline CSS url(${url})`);
}

if (offenders.length > 0) {
  console.error(`✗ ${BUNDLE}: resources must not load from another origin`);
  for (const offender of offenders) console.error(`    off-origin resource: ${offender}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 off-origin resources (site origin ${SITE_ORIGIN ?? "undetected"})`);
}

/* ── 4. No unsafe-eval ──────────────────────────────────────────────── */
/* The policy deliberately omits 'unsafe-eval'; a single eval() reaching the
   artifact would make that omission load-bearing rather than meaningful. */
const EVAL_PATTERNS = [
  [/\beval\s*\(/, "eval("],
  [/\bnew\s+Function\s*\(/, "new Function("],
  [/\bFunction\s*\(/, "Function("],
  [/setTimeout\s*\(\s*["'`]/, "setTimeout(<string>)"],
  [/setInterval\s*\(\s*["'`]/, "setInterval(<string>)"],
];
const evalHits = EVAL_PATTERNS.filter(([re]) => re.test(html)).map(([, label]) => label);
if (evalHits.length > 0) {
  console.error(`✗ ${BUNDLE}: the artifact must not use eval`);
  for (const label of evalHits) console.error(`    ${label}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 unsafe-eval call sites`);
}

/* ── 5. No inline event handlers ─────────────────────────────────────── */
/* Inline handler attributes are the classic DOM-XSS sink. The app sets
   handlers through React props; a hand-written onerror= in markup would be
   the first thing an injected script looks for. */
const handlerHits = [...html.matchAll(/\son[a-z]{2,}\s*=\s*["']/gi)].map((m) => m[0]);
if (handlerHits.length > 0) {
  console.error(`✗ ${BUNDLE}: no inline event handlers allowed`);
  for (const hit of handlerHits.slice(0, 10)) console.error(`    ${hit}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 inline event handler attributes`);
}

/* ── 6. Single-file app shell ────────────────────────────────────────── */
/* Two halves of one invariant:
   · nothing may be *emitted* as a separate build asset — the plugin inlines
     everything, so a file under dist/assets/ means the inlining regressed;
   · every JS/CSS reference in the HTML must resolve to a file the deployment
     actually carries. A reference to a missing file would 404 on deploy.

   The self-hosted stylesheet under /fonts is the one intentional exception:
   it is a static asset copied from public/, not build output. */
const emitted = [];
const assetsDir = join(DIST, "assets");
if (existsSync(assetsDir)) {
  for (const entry of readdirSync(assetsDir, { withFileTypes: true })) {
    if (entry.isFile() && /\.(?:[mc]?js|css)$/.test(entry.name)) {
      emitted.push(`assets/${entry.name}`);
    }
  }
}
if (emitted.length > 0) {
  console.error(`✗ ${BUNDLE}: generated JS/CSS must be inlined, not emitted`);
  for (const file of emitted) console.error(`    emitted file: ${file}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 emitted build assets (app shell inlined)`);
}

const refs = [];
for (const tagMatch of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
  const tagText = tagMatch[0];
  const attr = /^<script/i.test(tagText)
    ? /\bsrc\s*=\s*["']([^"']+)["']/i
    : /\bhref\s*=\s*["']([^"']+)["']/i;
  const url = tagText.match(attr)?.[1];
  if (!url || !/\.(?:[mc]?js|css)([?#][^"']*)?$/i.test(url)) continue;
  refs.push({ kind: /^<script/i.test(tagText) ? "script" : "stylesheet", url });
}

const brokenRefs = [];
for (const ref of refs) {
  const clean = ref.url.replace(/^[./]+/, "").split(/[?#]/)[0];
  if (!clean) continue;
  const rel = clean.startsWith("/") ? clean.replace(/^\/+/, "") : clean;
  if (!existsSync(join(DIST, rel))) {
    brokenRefs.push(`${ref.kind} → ${ref.url} (no file at dist/${rel})`);
  } else if (emitted.some((file) => file.endsWith(`/${rel}`) || file === rel)) {
    brokenRefs.push(`${ref.kind} → ${ref.url} (references inlined build output)`);
  }
}
if (brokenRefs.length > 0) {
  console.error(`✗ ${BUNDLE}: JS/CSS references must resolve to shipped files`);
  for (const ref of brokenRefs) console.error(`    ${ref}`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: ${refs.length} external JS/CSS reference(s) resolve to shipped files`);
}

/* ── 7. Artifact size band ───────────────────────────────────────────── */
/* Loose sanity bound, not a performance test. It catches a build that
   silently inlines a large asset into the single-file shell, which the
   invariant above would not notice because the asset would be HTML-encoded
   rather than emitted as a file. */
const BYTES = Buffer.byteLength(html, "utf8");
const SIZE_MIN = 100_000;
const SIZE_MAX = 3_000_000;
if (BYTES < SIZE_MIN || BYTES > SIZE_MAX) {
  console.error(`✗ ${BUNDLE}: ${BYTES} bytes is outside the expected ${SIZE_MIN}–${SIZE_MAX} band`);
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: ${BYTES} bytes (within the ${SIZE_MIN}–${SIZE_MAX} band)`);
}

if (failed) process.exit(1);
