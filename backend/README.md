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

Optional environment variables: `PORT` (default `3000`), `SQLITE_PATH` (default `database.sqlite`), `CORS_ORIGIN` (comma-separated list; default `http://localhost:5173`, `http://localhost`, `http://127.0.0.1`) and `JWT_SECRET` (secret that signs the access tokens; the default is for local development only, production must set its own long random value).

## Database

The database is the file `backend/database.sqlite`. It is created and seeded with demo data on the first start, and it is ignored by git. To reset the demo data, stop the server, delete `database.sqlite` and start it again.

## Authentication

Login follows the NestJS JWT guide (https://docs.nestjs.com/security/authentication):

1. `POST /api/auth/login` with `{ "email": "...", "password": "..." }` returns `{ "access_token": "..." }` (401 `Invalid credentials` otherwise).
2. Every other request sends the header `Authorization: Bearer <access_token>`; without a valid token the API answers 401. Only `POST /api/auth/login` and `GET /api` are public.
3. Tokens last 1 hour; after that, log in again.

`GET /api/auth/profile` returns the logged-in user. Creating, editing and deleting users (`POST`, `PATCH`, `DELETE /api/users`) is admin-only (403 for a coordinator); an admin can't remove their own admin role or delete themselves (400).

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
