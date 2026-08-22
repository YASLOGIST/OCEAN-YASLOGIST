import { BrandMark } from "./Brand";

/* ══════════════════ Corner brand plate ══════════════════
   TRIAL-ONLY. The FInaldark/Finallight footage carries a baked-in
   generation watermark — an opaque four-pointed sparkle at source
   x 1134-1183, y 560-621 of the 1280x720 frame, present in 60/60 frames of
   both sequences. The accepted permanent fix is a clean re-export with the
   mark removed at source; this plate covers it in the meantime WITHOUT
   touching a single video byte. Delete this component and its `.brand-plate`
   rules once the clean masters land.

   WHY IT LIVES INSIDE `Background`: the plate only ever needs to hide the
   background layer, so it is rendered as the last child of Background's
   `z-[-1]` container. That container is a stacking context, so the plate can
   never paint over page content, the HUD or the header no matter how large it
   is — they all sit in higher layers and draw straight over it. The container
   is also `pointer-events-none`, so the plate cannot intercept a click. Both
   properties are structural rather than a tuned z-index, which is what makes
   "obstructs nothing" hold at every breakpoint and scroll position instead of
   only the ones that were checked.

   It is `position: fixed` and viewport-anchored on purpose. The footage sits
   under `object-fit: cover` inside `.bg-camera`, which the scroll engine pans
   and zooms (scale 1.06 -> 1.20, translateY up to 0.1 * vh), so the watermark
   sweeps across the lower-right as the page scrolls rather than holding still.
   The plate is sized to the union of that sweep — measured at 175 x 222 px
   from the corner at 1920x1080 — not to the 78 x 97 px mark itself.

   Sizing is deliberately generous: oversized costs nothing here because the
   plate is a legitimate corner element, whereas undersized re-exposes the
   sparkle. See the `.brand-plate` rules in index.css for the geometry and for
   why it is gated on aspect ratio. */
export default function BrandPlate() {
  return (
    <div className="brand-plate glass-strong" aria-hidden="true">
      <BrandMark id="plate" className="h-10 w-10" />
      <p className="font-display text-[15px] font-bold leading-none tracking-[0.14em] text-ice">YASLOGIST</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ghost">Core · Cairo Ops</p>
    </div>
  );
}
