#!/usr/bin/env python3
"""Turn a background-removed cover into its pop-out layer.

Usage: make_pop.py <cover.webp> <cut.png> <out.webp> [plate.png plate-out.webp]

Keeps the subject (the largest pieces of alpha, dropping specks), resizes it
to the cover's exact pixel size so the two register, and prints the subject's
base (bottom centre) as a percentage of the 16:10 frame the cover is shown in
with object-fit: cover — the point the pop grows from.
"""
import json, subprocess, sys, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage

cover_p, cut_p, out_p = sys.argv[1:4]
cover = Image.open(cover_p)
cut = Image.open(cut_p).convert("RGBA").resize(cover.size, Image.LANCZOS)
a = np.array(cut)
mask = a[:, :, 3] > 40
lab, n = ndimage.label(mask)
sizes = ndimage.sum(mask, lab, range(1, n + 1))
keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.02])
keep = ndimage.binary_dilation(keep, iterations=3)
a[~keep] = 0
# The base is taken from the main subject (largest piece), so a stray kept
# piece elsewhere can't drag the growth point off the subject.
ys, xs = np.where(lab == (int(np.argmax(sizes)) + 1))
W, H = cover.size
bx, by = (xs.min() + xs.max()) / 2 / W, ys.max() / H
A, F = W / H, 16 / 10
if A > F:  # cover crops the sides
    fx = F / A
    bx = (bx - (1 - fx) / 2) / fx
else:      # cover crops top and bottom
    fy = A / F
    by = (by - (1 - fy) / 2) / fy
tmp = tempfile.mktemp(suffix=".png")
Image.fromarray(a).save(tmp)
subprocess.run(["cwebp", "-quiet", "-q", "82", "-alpha_q", "90", "-exact", tmp, "-o", out_p], check=True)
if len(sys.argv) > 5:
    # The clean plate (cover with the subject painted out), at the cover's size.
    plate = Image.open(sys.argv[4]).convert("RGB").resize(cover.size, Image.LANCZOS)
    tmp2 = tempfile.mktemp(suffix=".png")
    plate.save(tmp2)
    subprocess.run(["cwebp", "-quiet", "-q", "80", tmp2, "-o", sys.argv[5]], check=True)
print(json.dumps({"ox": round(bx * 100, 1), "oy": round(min(by, 1) * 100, 1), "top": round(ys.min() / H * 100, 1)}))
