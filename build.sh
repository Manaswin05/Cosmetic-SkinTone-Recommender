#!/usr/bin/env bash
set -e

echo "=== Node version: $(node -v) ==="
echo "=== npm version: $(npm -v) ==="

echo "=== Installing frontend dependencies ==="
npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Build complete ==="
ls -la dist/
