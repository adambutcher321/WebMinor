#!/usr/bin/env python3
"""Cut the chosen exploded still (exploded-c, background removed) into nine layers.

Row slicing fails on this angle: each layer is an ellipse, and the background
remover kept the dark shadow between the top bun, pickles and onion, fusing them
into one blob. So:
  - the six lower layers are separate connected components, taken as they are;
  - the top blob is split with a per-column seam through the darkest rows
    (bun | rest), then by hue (onion purple/white vs pickle olive).
Writes <outdir>/<name>.png and <outdir>/manifest.json in units where the top
bun's width = 1000; cx = centre offset from the top bun's centre.

Usage: split_original.py <cut.png> <outdir>
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

def biggest(m, n=1):
    lab, k = ndimage.label(m)
    if k == 0:
        return m
    sizes = ndimage.sum(m, lab, range(1, k + 1))
    keep = np.zeros_like(m)
    for i in np.argsort(sizes)[::-1][:n]:
        keep |= lab == i + 1
    return keep

def clean(m, A, open_it=2, n=1):
    m = ndimage.binary_opening(m, iterations=open_it)
    m = biggest(m, n)
    m = ndimage.binary_closing(m, iterations=4)
    return ndimage.binary_fill_holes(m) & A

def main():
    src, outdir = sys.argv[1], Path(sys.argv[2])
    outdir.mkdir(parents=True, exist_ok=True)
    arr = np.array(Image.open(src).convert("RGBA"))
    A = arr[:, :, 3] > 64
    lab, k = ndimage.label(A)
    objs = sorted([(o[0].start, i + 1) for i, o in enumerate(ndimage.find_objects(lab))
                   if ndimage.sum(A, lab, i + 1) > 2000])
    comps = [lab == i for _, i in objs]
    if len(comps) != 7:
        sys.exit(f"expected 7 components, found {len(comps)}")
    top = comps[0]
    ys = np.where(top.any(axis=1))[0]
    y0, y1 = ys[0], ys[-1] + 1
    sub = arr[y0:y1]
    At = top[y0:y1]
    hsv = np.array(Image.fromarray(sub[:, :, :3]).convert("HSV")).astype(float)
    H, S, V = hsv[:, :, 0] * 360 / 255, hsv[:, :, 1] / 255, hsv[:, :, 2] / 255
    lum = V.copy(); lum[~At] = 2
    # The seam lives in the band between the bun's underside and the pickles.
    band = (int((y1 - y0) * 0.50), int((y1 - y0) * 0.66))
    seam = np.argmin(ndimage.uniform_filter(lum, size=(5, 1))[band[0]:band[1]], axis=0) + band[0]
    seam = ndimage.median_filter(seam, size=41)
    above = np.arange(sub.shape[0])[:, None] < seam[None, :]
    bun = At & above & (V > 0.18)
    bun[int((y1 - y0) * 0.578):, :] = False  # trims a stub that hangs into the pickle gap
    bun = biggest(ndimage.binary_opening(bun, iterations=2))
    lower = At & ~above
    pick_h = (H >= 20) & (H <= 60)
    onion = clean(lower & (((H > 250) | (H < 16)) | ((S < 0.3) & (V > 0.5) & ~pick_h)), At, 2, 2)
    pickles = clean(lower & ~onion & pick_h & (V > 0.25), At, 2, 2) & ~onion
    pickles = ndimage.binary_closing(pickles, iterations=8) & lower & ~onion

    def full(m):
        f = np.zeros(A.shape, bool); f[y0:y1] = m; return f

    layers = [("bun-top", full(bun)), ("pickles", full(pickles)), ("onion", full(onion))]
    soft = arr[:, :, 3] > 0
    for name, m in zip(["cheese", "patty", "cheese-2", "patty-2", "sauce", "bun-bottom"], comps[1:]):
        # grow by 2px into the remover's feathered edge (alpha 1-64) so edges stay soft
        layers.append((name, ndimage.binary_dilation(m, iterations=2) & soft))

    info, ref_w, ref_c = {}, None, None
    for name, m in layers:
        yy, xx = np.where(m)
        bx0, bx1, by0, by1 = xx.min(), xx.max() + 1, yy.min(), yy.max() + 1
        out = np.zeros_like(arr)
        # keep the original soft alpha inside the mask so edges stay feathered
        out[m] = arr[m]
        Image.fromarray(out[by0:by1, bx0:bx1]).save(outdir / f"{name}.png")
        w, h, c = bx1 - bx0, by1 - by0, (bx0 + bx1) / 2
        if ref_w is None:
            ref_w, ref_c = w, c
        kk = 1000 / ref_w
        info[name] = {"w": round(w * kk, 1), "h": round(h * kk, 1), "cx": round((c - ref_c) * kk, 1),
                      "top": round(by0 * kk, 1), "px": [int(w), int(h)]}
        print(f"{name:11s} {w}x{h}px -> w={info[name]['w']} h={info[name]['h']} cx={info[name]['cx']}")
    (outdir / "manifest.json").write_text(json.dumps(info, indent=2))

if __name__ == "__main__":
    main()
