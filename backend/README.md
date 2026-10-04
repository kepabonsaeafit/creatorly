# Creatorly API

REST API for Creatorly, built with NestJS 12, TypeORM and SQLite (`better-sqlite3`). It owns the database, the demo seed data and the login. The Vue frontend lives at the repository root and talks to this API.

## Requirements

- Node 22+

## Getting started

```sh
cd backend
npm install
npm run start:dev
```

The API runs at http://localhost:3000/api (`GET /api` returns `API is running`).

Optional environment variables: `PORT` (default `3000`), `SQLITE_PATH` (default `database.sqlite`) and `CORS_ORIGIN` (comma-separated list; default `http://localhost:5173`, `http://localhost`, `http://127.0.0.1`).

## Database

The database is the file `backend/database.sqlite`. It is created and seeded with demo data on the first start, and it is ignored by git. To reset the demo data, stop the server, delete `database.sqlite` and start it again.

## Demo login

| Email | Password | Role |
|---|---|---|
| `admin@creatorly.com` | `1234` | admin |
| `laura@creatorly.com` | `1234` | coordinator |
| `sara@creatorly.com` | `1234` | coordinator |

## Other scripts

```sh
npm run lint     # oxlint over src/
npm run format   # prettier over src/
npm run build    # nest build (also the type check)
```

## API contract

See `AGENTS.md` section 9 at the repository root.
