#!/bin/sh
set -eu

NGINX_PID=""

cd /app/backend
uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cleanup() {
  kill "$BACKEND_PID" "$NGINX_PID" 2>/dev/null || true
}

trap cleanup INT TERM

nginx -g 'daemon off;' &
NGINX_PID=$!

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 1
done

cleanup
wait "$BACKEND_PID" 2>/dev/null || true
wait "$NGINX_PID" 2>/dev/null || true
