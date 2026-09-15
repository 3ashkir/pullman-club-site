# Build

The page is generated, not hand-edited. `index.html` and `_artifact.html` are outputs.

    python3 build/art.py   build/art.json    # illustration geometry -> JSON
    python3 build/build.py                   # _styles.html + art -> _page.html
    python3 build/wrap.py  [canonical-url]   # _page.html -> index.html + _artifact.html
    python3 build/og.py    build/og.html     # Open Graph source

Source files:

- `_styles.html` — tokens, layout, motion. Edit this for anything visual.
- `build/art.py` — papel picado pennants, the marigold rosette, concha, pastel,
  cuernito. Geometry is computed so the shapes stay editable.
- `build/og.py` — the 1200x630 card, rendered with headless Chromium and cropped
  by `build/crop.py` (headless clamps the viewport, so it renders tall and crops).

`_artifact.html` is the same page without the `<!doctype>/<html>/<head>` wrapper,
for hosts that supply their own skeleton.
