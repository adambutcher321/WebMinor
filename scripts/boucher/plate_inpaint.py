#!/usr/bin/env python3
"""Paint the subject out of a photo locally (OpenCV inpaint), for PopPhoto.

Usage: plate_inpaint.py <photo> <lift.png> <out.webp>

The subject mask comes from the macOS Vision lift. The fill is soft, but it
only ever shows as a thin sliver beside the enlarged cut-out (at rest the
cut-out covers it exactly), so it never needs to be photographic.
"""
import subprocess, sys, tempfile
import cv2
import numpy as np

photo, lift, out = sys.argv[1:4]
img = cv2.imread(photo, cv2.IMREAD_COLOR)
a = cv2.imread(lift, cv2.IMREAD_UNCHANGED)[:, :, 3]
mask = (a > 20).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((25, 25), np.uint8))
# Inpaint at quarter size (large holes fill far better and faster), then use the
# upscaled fill only inside the mask.
h, w = img.shape[:2]
small = cv2.resize(img, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
smask = cv2.resize(mask, (w // 4, h // 4), interpolation=cv2.INTER_NEAREST)
filled = cv2.inpaint(small, smask, 9, cv2.INPAINT_TELEA)
filled = cv2.GaussianBlur(filled, (0, 0), 3)
up = cv2.resize(filled, (w, h), interpolation=cv2.INTER_CUBIC)
soft = cv2.GaussianBlur(mask, (0, 0), 6).astype(np.float32)[..., None] / 255
res = (img * (1 - soft) + up * soft).astype(np.uint8)
tmp = tempfile.mktemp(suffix=".png")
cv2.imwrite(tmp, res)
subprocess.run(["cwebp", "-quiet", "-q", "80", tmp, "-o", out], check=True)
