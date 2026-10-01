#!/usr/bin/env python3
"""Slice an exploded cut-out into one trimmed PNG per layer.

Usage: slice.py <cut.png> <outdir> <name,name,...> [--manifest file.json] [--min-gap 6] [--min-h 12]

Bands are runs of rows that contain opaque pixels, separated by >= min-gap fully
transparent rows. Names are assigned top to bottom; the count must match.
Dimensions are written in units where the FIRST band's width = 1000, and cx is
the band's horizontal centre minus the first band's centre, in the same units.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

def bands(alpha, min_gap, min_h):
    rows = (alpha > 24).any(axis=1)
    out, start, gap = [], None, 0
    for y, on in enumerate(rows):
        if on:
            if start is None:
                start = y
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= min_gap:
                end = y - gap + 1
                if end - start >= min_h:
                    out.append((start, end))
                start, gap = None, 0
    if start is not None and len(rows) - start >= min_h:
        out.append((start, len(rows)))
    return out

def main():
    args = sys.argv[1:]
    src, outdir, names = args[0], Path(args[1]), args[2].split(",")
    opt = lambda k, d: int(args[args.index(k) + 1]) if k in args else d
    manifest = args[args.index("--manifest") + 1] if "--manifest" in args else None
    im = Image.open(src).convert("RGBA")
    a = np.array(im)[:, :, 3]
    found = bands(a, opt("--min-gap", 6), opt("--min-h", 12))
    if len(found) != len(names):
        sys.exit(f"found {len(found)} bands, expected {len(names)}: {found}")
    outdir.mkdir(parents=True, exist_ok=True)
    info, ref_w, ref_c = {}, None, None
    for (y0, y1), name in zip(found, names):
        cols = np.where((a[y0:y1] > 24).any(axis=0))[0]
        x0, x1 = int(cols[0]), int(cols[-1]) + 1
        crop = im.crop((x0, y0, x1, y1))
        crop.save(outdir / f"{name}.png")
        w, h, c = x1 - x0, y1 - y0, (x0 + x1) / 2
        if ref_w is None:
            ref_w, ref_c = w, c
        k = 1000 / ref_w
        info[name] = {"w": round(w * k, 1), "h": round(h * k, 1), "cx": round((c - ref_c) * k, 1), "px": [w, h]}
        print(f"{name:14s} {w}x{h}px  -> w={info[name]['w']} h={info[name]['h']} cx={info[name]['cx']}")
    if manifest:
        Path(manifest).write_text(json.dumps(info, indent=2))

if __name__ == "__main__":
    main()
