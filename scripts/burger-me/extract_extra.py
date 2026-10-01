#!/usr/bin/env python3
"""Pull one added ingredient out of an edited exploded still (background removed).

The new layer is found as the connected component whose median colour is
closest to the ingredient's reference colour, among components below the top
blob. Its size is expressed in the shared unit (that image's top bun = 1000
wide), so it drops into the same scale as split_original.py's layers.

Usage: extract_extra.py <cut.png> <name> <r,g,b> <outdir>
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

src, name, rgb, outdir = sys.argv[1], sys.argv[2], np.array([int(v) for v in sys.argv[3].split(",")]), Path(sys.argv[4])
arr = np.array(Image.open(src).convert("RGBA"))
A = arr[:, :, 3] > 64
lab, k = ndimage.label(A)
objs = ndimage.find_objects(lab)
comps = sorted([(objs[i][0].start, i + 1) for i in range(k) if ndimage.sum(A, lab, i + 1) > 1500])
top = lab == comps[0][1]
tx = np.where(top.any(axis=0))[0]
ref_w, ref_c = tx[-1] + 1 - tx[0], (tx[0] + tx[-1] + 1) / 2
scored = []
for _, i in comps[1:]:
    m = lab == i
    med = np.median(arr[:, :, :3][m], axis=0)
    d = float(np.linalg.norm(med - rgb))
    print(f"  component {i}: y {objs[i-1][0].start}-{objs[i-1][0].stop} median {med.astype(int)} dist {d:.0f}")
    scored.append((d, i))
best_d, best_i = min(scored)
by = objs[best_i - 1][0]
# Scattered ingredients (jalapeño slices, two tomato slices, onion strands) come
# as several pieces on one row: take every similar-coloured piece overlapping it.
picked = [i for d, i in scored if d <= best_d * 1.5 + 20
          and objs[i - 1][0].start < by.stop and objs[i - 1][0].stop > by.start]
print("  picked", picked)
best = np.isin(lab, picked)
m = ndimage.binary_dilation(best, iterations=2) & (arr[:, :, 3] > 0)
yy, xx = np.where(m)
x0, x1, y0, y1 = xx.min(), xx.max() + 1, yy.min(), yy.max() + 1
out = np.zeros_like(arr); out[m] = arr[m]
outdir.mkdir(parents=True, exist_ok=True)
Image.fromarray(out[y0:y1, x0:x1]).save(outdir / f"{name}.png")
kk = 1000 / ref_w
info = {"w": round((x1 - x0) * kk, 1), "h": round((y1 - y0) * kk, 1), "cx": round(((x0 + x1) / 2 - ref_c) * kk, 1), "px": [int(x1 - x0), int(y1 - y0)]}
(outdir / f"{name}.json").write_text(json.dumps(info))
print(name, info)
