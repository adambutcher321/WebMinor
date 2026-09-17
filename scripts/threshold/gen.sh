#!/usr/bin/env bash
# Usage: gen.sh <out.png> <aspect> <prompt> [reference upload id]
# Runs one flux_2 job at 2k, waits, downloads the result to <out.png>.
set -euo pipefail
out="$1"; aspect="$2"; prompt="$3"; ref="${4:-}"
args=(generate create flux_2 --prompt "$prompt" --aspect_ratio "$aspect" --resolution 2k --variant pro --wait --wait-timeout 10m --json)
if [ -n "$ref" ]; then args+=(--image-references "$ref"); fi
json="$(higgsfield "${args[@]}" </dev/null)"
url="$(printf '%s' "$json" | python3 -c 'import sys,json; d=json.load(sys.stdin); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])')"
curl -sSL "$url" -o "$out"
[ -s "$out" ] || { echo "empty result for $out" >&2; exit 1; }
echo "$out"
