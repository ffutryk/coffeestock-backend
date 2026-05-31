#!/bin/bash
set -e

echo "Setting up..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example"
else
  echo ".env already exists"
fi

set -a
source .env
set +a

BACKEND_URL="http://localhost:${BACKEND_PORT}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"

docker compose up --build -d

echo ""
echo "Environment is running"
echo ""
echo "Backend:  $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""
echo "Watching logs..."
echo "Press Ctrl+C to stop everything"

cleanup() {
  echo ""
  echo "Stopping services..."
  docker compose stop
}

trap cleanup INT TERM EXIT

docker compose logs -f backend frontend