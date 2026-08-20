/* ── Bundle guard ─────────────────────────────────────────────────────
   Fails the gate if an academic reference reaches the built artifact.

   The platform is presented as a commercial product; the repositioning
   removed every academic component from source. It did not remove the
   AASTMT emblem from `src/assets/brand/`, where an eager wildcard glob
   kept re-inlining it as a data URI long after the code was gone
   (issue #1). "0 occurrences" was documented but nothing checked it, so
   the artifact drifted silently. This asserts it instead.
────────────────────────────────────────────────────────────────────── */

import { readFileSync } from "node:fs";

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
  process.exit(1);
}

console.log(`✓ ${BUNDLE}: 0 academic references (${BANNED.length} tokens checked)`);
