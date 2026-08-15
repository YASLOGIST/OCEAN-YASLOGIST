DROP THE THREE BRAND FILES IN THIS FOLDER
=========================================

Save each attachment here using EXACTLY these basenames. The extension can
be .png, .jpg, .jpeg, .webp or .svg — the resolver matches on basename only,
so no code needs to change.

  founder.jpg           the founder portrait  (square crop, 512x512 or larger)
  yaslogist-logo.png    the YASLOGIST "YL" globe mark  (transparent PNG preferred)
  aastmt.png            the AASTMT academy emblem      (transparent PNG preferred)

Until a file is present, that slot falls back to the built-in SVG mark or
the "AY" monogram, so the site always builds and runs.

SIZE MATTERS HERE
-----------------
`vite-plugin-singlefile` inlines these as base64 into the one output
index.html, which inflates them by about 33%. Keep each file under ~300 KB.
The founder portrait renders at 56px, so anything past 512x512 is wasted
bytes — resize before saving.

TRANSPARENCY
------------
The AASTMT emblem is black line art. It is rendered on a light chip so it
stays legible in both the dark and light themes. A transparent-background
PNG looks best; one with a solid white background still works.
