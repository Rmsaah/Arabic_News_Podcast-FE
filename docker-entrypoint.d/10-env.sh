#!/usr/bin/env sh
set -eu

# Generate /usr/share/nginx/html/env.js from env.template.js using envsubst
TEMPLATE="/usr/share/nginx/html/env.template.js"
OUT="/usr/share/nginx/html/env.js"

if [ -f "$TEMPLATE" ]; then
  # Only substitute the variables we expect
  : "${API_URL:=}"
  echo "Generating runtime env file at $OUT"
  envsubst '${API_URL}' < "$TEMPLATE" > "$OUT"
else
  echo "WARN: $TEMPLATE not found; skipping runtime env generation" >&2
fi
