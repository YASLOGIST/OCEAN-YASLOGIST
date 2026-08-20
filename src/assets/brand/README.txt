DROP THE TWO BRAND FILES IN THIS FOLDER
=======================================

Save each attachment here using EXACTLY these basenames. The extension can
be .png, .jpg, .jpeg, .webp or .svg — the resolver matches on basename only,
so no code needs to change.

  founder.jpg           the founder portrait  (square crop, 512x512 or larger)
  yaslogist-logo.png    the YASLOGIST "YL" globe mark  (transparent PNG preferred)

Until a file is present, that slot falls back to the built-in SVG mark or
the "AY" monogram, so the site always builds and runs.

ONLY THESE BASENAMES SHIP
-------------------------
`src/assets/brand.ts` enumerates the basenames above in its glob rather
than wildcarding the folder. Anything else dropped in here is ignored by
the build — it will NOT appear on the site, and it will NOT be inlined.
Adding a third slot means adding its basename to that glob as well.

SIZE MATTERS HERE
-----------------
`vite-plugin-singlefile` inlines these as base64 into the one output
index.html, which inflates them by about 33%. Keep each file under ~300 KB.
The founder portrait renders at 56px, so anything past 512x512 is wasted
bytes — resize before saving.
