# Creatorly

Internal dashboard (SPA) for a UGC content agency to manage its daily operation: the **Creators** catalog, the **Brands** that request content, and the **Orders** that connect both, with budget and status tracking.

There's no backend: the "database" is the browser's **LocalStorage**, seeded with fake data on first launch.

## Stack

- **Vue 3** + `<script setup lang="ts">` in every component
- **TypeScript** across all of `src/`
- **Vite** as bundler and dev server
- **Pinia** for state (only each entity's array/state, no logic)
- **Vue Router** with access guards
- **Chart.js** for the Reports and Orders charts
- **vue-toastification** for success/error notifications

## How to run the project

Requires **Node `^22.18.0 || >=24.12.0`** (the exact range enforced by `engines` in `package.json`; Node 23.x, for example, doesn't satisfy it).

```sh
npm install
npm run dev
```

Open the URL Vite prints (by default `http://localhost:5173`).

## Main route

`/` requires a session, like almost the whole app (the only public route is `/login`). Without a session, the router guard automatically redirects to `/login`.

## Demo credentials

The seed data includes 3 users (`src/seeders/UserSeeder.ts`):

| Email | Password | Role | Name |
|---|---|---|---|
| `admin@creatorly.com` | `1234` | admin | Camila Torres |
| `laura@creatorly.com` | `1234` | coordinator | Laura Restrepo |
| `sara@creatorly.com` | `1234` | coordinator | Sara Gómez |

The **admin** role is the only one that can access `/creators` and `/users`.

## Reset demo data

In `/users` (admin only), "Demo data" section → **Reset demo data** button: erases everything stored in LocalStorage, re-seeds the initial fake data, and logs out the current session (the new seed generates users with different ids than the previous session's).

## Available scripts

```sh
npm run dev          # development server (Vite)
npm run build        # production build (includes type-check)
npm run preview      # serves the production build locally
npm run type-check   # vue-tsc: type checking
npm run lint         # oxlint + eslint, both with --fix
npm run format       # prettier over src/
```

## To go deeper

- **[AGENTS.md](./AGENTS.md)** — project architecture (5-piece pattern per entity), code rules, and AI agent work policy.
- **[CONTEXT.md](./CONTEXT.md)** — official domain glossary.
- **[docs/adr/](./docs/adr/)** — architecture decisions already made, and why.
