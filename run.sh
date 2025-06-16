#!/usr/bin/env bash
set -euo pipefail

echo "==> Updating submodules..."
git submodule update --init --recursive --remote

# locate python3+
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Error: python3 or python not found" >&2
  exit 1
fi

# check version >=3.11 using POSIX test
read MAJOR MINOR <<EOF
$($PY -c 'import sys; v=sys.version_info; \
    print(v.major, v.minor)')
EOF

MAJOR=${MAJOR//[^0-9]/}
MINOR=${MINOR//[^0-9]/}

if [ -z "$MAJOR" ] || [ -z "$MINOR" ]; then
  echo "Error: could not parse Python version." >&2
  exit 1
fi

if [ "$MAJOR" -lt 3 ] || { [ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 11 ]; }; then
  echo "Error: Python >= 3.11 required (found ${MAJOR}.${MINOR})." >&2
  exit 1
fi
echo "Found Python: $($PY --version)"

# ensure .venv
VENV=.venv
if [ ! -d "$VENV" ]; then
  echo "==> Creating venv..."
  $PY -m venv "$VENV"
fi

# activate venv
if [ -f "$VENV/bin/activate" ]; then
  # POSIX
  # shellcheck disable=SC1091
  . "$VENV/bin/activate"
elif [ -f "$VENV/Scripts/activate" ]; then
  # Windows Git‐Bash / Cygwin
  # shellcheck disable=SC1091
  . "$VENV/Scripts/activate"
else
  echo "Error: activate script not found in $VENV" >&2
  exit 1
fi

# optional deps
if [ -f requirements.txt ]; then
  echo "==> Installing requirements..."
  pip install -r requirements.txt
fi

echo "==> Running barrage.py..."
python src/barrage.py

echo "==> Running barrage2.py..."
python src/barrage2.py

echo "==> Done."