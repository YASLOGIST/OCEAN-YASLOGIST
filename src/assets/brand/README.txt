DROP THE FOUNDER IMAGE IN THIS FOLDER
=====================================

Save the attachment here using EXACTLY this basename. The extension can
be .png, .jpg, .jpeg, .webp or .svg — the resolver matches on basename only,
so no code needs to change.

  founder.jpg           the founder portrait  (square crop, 512x512 or larger)

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
The repository-local single-file build plugin inlines this as base64 into
index.html, which inflates it by about 33%. Keep the file under ~300 KB.
The founder portrait renders at 56px, so anything past 512x512 is wasted
bytes — resize before saving.
