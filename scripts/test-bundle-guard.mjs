/* ── Negative test for scripts/check-bundle.mjs ───────────────────────
   A guard that has never been observed failing is not evidence that it
   works. This file injects each violation into a throwaway copy of the real
   artifact and asserts that the guard rejects it.

   It matters here specifically because of HANDOFF.md §7.2: the previous
   attempt at this check was tree-shaken away and reported success on every
   run for exactly this reason. If check-bundle.mjs were silently a no-op,
   every case below would report "expected failure, got success" — so a
   broken guard fails this test rather than passing it.

   Runs against dist/index.html as it exists on disk, so build it first.
   Wired into `npm run gate` after check:bundle.
────────────────────────────────────────────────────────────────────── */

import { mkdtempSync, mkdirSync, cpSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const CHECK = resolve("scripts/check-bundle.mjs");
const ARTIFACT = "dist/index.html";

const cases = [
  {
    name: "academic token re-introduced",
    inject: (html) => html + "<!-- AASTMT -->",
    expect: "academic references must not ship",
  },
  {
    name: "type stack falls back to Google Fonts",
    inject: (html) => html.replace(
      'href="./fonts/fonts.css"',
      'href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700&display=swap"',
    ),
    expect: "must be self-hosted",
  },
  {
    name: "resource loads from a third-party origin",
    inject: (html) => html + '<img src="https://evil.example/tracker.png" alt="" />',
    expect: "must not load from another origin",
  },
  {
    name: "artifact reaches for eval",
    inject: (html) => html + '<script>eval("1")</script>',
    expect: "must not use eval",
  },
  {
    name: "inline event handler attribute",
    inject: (html) => html + '<div onerror="alert(1)"></div>',
    expect: "no inline event handlers allowed",
  },
  {
    name: "build asset emitted instead of inlined",
    inject: (html) => html,
    extraFiles: ["dist/assets/index-deadbeef.css"],
    expect: "must be inlined, not emitted",
  },
  {
    name: "reference points at a file that does not ship",
    inject: (html) => html.replace(
      'href="./fonts/fonts.css"',
      'href="./fonts/missing.css"',
    ),
    expect: "must resolve to shipped files",
  },
];

let failures = 0;

const sandbox = mkdtempSync(join(tmpdir(), "bundle-guard-"));
try {
  const sandboxDist = join(sandbox, "dist");
  mkdirSync(sandboxDist, { recursive: true });
  cpSync("dist/fonts", join(sandboxDist, "fonts"), { recursive: true });
  const baseline = readFileSync(ARTIFACT, "utf8");

  const runCheck = () => {
    const result = spawnSync("node", [CHECK], { cwd: sandbox, encoding: "utf8" });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  };

  /* ── Positive control: the untouched artifact must pass ─────────── */
  writeFileSync(join(sandboxDist, "index.html"), baseline);
  const clean = runCheck();
  if (clean.status === 0) {
    console.log(`✓ control: real artifact passes the guard`);
  } else {
    console.error(`✗ control: real artifact FAILED the guard — refusing to report further`);
    console.error(clean.output);
    process.exit(1);
  }

  /* ── Each injected violation must be caught ──────────────────────── */
  for (const [index, testCase] of cases.entries()) {
    for (const file of testCase.extraFiles ?? []) {
      mkdirSync(join(sandbox, file.split("/").slice(0, -1).join("/")), { recursive: true });
      writeFileSync(join(sandbox, file), "");
    }
    writeFileSync(join(sandboxDist, "index.html"), testCase.inject(baseline));

    const result = runCheck();
    const caught = result.status !== 0 && result.output.includes(testCase.expect);
    if (caught) {
      console.log(`✓ ${testCase.name}`);
    } else {
      failures++;
      console.error(`✗ ${testCase.name}`);
      console.error(`    expected the guard to fail with: ${testCase.expect}`);
      console.error(`    exit code: ${result.status}`);
      console.error(result.output.trim().split("\n").map((l) => `    ${l}`).join("\n"));
    }

    /* clean up anything this case created */
    for (const file of testCase.extraFiles ?? []) rmSync(join(sandbox, file), { force: true });
  }
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n✗ ${failures}/${cases.length} injected violations were not caught`);
  process.exit(1);
}
console.log(`\n✓ ${cases.length}/${cases.length} injected violations were caught`);
