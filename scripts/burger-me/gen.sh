#!/usr/bin/env bash
# Usage: gen.sh <model> <out.png> <aspect> <prompt> [ref upload id ...]
# One Higgsfield image job, waits, downloads the result (not the input) to <out.png>.
set -euo pipefail
model="$1"; out="$2"; aspect="$3"; prompt="$4"; shift 4
args=(generate create "$model" --prompt "$prompt" --aspect_ratio "$aspect" --resolution 2k --wait --wait-timeout 10m --json)
if [ "$model" = "flux_2" ]; then args+=(--variant pro); fi
for ref in "$@"; do args+=(--image-references "$ref"); done
json="$(higgsfield "${args[@]}" </dev/null)"
url="$(printf '%s' "$json" | python3 -c 'import sys,json; d=json.load(sys.stdin); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])')"
curl -sSL "$url" -o "$out"
[ -s "$out" ] || { echo "empty result for $out" >&2; exit 1; }
echo "$out"
