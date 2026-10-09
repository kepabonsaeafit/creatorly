# Creatorly API

REST API for Creatorly, built with NestJS 12, TypeORM and SQLite (`better-sqlite3`). It owns the database, the demo seed data and the login. The Vue frontend lives in `frontend/`, next to this folder, and talks to this API.

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

Base URL: `http://localhost:3000/api`. Every route except `POST /auth/login` requires `Authorization: Bearer <access_token>`. Errors use NestJS's default body `{ statusCode, message, error }`; the frontend shows `message`.

| Method | Route | Body | Returns | Who |
|---|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ access_token }` | public |
| GET | `/auth/profile` | — | current `User` | logged in |
| GET | `/users`, `/users/:id` | — | `User[]`, `User \| null` | logged in |
| POST | `/users` | `CreateUserDto` (with `password`) | `User` | admin |
| PATCH | `/users/:id` | `Partial<CreateUserDto>` | `User` | admin |
| DELETE | `/users/:id` | — | `void` | admin |
| GET | `/creators`, `/creators/:id` | — | `Creator[]`, `Creator \| null` | logged in |
| POST · PATCH · DELETE | `/creators`, `/creators/:id` | as users | as users | logged in |
| GET | `/brands`, `/brands/:id` | — | `Brand[]`, `Brand \| null` | logged in |
| POST | `/brands` | `CreateBrandDto` | `Brand` | logged in |
| GET | `/orders`, `/orders/:id` | — | `Order[]`, `Order \| null` | logged in |
| POST · PATCH · DELETE | `/orders`, `/orders/:id` | as users | as users | logged in |

Domain rules enforced by the backend (moved from the Deliverable 1 frontend services): required fields, email format, `rate` and `budget` ≥ 0, valid `status` and `role`; an admin can't remove their own admin role or delete themselves; a user or brand with orders can't be deleted (400); deleting a creator sets `creatorId` to `null` in its orders. Referencing a `brandId`, `creatorId` or `userId` that doesn't exist is a 400 (`Order: brand not found`, ...), never a 500. Demo login: `admin@creatorly.com` / `1234` (admin), `laura@creatorly.com` / `1234` (coordinator).

Session in the frontend: after login, keep `access_token` through `StorageService`, send it on every request (header `Authorization: Bearer <token>`, set once in `AuthService` on `axios.defaults.headers.common`), and load the current user with `GET /auth/profile`. The token lasts 1 hour and carries the role at login time: on any 401 the frontend clears the token and goes to the login view.
