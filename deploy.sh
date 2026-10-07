#!/usr/bin/env bash
# Author: Kevin Pabón
# Builds and starts the full app on the VM. Usage: ./deploy.sh <VM_EXTERNAL_IP>
set -e

VM_IP="${1:?Usage: ./deploy.sh <VM_EXTERNAL_IP>}"

export VITE_API_BASE_URL="http://${VM_IP}:3000"
export CORS_ORIGIN="http://${VM_IP},http://127.0.0.1"

# the JWT secret is generated once and kept in .env (ignored by git);
# docker compose reads .env automatically
if [ ! -f .env ]; then
  echo "JWT_SECRET=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')" > .env
fi

docker compose up -d --build
