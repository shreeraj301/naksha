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
