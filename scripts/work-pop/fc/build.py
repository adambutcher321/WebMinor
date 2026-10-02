#!/usr/bin/env python3
"""Pop-out layers for the two covers Vision couldn't do alone.

The clean plate (Nano Banana edit with the subject painted out) is registered
to the cover with ORB features, then:
  * the subject mask is where cover and plate differ (Fernhollow), or the
    Vision cut-out's alpha (Crookeries);
  * the cut-out is the cover's own pixels under that mask, so it registers;
  * the shipped plate is the cover everywhere except a feathered, dilated
    band around the subject, where the edit fills in — so nothing else in the
    picture moves (the reason Crookeries' first plate was rejected).
"""
import sys, json
import numpy as np, cv2

def register(plate, cover):
    g1 = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY); g2 = cv2.cvtColor(cover, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(6000)
    k1, d1 = orb.detectAndCompute(g1, None); k2, d2 = orb.detectAndCompute(g2, None)
    m = sorted(cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True).match(d1, d2), key=lambda x: x.distance)[:1500]
    src = np.float32([k1[x.queryIdx].pt for x in m]); dst = np.float32([k2[x.trainIdx].pt for x in m])
    H, inl = cv2.findHomography(src, dst, cv2.RANSAC, 3.0)
    print('  inliers', int(inl.sum()), 'of', len(m), file=sys.stderr)
    return cv2.warpPerspective(plate, H, (cover.shape[1], cover.shape[0]), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)

def build(name, cover_p, plate_p, out_dir, mask_from=None, ylimit=None, thr=38, solid=None, seethrough=None, keep_below=None):
    cover = cv2.imread(cover_p); plate = register(cv2.imread(plate_p), cover)
    if mask_from:
        cut = cv2.imread(mask_from, cv2.IMREAD_UNCHANGED)
        mask = (cut[:, :, 3] > 40).astype(np.uint8)
    else:
        a = cv2.GaussianBlur(cover, (5, 5), 0).astype(np.float32); b = cv2.GaussianBlur(plate, (5, 5), 0).astype(np.float32)
        diff = np.sqrt(((a - b) ** 2).sum(2))
        mask = (diff > thr).astype(np.uint8)
        if ylimit: mask[ylimit:, :] = 0
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
        n, lab, stats, _ = cv2.connectedComponentsWithStats(mask)
        big = stats[1:, cv2.CC_STAT_AREA].max()
        keep = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= big * 0.01]
        mask = np.isin(lab, keep).astype(np.uint8)
        if solid is not None:
            # Dark edges against dark trees barely differ from the plate, so the
            # solid parts are traced, and the difference is trusted only where
            # the background shows through (railings, between the stilts).
            allowed = np.zeros_like(mask)
            for x0, y0, x1, y1 in seethrough: allowed[y0:y1, x0:x1] = 1
            mask = mask * allowed
            for poly in solid: cv2.fillPoly(mask, [np.int32(poly)], 1)
    # cut-out: cover pixels, slightly feathered alpha
    alpha = cv2.GaussianBlur((mask * 255).astype(np.uint8), (3, 3), 0)
    rgba = np.dstack([cover, alpha])
    cv2.imwrite(f'{out_dir}/{name}-cut.png', rgba)
    # plate: edit pixels only in a dilated, feathered band around the subject
    band = cv2.dilate(mask, np.ones((25, 25), np.uint8))
    # Below this row the cover is kept as it is (Fernhollow's stilts and the
    # mist under the deck stay in the water while the cabin lifts off them).
    if keep_below: band[keep_below:, :] = 0
    band = cv2.GaussianBlur(band.astype(np.float32), (31, 31), 0)[:, :, None]
    shipped = (plate * band + cover * (1 - band)).astype(np.uint8)
    cv2.imwrite(f'{out_dir}/{name}-plate.png', shipped)
    ys, xs = np.where(mask > 0)
    H, W = mask.shape
    bx, by = (xs.min() + xs.max()) / 2 / W, ys.max() / H
    fx = (16 / 10) / (W / H)  # covers are wider than 16:10, so the sides crop
    bx = (bx - (1 - fx) / 2) / fx
    print(json.dumps({'name': name, 'ox': round(bx * 100, 1), 'oy': round(min(by, 1) * 100, 1), 'area': round(mask.mean() * 100, 1)}))

if __name__ == '__main__':
    build('fernhollow', 'fernhollow.png', 'fern-plate-raw.png', '.', ylimit=700,
          solid=[[(893, 88), (1229, 626), (563, 626)],            # the A-frame
                 [(392, 618), (1220, 618), (1220, 662), (392, 662)]],  # the deck
          seethrough=[(398, 525, 610, 630)],  # the railing
          keep_below=664)
    build('crookeries', 'crookeries.png', 'crook-plate-raw.png', '.', mask_from='crook-cut.png')
