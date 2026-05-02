#!/usr/bin/env bash
# Render build script — runs in the repo root
set -e  # Exit immediately on any error

echo "=== Installing Node.js ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== Node version: $(node -v) ==="
echo "=== npm version: $(npm -v) ==="

echo "=== Installing frontend dependencies ==="
npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Build complete! dist/ folder ready ==="
ls -la dist/
