#!/usr/bin/env python3
"""Shift a jacket cut-out's colour onto its page tint.

Usage: retint.py <in.webp> <out.webp> <target hue deg> [value gamma] [sat scale]

Only coloured pixels move (weighted by saturation), so the white gloss
highlights, the black zip and the shadows keep their look. Hue is set to the
target, value is lifted by a gamma (<1 brightens) and saturation scaled.
"""
import subprocess, sys, tempfile
import numpy as np
from PIL import Image

src, out, hue = sys.argv[1], sys.argv[2], float(sys.argv[3]) / 360
gamma = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
sscale = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
im = Image.open(src).convert("RGBA")
alpha = np.array(im)[:, :, 3]
hsv = np.array(im.convert("RGB").convert("HSV")).astype(float) / 255
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
w = np.clip((s - 0.15) / 0.25, 0, 1)
w = w * w * (3 - 2 * w)
nh = hue  # set, not offset: every coloured pixel lands on the page's hue
dh = ((nh - h + 0.5) % 1.0) - 0.5
h2 = (h + dh * w) % 1.0
v2 = v + (np.power(v, gamma) - v) * w
s2 = np.clip(s + (s * sscale - s) * w, 0, 1)
rgb = Image.merge("HSV", [Image.fromarray(c) for c in (np.stack([h2, s2, v2], -1) * 255).round().astype(np.uint8).transpose(2, 0, 1)]).convert("RGB")
res = Image.merge("RGBA", (*rgb.split(), Image.fromarray(alpha)))
tmp = tempfile.mktemp(suffix=".png")
res.save(tmp)
subprocess.run(["cwebp", "-quiet", "-q", "86", "-alpha_q", "100", "-exact", tmp, "-o", out], check=True)
