#!/usr/bin/env bash
# Usage: export.sh <png> <out.webp> [maxWidth=900]  — alpha kept exactly
set -euo pipefail
tmp="$(mktemp -t bm).png"
python3 - "$1" "$tmp" "${3:-900}" <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGBA")
mw = int(sys.argv[3])
if im.width > mw:
    im = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
im.save(sys.argv[2])
PY
cwebp -quiet -q 84 -alpha_q 100 -exact "$tmp" -o "$2"
rm -f "$tmp"
