"""Cuts the site's title font down to what it draws: uppercase titles at weight 800 to 820 (the home page breathes to
820), on the full width axis. 90 KB becomes about 24 KB.

The full font is the Archivo variable font with its width axis (OFL, github.com/Omnibus-Type/Archivo); the copy this
site started from is in git: git show 5880190:site/public/fonts/ArchivoFlex-Variable.woff2 > /tmp/full.woff2
Then: python3 scripts/subset-flex.py /tmp/full.woff2   (and rerun scripts/flex-metrics.py)"""
import sys, pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

here = pathlib.Path(__file__).resolve().parent.parent
font = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wght": (800, 820)})
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "calt", "case", "cpsp"]
opts.name_IDs = ["*"]
opts.notdef_outline = True
keep = [c for c in range(0x20, 0x7F)] + [ord(c) for c in "’–—"]
sub = subset.Subsetter(opts)
sub.populate(unicodes=keep)
sub.subset(font)
font.flavor = "woff2"
out = here / "public/fonts/ArchivoFlex-Variable.woff2"
font.save(out)
print(f"wrote {out.name}: {out.stat().st_size // 1024} KB")
