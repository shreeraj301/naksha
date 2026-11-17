"""CI diagnostics after a failed screenshot run: for every expected/actual pair, how many pixels differ
at each colour tolerance, and the largest single difference. Prints a table to the log."""
import glob, os, sys
import numpy as np
from PIL import Image

rows = []
for actual in sorted(glob.glob("test-results/**/*-actual.png", recursive=True)):
    expected = actual.replace("-actual.png", "-expected.png")
    if not os.path.exists(expected):
        continue
    a = np.asarray(Image.open(actual).convert("RGB")).astype(int)
    e = np.asarray(Image.open(expected).convert("RGB")).astype(int)
    if a.shape != e.shape:
        rows.append((os.path.basename(actual), f"size {e.shape[:2]} -> {a.shape[:2]}"))
        continue
    d = np.abs(a - e).max(axis=2) / 255
    counts = " ".join(f"{t}:{int((d > t).sum())}" for t in (0.1, 0.2, 0.3, 0.4, 0.5, 0.7))
    rows.append((os.path.basename(actual), f"max {d.max():.2f}  {counts}  of {d.size}"))
for name, info in rows:
    print(f"{name:45s} {info}")
print(f"{len(rows)} pairs", file=sys.stderr)

# A small crop of a few pairs, base64-encoded, so the difference can be seen without downloading artifacts.
import base64, io
for name in ("Kbd-light", "Button-light", "Breadcrumb-light"):
    hits = glob.glob(f"test-results/**/{name}-actual.png", recursive=True)
    if not hits:
        continue
    for kind in ("actual", "expected"):
        im = Image.open(hits[0].replace("-actual.png", f"-{kind}.png")).convert("RGB").crop((0, 0, 480, 120))
        buf = io.BytesIO()
        im.quantize(64).save(buf, "PNG", optimize=True)
        print(f"CROP {name} {kind} {base64.b64encode(buf.getvalue()).decode()}")
