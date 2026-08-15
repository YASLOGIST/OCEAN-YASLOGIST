import type { CSSProperties } from "react";

/* ═══════════════════ RTL-correct text inside vector canvases ═══════════════════
   Every diagram on this site (neural forecast, fleet scope, route map) places
   its labels at hand-computed coordinates. Three properties of SVG text break
   that placement the moment the document flips to Arabic:

   1. `text-anchor` is resolved against the element's own inline base direction,
      NOT against geometry. Under `direction: rtl`, `start` becomes the RIGHT
      edge and `end` becomes the LEFT edge, so every label mirrors across its
      own anchor point and lands on top of the node it annotates — or leaves the
      viewBox entirely.
   2. `letter-spacing` inserts advance between glyphs. Arabic is cursive, so the
      inserted gap severs the joins and the word renders as loose, disconnected
      letterforms.
   3. `font-family: monospace` (and the Latin UI stack) carries no Arabic
      coverage, so the shaper falls back per-glyph and joining degrades further.

   This module resolves all three at once. Callers state the GEOMETRIC side they
   want the text to occupy — `left` means "x is the left edge, text runs right" —
   and the anchor that produces it is derived from the active direction. The base
   direction is pinned per element and isolated, so mixed Arabic-and-digit runs
   ("94.2% أفق 12 ساعة") order correctly without leaking bidi state into siblings.
─────────────────────────────────────────────────────────────────────────────── */

/** Which geometric edge of the text box the `x` coordinate pins. */
export type SvgTextSide = "left" | "right" | "center";

export type SvgTextProps = {
  textAnchor: "start" | "middle" | "end";
  style: CSSProperties;
};

/**
 * Resolve anchoring and shaping for one label in a vector canvas.
 *
 * @param side     geometric edge that `x` pins — independent of language.
 * @param rtl      true when the active language is right-to-left.
 * @param tracking Latin-only letter-spacing in SVG user units. Forced to 0 for
 *                 Arabic, where any tracking breaks cursive joining.
 */
export function svgTextProps(side: SvgTextSide, rtl: boolean, tracking = 0.6): SvgTextProps {
  /* start/end are direction-relative; invert them under RTL so the requested
     geometric side is what actually renders. */
  const textAnchor =
    side === "center" ? "middle" : side === "left" ? (rtl ? "end" : "start") : rtl ? "start" : "end";

  return {
    textAnchor,
    style: {
      direction: rtl ? "rtl" : "ltr",
      unicodeBidi: "isolate",
      letterSpacing: rtl ? 0 : tracking,
      fontFamily: rtl ? "var(--font-ar-tech)" : "var(--font-mono)",
      fontFeatureSettings: rtl ? '"liga" 1, "calt" 1' : undefined,
    },
  };
}

/**
 * Numeric labels (bearings, ranges, hashes) stay latin-digit and LTR in every
 * language — a compass reading of 090 must never reorder.
 */
export function svgNumProps(side: SvgTextSide, tracking = 0.3): SvgTextProps {
  return {
    textAnchor: side === "center" ? "middle" : side === "left" ? "start" : "end",
    style: {
      direction: "ltr",
      unicodeBidi: "isolate",
      letterSpacing: tracking,
      fontFamily: "var(--font-mono)",
      fontVariantNumeric: "tabular-nums",
    },
  };
}
