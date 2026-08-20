/* ── Brand asset resolver ─────────────────────────────────────────────
   Files dropped into `src/assets/brand/` are picked up here by basename,
   independent of extension (.png / .jpg / .jpeg / .webp / .svg).

   Expected basenames:
     founder         — founder portrait, square-ish, ≥512px
     yaslogist-logo  — YASLOGIST "YL" globe mark

   A glob is used rather than static imports so that a missing file
   degrades to the built-in SVG fallback instead of failing the build.
   Vite resolves this at build time; the singlefile build inlines each
   hit as a data URI, so there is no extra request at runtime.

   The basenames are enumerated rather than wildcarded: `eager: true`
   inlines every match whether or not anything consumes it, so a `*`
   here ships any stray file left in the folder. That is how the AASTMT
   emblem kept reaching production after its components were deleted
   (issue #1). Adding a slot means adding its basename below.
────────────────────────────────────────────────────────────────────── */

const files = import.meta.glob("./brand/{founder,yaslogist-logo}.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function pick(basename: string): string | undefined {
  const match = Object.keys(files).find((path) => {
    const file = path.split("/").pop() ?? "";
    return file.replace(/\.[^.]+$/, "").toLowerCase() === basename;
  });
  return match ? files[match] : undefined;
}

export const founderPhoto = pick("founder");
export const brandLogo = pick("yaslogist-logo");
