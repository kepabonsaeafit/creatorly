# Creatorly

Internal dashboard for a UGC content agency to manage its daily operation: the **Creators** catalog, the **Brands** that request content, and the **Orders** that connect both, with budget and status tracking.

The repository holds two projects:

- **Frontend** — SPA in Vue 3 + Vite + TypeScript, in [`frontend/`](./frontend).
- **Backend** — REST API in NestJS + TypeORM + SQLite, in [`backend/`](./backend). It owns the database, the seed data and the JWT login (ADR-0005).

The frontend keeps no data of its own: it reads and writes everything through the backend API.

## Stack

### Frontend

- **Vue 3** + `<script setup lang="ts">` in every component
- **TypeScript** across all of `frontend/src/`
- **Vite** as bundler and dev server
- **axios** for every call to the API
- **Pinia** for the session state (`SessionStore`, the only store)
- **Vue Router** with access guards
- **Chart.js** for the Reports and Orders charts
- **vue-toastification** for success/error notifications

### Backend

- **NestJS 12** (ESM) + **TypeORM** over **SQLite** (`better-sqlite3`)
- **JWT** login following the NestJS authentication guide, with passwords hashed with bcrypt

## How to run the project

Requires **Node `^22.18.0 || >=24.12.0`** (the exact range enforced by `engines` in `frontend/package.json`; Node 23.x, for example, doesn't satisfy it).

Both projects run at the same time, in two terminals.

**1. Backend** (first, so the API is up when the frontend loads):

```sh
cd backend
npm install
npm run start:dev
```

It listens on `http://localhost:3000/api`, which answers `API is running`. On first start it creates and seeds `backend/database.sqlite`.

**2. Frontend**:

```sh
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (by default `http://localhost:5173`).

The API base URL comes from `VITE_API_BASE_URL` in `frontend/.env.development`; no service hardcodes it.

## Main route

`/` requires a session, like almost the whole app (the only public route is `/login`). Without a session, the router guard automatically redirects to `/login`. The session is a JWT kept in LocalStorage: on reload the guard restores it with `GET /api/auth/profile`, and any `401` clears it and returns to the login view.

## Demo credentials

The backend seeds 3 users on first start (`backend/src/users/users.seeder.ts`):

| Email | Password | Role | Name |
|---|---|---|---|
| `admin@creatorly.com` | `1234` | admin | Camila Torres |
| `laura@creatorly.com` | `1234` | coordinator | Laura Restrepo |
| `sara@creatorly.com` | `1234` | coordinator | Sara Gómez |

The **admin** role is the only one that can access `/creators` and `/users`.

## Reset demo data

Stop the backend, delete `backend/database.sqlite` and start it again: the seeders run whenever a table is empty. There is no longer a button in the interface, because the data no longer lives in the browser.

## Available scripts

Frontend (`cd frontend`):

```sh
npm run dev          # development server (Vite)
npm run build        # production build (includes type-check)
npm run preview      # serves the production build locally
npm run type-check   # vue-tsc: type checking
npm run lint         # oxlint + eslint, both with --fix
npm run format       # prettier over src/
```

Backend (`cd backend`):

```sh
npm run start:dev    # API with watch mode
npm run build        # nest build (also the backend's type check)
npm run lint         # oxlint over src/
npm run format       # prettier over src/
```

## Deployment (GCP)

The whole system runs on a GCP VM with Docker Compose (ADR-0006): `docker-compose.yml` builds the `backend` image (NestJS + SQLite in the `backend-data` volume, port 3000) and the `frontend` image (Vue compiled and served by nginx, port 80). Both Dockerfiles are multi-stage, so `dist/` is built inside Docker and is never committed.

VM requirements: machine type `e2-medium`, firewall rules for TCP ports 80 and 3000, and Docker with the Compose plugin.

```sh
git clone https://github.com/kepabonsaeafit/creatorly.git
cd creatorly
sudo ./deploy.sh <VM_EXTERNAL_IP>
```

`deploy.sh` sets the API URL and CORS for that IP, generates the `JWT_SECRET` once in `.env` (ignored by git) and runs `docker compose up -d --build`. Open `http://<VM_EXTERNAL_IP>` in the browser (HTTP, not HTTPS). To update the deployment, `git pull` and run `deploy.sh` again; the data in the volume is kept.

## To go deeper

- **[AGENTS.md](./AGENTS.md)** — architecture of both projects, API contract, code rules, and AI agent work policy.
- **[CONTEXT.md](./CONTEXT.md)** — official domain glossary.
- **[docs/adr/](./docs/adr/)** — architecture decisions already made, and why.
- **[docs/wiki/](./docs/wiki/)** — project wiki: [Home](./docs/wiki/Home.md), [Deliverable 1](./docs/wiki/Deliverable-1.md) (logo, verbal model, class and architecture diagrams), [Frontend Style Guide](./docs/wiki/Frontend-Style-Guide.md), [Frontend Programming Rules](./docs/wiki/Frontend-Programming-Rules.md), [Screenshots](./docs/wiki/Screenshots.md), [Deliverable 2](./docs/wiki/Deliverable-2.md) (class diagram and the general, frontend and backend architecture diagrams), [Backend Style Guide](./docs/wiki/Backend-Style-Guide.md) and [Backend Programming Rules](./docs/wiki/Backend-Programming-Rules.md).
