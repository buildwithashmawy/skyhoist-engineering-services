#!/usr/bin/env bash
# Install the Origin CLI and expose it on the default PATH.
set -euo pipefail

curl -fsSL https://downloads.cursor.com/origin/install.sh | sh

ORIGIN_BIN="${HOME}/.local/bin/origin"
if [[ ! -x "${ORIGIN_BIN}" ]]; then
  echo "origin install finished but ${ORIGIN_BIN} was not found" >&2
  exit 1
fi

# Login shells in Cloud Agents often skip ~/.bashrc PATH edits.
# Prefer /usr/local/bin so `origin` works without a custom PATH.
if command -v sudo >/dev/null 2>&1; then
  sudo ln -sf "$(readlink -f "${ORIGIN_BIN}")" /usr/local/bin/origin
else
  mkdir -p "${HOME}/.local/bin"
  export PATH="${HOME}/.local/bin:${PATH}"
fi

origin --version
