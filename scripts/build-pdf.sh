#!/usr/bin/env bash
# Orchestrates: start Next.js dev server (if not already running),
# render /onepager to public/onepager.pdf via Playwright, tear server down.
#
# If a dev server is already responding on $AR_BASE_URL, we use it as-is and
# leave it running. This lets you iterate on the page in another terminal
# while re-running this script.
#
# Usage: bash scripts/build-pdf.sh
#   or:  npm run build:pdf

set -euo pipefail

PORT="${PORT:-3000}"
BASE_URL="${AR_BASE_URL:-http://localhost:$PORT}"
READY_TIMEOUT="${AR_READY_TIMEOUT:-90}"
PYTHON_BIN="${PYTHON:-python3}"

cd "$(dirname "$0")/.."

# Make AR_BASE_URL visible to the python script, which keys off the same var.
export AR_BASE_URL="$BASE_URL"

server_pid=""
cleanup() {
  if [[ -n "$server_pid" ]] && kill -0 "$server_pid" 2>/dev/null; then
    echo "[build-pdf] stopping dev server (pid $server_pid)"
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if curl -sSf -o /dev/null --max-time 2 "$BASE_URL"; then
  echo "[build-pdf] server already running at $BASE_URL — reusing"
else
  echo "[build-pdf] starting next dev on port $PORT"
  npm run dev -- -p "$PORT" >/tmp/ar-onepager-pdf-dev.log 2>&1 &
  server_pid=$!

  # Poll until the server answers. Next.js dev compiles lazily, so the
  # /onepager request itself can take a few seconds extra; we poll the root
  # first and let Playwright handle the route compile.
  echo "[build-pdf] waiting up to ${READY_TIMEOUT}s for $BASE_URL"
  for ((i=0; i<READY_TIMEOUT; i++)); do
    if curl -sSf -o /dev/null --max-time 2 "$BASE_URL"; then
      echo "[build-pdf] server ready"
      break
    fi
    if ! kill -0 "$server_pid" 2>/dev/null; then
      echo "[build-pdf] dev server died; tail of log:" >&2
      tail -n 40 /tmp/ar-onepager-pdf-dev.log >&2 || true
      exit 1
    fi
    sleep 1
  done

  if ! curl -sSf -o /dev/null --max-time 2 "$BASE_URL"; then
    echo "[build-pdf] server did not become ready within ${READY_TIMEOUT}s" >&2
    tail -n 40 /tmp/ar-onepager-pdf-dev.log >&2 || true
    exit 1
  fi
fi

"$PYTHON_BIN" scripts/build_onepager_pdf.py
