#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "=== Cobalt — Installing dependencies ==="
export NG_CLI_ANALYTICS=false
# node version advisory (auto-added by cenius)
if command -v node >/dev/null 2>&1; then
  _REQ_NODE="$(node -p "(require('./package.json').engines||{}).node||''" 2>/dev/null || true)"
  [ -n "$_REQ_NODE" ] && echo "-> This app requires Node $_REQ_NODE (you have $(node -v)). If install fails with EBADENGINE, upgrade Node: https://nodejs.org"
fi
npm install --no-audit --no-fund

echo ""
echo "=== Cobalt — Build check ==="
npx ng build --configuration development

echo ""
echo "=== Cobalt — Setup complete ==="
echo "Run the app with: npx ng serve --host 0.0.0.0 --port 4200 --disable-host-check"
