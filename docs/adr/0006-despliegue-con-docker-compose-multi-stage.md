# ADR-0006: Deployment with Docker Compose and multi-stage builds

- **Date:** 2026-10-07
- **Status:** Accepted
- **Decided by:** Kevin Pabón (architect)

## Context

Deliverable 1 Part 1 was deployed as a frontend only: `dist/` was built on a team member's computer, committed to git, and an `nginx:alpine` image copied it. With the backend of ADR-0005 the whole system must run on the GCP VM, and the professor asked, in class 12 ("Despliegue de Aplicaciones FullStack") and in writing, to deploy with the `docker-compose.yml` of his tutorials repository, improved as seen in that class, and **not to push `dist/` to GitHub**.

The class showed: an `e2-medium` VM (4 GB, so the builds don't hang), a firewall rule for port 3000, multi-stage Dockerfiles for both projects, a `docker-compose.yml` with a `backend` service (SQLite in the `backend-data` volume) and a `frontend` service, and a `deploy.sh` that exports the VM IP and runs `docker compose up -d --build`.

## Decision

- **`dist/` is not versioned** in either project; it is in `.gitignore`.
- **Multi-stage Dockerfiles** copied from class 12: a `builder` stage with `node:22-bookworm-slim` that runs `npm ci` and `npm run build`, and a final stage that only takes the compiled output (`COPY --from=builder`). The frontend's final stage is `nginx:alpine`; the backend's installs only production dependencies (`npm ci --omit=dev`).
- **`docker-compose.yml` at the repository root**, as the professor's. The frontend's build context is the root (where the Vue project lives), so the root `.dockerignore` excludes `backend/`.
- **SQLite stays**, in the `backend-data` volume (`SQLITE_PATH=/data/database.sqlite`), so the data survives rebuilding the containers.
- **`VITE_API_BASE_URL` is a build argument**: Vite writes it into the JavaScript bundle at build time, so it can't be set when the container starts.
- **`deploy.sh` receives the VM IP as an argument** (`./deploy.sh <VM_EXTERNAL_IP>`) instead of having it written inside the script, so a new IP doesn't need a commit.
- **`JWT_SECRET` is required in production**: the compose file refuses to start without it, and `deploy.sh` generates a random one the first time and keeps it in `.env` on the VM (ignored by git), so no secret is in the repository.
- **`restart: unless-stopped`** on both services, so the app comes back after the VM restarts.

## Considered Options

- **MySQL as in the professor's "improved version"** (`fullstack-vue-nest-deployment`) — not adopted: the class's compose uses SQLite, ADR-0005 already chose it, and a third container adds a password set and a health check without a requirement asking for it.
- **Keep committing `dist/`** — rejected: the professor asked not to, and a committed build gets out of date with the code (it happened: `dist/` still had the LocalStorage version after the backend migration).

## Consequences

- The first `docker compose up --build` compiles both projects inside the VM, which needs the `e2-medium` machine type.
- Changing the VM IP only requires running `deploy.sh` again with the new IP: the frontend image is rebuilt with the new API URL and CORS.
- Deleting the `backend-data` volume (`docker compose down -v`) resets the demo data: the seeders run again on the next start.
