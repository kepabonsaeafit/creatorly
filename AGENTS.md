# AGENTS.md — Instructions for AI agents in Creatorly

> Shared file, committed at the repo root. Any agent that assists **any of the 3 members of Team 7** (Kevin Pabón, Felipe Gómez, Gerónimo Montes) reads it on startup — regardless of whether that person uses AI agents regularly or not. `CLAUDE.md` is just an import of this file (`@AGENTS.md`); editing this one doesn't require touching `CLAUDE.md`.

## 1. What this file is and who it's for

This file is the **mandatory floor for any agent working in this repo, not the ceiling**. Each team member can also keep their own personal instructions file (for example, Kevin's `CLAUDE.local.md`, excluded from the repo via `.git/info/exclude`) with their own preferences for working with their agent: their pace, their review cadence, their own log. A personal file can **add stricter rules**, never contradict or loosen a rule from this file. If a personal file and this one ever contradict each other, **this one wins**.

Nothing in this file assumes whether Kevin, Felipe, or Gerónimo use an AI agent for their part of the project, nor does it assume it differently between them. The rules below apply equally in any case.

## 2. The project in 30 seconds

**Creatorly** is a dashboard for running a UGC creator agency: a **Creators** catalog, client **Brands**, and the **Orders** that connect them, managed by internal **Users** (admin or coordinator). It has two projects in one repository:

- **Frontend** — SPA in Vue 3 + Vite + TypeScript, at the **repository root** (`src/`).
- **Backend** — REST API in NestJS 12 + TypeORM + **SQLite**, in **`backend/`**. It owns the database, the seeders and the JWT login (ADR-0005).

The frontend has no data of its own anymore: it reads and writes everything through the backend API (section 9). The official domain glossary is in `CONTEXT.md`; architecture decisions already made live in `docs/adr/`.

## 3. Sources of truth, in reading order

1. **This file** — mandatory code rules and rules for working with agents.
2. **The professor's reference project** — https://github.com/danielgara/courseprojects-2026 (`backend/` and `frontend/`). The professor grades against **his** style: structure, file names, method names, decorators, how services call the API. **Before writing a file, open the professor's equivalent and mirror it.** When this file and the professor's project seem to disagree on style, ask the team member instead of choosing.
3. **`CONTEXT.md`** — domain glossary.
4. **`docs/adr/`** — architecture decisions already made, and why. ADR-0005 is the one that rules Deliverable 1 Part 2.
5. **The code** — if something here doesn't match what's in `src/` or `backend/src/`, the code wins and this file is out of date; report it instead of assuming.

## 4. Language: English, everywhere

The professor corrected this in the previous deliverable, and it is not negotiable. **Everything is written in English**: identifiers, file and folder names, comments, JSDoc, UI text, toast and error messages, API routes, entity and column names, seed data labels, `README`, wiki, ADRs, `CONTEXT.md` and this file.

The **only** exception is the description part of a commit message, which stays in Spanish (`feat: agrega guard de rutas admin`) — ADR-0002, section 13. Personal names in seed data (`Camila Torres`) are names, not text, and stay as they are.

## 5. Team split and scope of an agent

Deliverable 1 Part 2 is split by area so that each member's work is their own and visible in the history:

| Member | Area | What it covers |
|---|---|---|
| **Felipe Gómez** | Backend base (done) | NestJS scaffold, TypeORM, first `users` module and seeder (merged in `714fd5f`). Reviewer of backend PRs. |
| **Kevin Pabón** | Backend + architecture | Aligning the backend to the professor's style, the `users`, `creators`, `brands`, `orders` resources, the `auth` module, `AGENTS.md` and ADRs. Approves and merges every PR. |
| **Gerónimo Montes** | Frontend integration | Everything in `src/`: removing seeders and entity stores, services over axios, views loading from the API, login with JWT, frontend part of `README` and wiki. |

An agent works **only within the branch and area of the team member it assists**. It doesn't touch, "fix," or rewrite another team member's code or area on its own initiative, even if the change looks obviously correct or the other person's code is incomplete — that goes through PR and review, just like any other change to `main`, with no exception for unfinished code or for the author not currently using AI. The barrier is the PR, not whether there's a human or an agent on the other side of the change. The API contract in section 9 is what lets frontend and backend move in parallel without touching each other.

## 6. Commands

Requirement: **Node 22+** (enforced by `engines` in `package.json`). `npm install` in either project requires explicit authorization from Kevin — see section 13.

**Frontend** (repository root):

```sh
npm run dev         # development server (Vite), http://localhost:5173
npm run lint        # oxlint + eslint, both with --fix
npm run format      # prettier over src/
npm run type-check  # vue-tsc: type checking
npm run build       # production build (includes type-check)
```

The API base URL comes from `VITE_API_BASE_URL` (e.g. `http://localhost:3000`), never hardcoded in a service.

**Backend** (`cd backend`):

```sh
npm run start:dev   # API with watch mode, http://localhost:3000/api
npm run lint        # oxlint over src/
npm run format      # prettier over src/
npm run build       # nest build (it is also the backend's type check)
```

The database is the file `backend/database.sqlite`, created and seeded on first start and ignored by git. To reset the demo data, stop the server, delete that file and start again.

**Deployment** (repository root, on the GCP VM — ADR-0006):

```sh
sudo ./deploy.sh <VM_EXTERNAL_IP>   # docker compose up -d --build with the VM's API URL and CORS
```

`dist/` is never committed in either project: the multi-stage `Dockerfile` (root, frontend) and `backend/Dockerfile` build it inside Docker. `VITE_API_BASE_URL` reaches the frontend image as a build argument; `JWT_SECRET` lives only in the VM's `.env`.

## 7. Frontend architecture

Each domain entity uses up to four pieces in the frontend. This is the mold the professor audits:

```ts
// interfaces/OrderInterface.ts → THE SHAPE the API returns. Only attributes, no methods.
export interface OrderInterface { id: number; description: string; /* ... */ }

// dtos/Orders/CreateOrderDTO.ts → one derived type per use case, with Omit/Pick.
export type CreateOrderDTO = Omit<OrderInterface, 'id' | 'createdAt' | 'updatedAt'>;

// services/OrderService.ts → class of static methods; talks to the API with axios.
export class OrderService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;

  static async getAll(): Promise<OrderInterface[]> {
    const { data } = await axios.get(this.API_URL);
    return data;
  }
}

// views/Orders/OrdersIndexView.vue → loads in onMounted and keeps the result in a ref.
const orders = ref<OrderInterface[]>([]);
onMounted(async () => {
  orders.value = await OrderService.getAll();
});
```

- **`interfaces/`** holds only the four entity interfaces (`User`, `Creator`, `Brand`, `Order`) with **`id: number`** and the `brandId` / `creatorId` / `userId` references as numbers. `UserInterface` has **no `password`**: the API never returns it; `CreateUserDTO` adds it. An `interfaces/` file can export, alongside its type, the `as const` list that type derives from (`STATUSES` in `OrderInterface.ts`, `ROLES` in `UserInterface.ts`) — the single source for those values in the frontend. Any other supporting type (props, a table column, a nav link, a report option) is declared in the file that uses it, or exported from the service that produces it — never as a new file in `interfaces/`.
- **`dtos/`** and **`views/`** are grouped in one folder per entity or area (`Creators/`, `Orders/`, `Users/`, `Reports/`, `Auth/`, plus `Brands/` in `dtos/`); `HomeView` stays at the root of `views/`.
- **`services/`**: `AuthService`, `BrandService`, `CreatorService`, `OrderService`, `UserService`. CRUD methods keep their names (`getAll`, `getById`, `create`, `update`, `remove`), become `async` and return `Promise<T>`. Filters and chart aggregations (`filter`, `getOrdersByStatus`, `getStats`, ...) stay as **pure static methods** over arrays already fetched from the API. Business validations live in the **backend** service; the frontend doesn't duplicate them — forms use HTML attributes (`required`, `min`) and show the backend's error message in a toast. No module-level constants or standalone functions in a service: everything goes inside the class (`private static`).
- **`stores/`**: only **`SessionStore`** remains (token and current user). Entity stores and **`seeders/` no longer exist** in the frontend. `PiniaConfig.ts` follows the professor's shape: `export default class PiniaConfig { public static init(): Pinia }`.
- **`storage/StorageService.ts`** remains only to persist the session token: nobody touches `localStorage` directly.
- **`utils/`**: shared helpers with no access to stores, storage or the API (`chartColors`, `confirmDeletion`, `email`, `formatCurrency`, `formatDate`, `labels`). `generateId` is removed: the database generates ids.

While the frontend migration is in progress, `src/` may still contain Deliverable 1 stores and seeders: don't add new code on top of them.

## 8. Backend architecture

The backend copies the professor's `backend/` structure. One folder per resource, file names in **kebab-case**, one class per file:

```
backend/src/
  main.ts                 → CORS + app.setGlobalPrefix('api'), as the professor's
  app.module.ts           → TypeOrmModule.forRoot({ type: 'better-sqlite3', ... }) + resource modules
  home/                   → home.module.ts, home.controller.ts ("API is running")
  auth/                   → auth.module.ts, auth.controller.ts, auth.service.ts, auth.guard.ts,
                            roles.guard.ts, roles.decorator.ts, public.decorator.ts, constants.ts,
                            dto/sign-in.dto.ts
  orders/                 → orders.module.ts, orders.controller.ts, orders.service.ts, orders.seeder.ts,
                            entities/order.entity.ts, dto/create-order.dto.ts
  users/ creators/ brands/ → same shape as orders/
```

```ts
// orders/entities/order.entity.ts → THE TABLE. Singular class name, no suffix.
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brandId' })
  brand: Relation<Brand>;

  @RelationId((order: Order) => order.brand)
  brandId: number;
}

// orders/dto/create-order.dto.ts → plain class, no decorators. Class name ends in "Dto".
export class CreateOrderDto {
  description: string;
  brandId: number;
}

// orders/orders.service.ts → ALL THE LOGIC. Injectable, instance methods, repository injected.
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }
}

// orders/orders.controller.ts → ONLY ROUTING. Converts the :id param with Number(id).
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order | null> {
    return this.ordersService.findOne(Number(id));
  }
}
```

- **Method names** in services and controllers: `findAll`, `findOne(id)`, `create(dto)`, `update(id, dto)`, `remove(id)`, as the professor's `BooksService`. Extra lookups are named the same way (`findByEmail`).
- **Ids** are numeric and generated by the database (`@PrimaryGeneratedColumn()`), never by code.
- **Relations** use `@ManyToOne` + `@JoinColumn` + `@RelationId`, like the professor's `Review` → `Book`, so the JSON keeps `brandId`, `creatorId` and `userId`.
- **Column types valid in SQLite**: `simple-enum` (never `enum`), `boolean`, `varchar` with `nullable: true` for optional values (`string | null`), `CreateDateColumn` / `UpdateDateColumn` for `createdAt` / `updatedAt`. Day-only dates (`requestDate`, `deliveryDate`) are `varchar` with `YYYY-MM-DD`.
- The `as const` lists (`STATUSES`, `ROLES`) are exported from the entity file that uses them.
- **DTOs**: one `Create*Dto` class per resource in `dto/`; updates receive `Partial<Create*Dto>`, no second class.
- **Validations** live in the service, in a `private validate(dto)` method, and throw `BadRequestException`; a missing id on `update` / `remove` throws `NotFoundException`. No `class-validator`, no `ValidationPipe`.
- **Passwords** are stored as a bcrypt hash in `passwordHash` with `@Column({ select: false })`, and are never returned by the API.
- **Seeders**: one `*.seeder.ts` per module, an `@Injectable()` that inserts the demo data only when its table is empty. `users`, `creators` and `brands` seed in `onModuleInit`; `orders` seeds in `onApplicationBootstrap`, so the rows it references already exist.
- **Login** follows https://docs.nestjs.com/security/authentication: `AuthService.signIn`, `JwtModule.register({ global: true, ... })`, a global `AuthGuard` (`APP_GUARD`), `@Public()` for `POST auth/login`, and `@Roles('admin')` + `RolesGuard` for admin-only routes (NestJS authorization guide).
- **The logged-in user** is read in a controller with `@Request() request: AuthenticatedRequest` (exported from `auth/auth.guard.ts`) and passed to the service as `request.user.sub`; the token payload type is `JwtPayload` (`{ sub, email, role }`, exported from `auth/auth.service.ts`).
- **Write-side objects are built field by field** in the service (never `repository.create(dto)` straight from the body), so a request can't inject `id` or `passwordHash`; after saving, the entity is reloaded with `findOneByOrFail` so the response carries the relation ids and never the hash.
- **Imports** between backend files use the `.js` extension (`'./orders.service.js'`), because the project is ESM.

## 9. API contract

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

## 10. Code rules (mandatory in everything you produce, frontend and backend)

1. **TypeScript everywhere**: `.ts` files, SFCs with `<script setup lang="ts">`. No new `.js`.
2. **Explicit types** on every function or method parameter and return value. `any` is forbidden without a written justification comment.
3. One route → one SFC view in `views/`; reusable components in `components/` (PascalCase). **No composables**: logic goes to `services/`.
4. **Nobody touches `localStorage` directly**: always through `storage/StorageService.ts`.
5. **Views don't touch stores** (except reading the session through `AuthService`): they only talk to services. **Controllers don't hold logic**: they only call their service.
6. **One DTO per use case**: frontend input DTOs (`Create*`, `Login`) derive from their interface with `Omit`/`Pick`; filter and aggregation DTOs (reports and charts) are their own interfaces. Backend DTOs are plain classes in `dto/`.
7. Ids are generated by the database. Nobody generates ids in code; orders reference brand/creator/coordinator **by id**.
8. **No chart inside a view**: all Chart.js lives in `components/charts/` (ADR-0003) — an explicit criterion of the professor's rubric.
9. Styles: brand variables from `src/assets/base.css`; no magic colors.
10. **DRY and ETC**: extract components/services before duplicating; write code that's easy to change. Don't add files, dependencies or layers the professor's project doesn't have unless a rule here asks for them.

## 11. File conventions (the professor reviews these in the defense)

They apply to **both projects**. Each project keeps its own Prettier config: the frontend has no semicolons, the backend uses them (as the professor's) — run `npm run format` in the project you touched and don't fight it.

**Header:** first line of every file, comment `// Author: Name` with the name of whoever wrote it — the author can be any of the 3 team members, don't assume it's always the same one. Editing someone else's file doesn't change its header.

**Grouped imports, alphabetical within each group:**

```ts
// Author: Name of whoever writes the file

// external imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// internal imports
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';
```

**Sections inside views and components** (the professor explicitly asks about selectors and computed variables), in this order:

```ts
// props
// emits
// selectors
// non-reactive variables
// reactive variables
// computed variables
// watchers
// functions
```

`// selectors` is only for variables bound with `v-model` to a `<select>`; any other reactive variable (text fields, dates, numbers, flags like `error`/`saving`, lists loaded from the API) goes under `// reactive variables`. `// non-reactive variables` holds what never changes or isn't reactive: constants, `useRouter()`/`useRoute()`/`useToast()` and plain `let` variables. `onMounted(...)` goes under `// functions`. A file only carries the sections that apply to it.

**Related functions go together**, and services are spaced with blank lines between validation, building, persistence and `return`, so the code can breathe.

**JSDoc in services:** every public (non-`private`) method of a frontend or backend service carries a short JSDoc in English, with `@param` per parameter, `@returns` if not `void`, and `@throws` when the method (or its `validate()`) throws.

**Unambiguous names.** No `d`, `p`, `i`, `data`, `temp` (the professor's `const { data } = await axios...` destructuring is the only accepted `data`). In callbacks: `(order) =>`, not `(o) =>`.

## 12. How an agent must work in this repo

Helping isn't generating and pasting. Any agent assisting a team member in this repo must, on every task:

1. **Read the professor's equivalent file first** (section 3) and the relevant ADR, then write.
2. **Explain what changed and why**, in terms the team member can repeat without the agent present.
3. **Be able to be questioned about a design decision** and give a real reason — "because the agent did it that way" isn't a valid answer in the defense.
4. **Before proposing a commit, run `npm run lint`, `npm run format`, and the type check (`npm run type-check` in the frontend, `npm run build` in the backend) clean** in every project the commit touches (if `format` modifies files, those changes go in the same commit); **`npm run build` clean in both projects before opening the PR**.
5. When the change touches the API, **start the backend and exercise the route** (and the screen that uses it), not only compile.
6. Remember the acceptance criterion isn't "it compiles": it's that **the person can defend that code in their individual grade**, which multiplies the team's grade.

## 13. Git policy

- ✅ **Local commits allowed** (on branch, never directly on `main`).
- ✅ **Commits carry the identity of the team member the agent works for** (`git config user.name` / `user.email` of that person, local to the repo), never the agent's default identity: participation is graded from the history.
- ✅ **Before any commit:** lint, format and type check clean (section 12). **Do not commit with red lint or type errors.**
- **Commits:** type in English + description in Spanish (`feat: agrega guard de rutas admin`), scope optional (`feat(backend): ...`). Body in short bullets, only verifiable technical facts — what was created/deleted/moved, a design decision with its reason, a verification line. **Filter before proposing any commit: if a sentence describes the code, it stays; if it describes the conversation or addresses a person ("confirmed with X", "from this commit on the team can..."), it goes.**
- ❌ **Push, creating a PR and merging (even locally between branches): require explicit, written authorization from the team member the agent is working for**, requested before executing and valid only for the action it names. The environment showing a permissions dialog and the person clicking "allow" is not authorization.
- ❌ **Approving and merging a PR to `main`: always Kevin**, as the team's architect — authority granted by the course syllabus (see ADR-0002).
- ❌ **Installing, removing or updating dependencies (`package.json`/`package-lock.json` of either project): explicit, prior authorization from Kevin**, regardless of which branch needs it.
- ⛔ Never `push --force`, never touch `main` directly, never rewrite already-published history.
- When finishing a task: list the files touched and ask in writing for authorization for what comes next (push/PR).

## 14. Maintaining this file

A change to this file follows the same flow as any other file in the repo: branch + Pull Request, with Kevin's approval as architect. When a decision changes a rule here (a new folder, a new dependency, a new convention), this file is updated **in the same PR** as the code, so no agent works with outdated rules.

To add a new ADR in `docs/adr/`: it's justified when the decision is hard to reverse, would be surprising without the written context, and has a real trade-off someone else could question in the defense. A new ADR also goes through a PR.
