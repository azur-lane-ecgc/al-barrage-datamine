#!/usr/bin/env bash
set -euo pipefail

echo "==> Updating submodules..."
git submodule update --init --recursive --remote

# locate a python3+ on PATH
if command -v python3 >/dev/null 2>&1; then
  PY_HOST=python3
elif command -v python >/dev/null 2>&1; then
  PY_HOST=python
else
  echo "Error: python3 or python not found" >&2
  exit 1
fi

# check version >= 3.11
read MAJOR MINOR << EOF
$($PY_HOST -c 'import sys; v=sys.version_info; print(v.major, v.minor)')
EOF
MAJOR=${MAJOR//[^0-9]/}
MINOR=${MINOR//[^0-9]/}

if [ -z "$MAJOR" ] || [ -z "$MINOR" ] \
   || [ "$MAJOR" -lt 3 ] \
   || { [ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 11 ]; }; then
  echo "Error: Python >= 3.11 required (found ${MAJOR:-?}.${MINOR:-?})." >&2
  exit 1
fi

echo "Found Python: $($PY_HOST --version)"

VENV=.venv

# Re-create venv if it doesn't have a usable python
if [ ! -x "$VENV/bin/python" ] && [ ! -x "$VENV/Scripts/python.exe" ]; then
  echo "==> Creating (or recreating) venv with Python $( $PY_HOST -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' )…"
  rm -rf "$VENV"
  $PY_HOST -m venv "$VENV"
fi

# Activate it (POSIX or Windows layout) and bind PY
if [ -f "$VENV/bin/activate" ]; then
  # POSIX
  # shellcheck disable=SC1091
  . "$VENV/bin/activate"
  PY="$VENV/bin/python"
elif [ -f "$VENV/Scripts/activate" ]; then
  # Windows (Git-Bash / Cygwin)
  # shellcheck disable=SC1091
  . "$VENV/Scripts/activate"
  PY="$VENV/Scripts/python.exe"
else
  echo "Error: cannot find activate script in $VENV" >&2
  exit 1
fi

echo "==> Upgrading pip in venv..."
"$PY" -m pip install --upgrade pip setuptools wheel

if [ -f requirements.txt ]; then
  echo "==> Installing requirements…"
  "$PY" -m pip install -r requirements.txt
fi

echo "==> Running barrage.py…"
"$PY" src/barrage.py

echo "==> Running barrage2.py…"
"$PY" src/barrage2.py

echo "==> Done."