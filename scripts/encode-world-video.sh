#!/usr/bin/env bash
# Re-encodes the homepage scroll-world clips from master files.
#
#   scripts/encode-world-video.sh <masters-dir>
#
# Masters are the 1920x1080 ~10 Mbps files that shipped up to commit 1cb5cfb;
# recover one with:  git show 1cb5cfb:public/world/vid/core.mp4 > masters/core.mp4
#
# Every clip is scrubbed by scroll position, not played, so the GOP stays at 8
# frames: any seek lands within a third of a second of a keyframe. Long GOPs
# would shrink the files further and make the scrub stutter.
#
#   desktop  1920x1080  CRF 28   (720p was tested and goes visibly soft full-screen)
#   mobile   1280x720   CRF 30   -> <name>-m.mp4
set -euo pipefail

SRC="${1:?usage: encode-world-video.sh <masters-dir>}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/world/vid"
X264=(-c:v libx264 -preset slow -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -an -movflags +faststart)

for master in "$SRC"/*.mp4; do
  name="$(basename "$master" .mp4)"
  case "$name" in *-m) continue ;; esac
  ffmpeg -v error -y -i "$master" -vf "scale=-2:1080:flags=lanczos" "${X264[@]}" -crf 28 "$OUT/$name.mp4"
  ffmpeg -v error -y -i "$master" -vf "scale=-2:720:flags=lanczos"  "${X264[@]}" -crf 30 "$OUT/$name-m.mp4"
  printf '%-10s %6s KB  mobile %6s KB\n' "$name" \
    "$(( $(stat -f%z "$OUT/$name.mp4") / 1024 ))" "$(( $(stat -f%z "$OUT/$name-m.mp4") / 1024 ))"
done
