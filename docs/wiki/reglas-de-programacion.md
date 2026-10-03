# Programming rules

Essential project rules, by category. If a PR breaks one of them, it gets pointed here. This page is self-contained: it doesn't depend on any other repo file to make sense. When the repo includes `AGENTS.md` (specific instructions for AI agents, not always present on `main`), that file expands on the details of working with agents, but the code rules themselves are the same for anyone writing in this project, whether they use an agent or not.

## General

1. **TypeScript everywhere**: `.ts` files, SFCs with `<script setup lang="ts">`. Explicit types on every function or method parameter and return value; `any` is forbidden without a written justification comment.
2. **DRY** (Don't Repeat Yourself) and **ETC** (Easier to Change): if a second place needs the same thing, extract it into a component/service; write code with change in mind.
3. **Everything in English**: code, identifiers, UI text, comments, and documentation. The only exception is the proper names in the seed data.

## Routes

4. Every route is tied to an SFC view in `views/`; there are no "loose" routes.
5. Paths are lowercase with hyphens (`/orders/create`); route names use dots for variants of the same resource (`orders`, `orders.create`, `orders.edit`).
6. Access is controlled in `router/accessControl.ts` (guard) and `router/admin/adminRoutes.ts` (admin-only routes grouped by access level): a session is required for everything except `/login`, and the `admin` role is required for `/creators` (and its 3 routes) and `/users`.

## Views

7. Views orchestrate: they call services and compose components. **No business logic inside the view.**
8. **Views don't touch stores**: they only talk to services.
9. **No composables**: all logic goes to `services/`.
10. **No chart inside a view**: all Chart.js lives in `components/charts/`.

## Components

11. Every reusable component lives in `components/`, in PascalCase, with typed props via `defineProps<Interface>()` (no runtime prop validation).
12. Components receive data via props and emit events; they don't mutate props.
13. If two pages need the same chart/table/selector, it's a reusable component.
14. Every Chart.js chart is instantiated through `components/charts/BaseChart.vue`; no view or page component imports `chart.js` directly.

## Architecture

15. Each domain entity is split into up to five pieces: `interfaces/` (the shape, no methods; it can also export, alongside the type, the `as const` list it derives from — for example `STATUSES`, `ROLES` — so there's a single source) + `dtos/` (input: derived with `Omit`/`Pick`; filter/aggregation: their own interfaces) + `stores/` (Pinia, only the array, zero logic; exception: `SessionStore`) + `services/` (a class of static methods, all the logic and validations; no module-level constants or standalone functions, everything goes inside the class) + `seeders/` (fake data, typed plain objects). `utils/` holds shared helpers with no access to stores/LocalStorage (date, currency, status, ids). The mold, with `Order` as an example:

```ts
    // interfaces/OrderInterface.ts → THE SHAPE. Only attributes, no methods.
    export interface OrderInterface { id: string; description: string; /* ... */ }

    // dtos/CreateOrderDTO.ts → one derived type per use case, with Omit/Pick.
    export type CreateOrderDTO = Omit<OrderInterface, 'id' | 'createdAt' | 'updatedAt'>;

    // stores/OrderStore.ts → ONLY THE ARRAY. Zero logic.
    export const useOrderStore = defineStore('order', () => {
      const orders = ref<OrderInterface[]>([]);
      return { orders };
    });

    // services/OrderService.ts → ALL THE LOGIC. Class of static methods.
    export class OrderService {
      static getAll(): OrderInterface[] { return useOrderStore().orders; }
      static create(data: CreateOrderDTO): OrderInterface { /* validates, generates id, persists */ }
    }

    // seeders/OrderSeeder.ts → fake data, typed plain objects (not class instances).
    export function seedOrders(brands: BrandInterface[], /* creators, users */): OrderInterface[] {
      return [ /* ... */ ];
    }
```

Entity stores hold only the array, no logic. Exception: `SessionStore`, which also reads the persisted session on creation and derives `current`, `isLoggedIn`, and `isAdmin` with `computed`.

16. **One DTO per use case.** Input DTOs (`Create*`, `Login`) derive from their interface with `Omit`/`Pick`; filter and aggregation DTOs (reports and charts) are their own interfaces, because their shape doesn't come from an entity. Multiple DTOs in one service is fine; one DTO split into two isn't.
17. Ids are generated with `generateId()` (`utils/generateId.ts`), which uses `crypto.randomUUID()` in secure contexts and, otherwise, falls back to `crypto.getRandomValues()` (see ADR-0001). `crypto.randomUUID()` is never called directly; orders reference brand/creator/coordinator **by id**, not with nested objects. Seeders don't call it: their ids are plain strings (`'1'`, `'2'`, ...).

## Data

18. **Nobody touches `localStorage` directly**: always through `storage/StorageService.ts`.
19. LocalStorage keys prefixed with `creatorly_` (`creatorly_users`, `creatorly_orders`, `creatorly_session`…).
20. Fake data seeding only happens if LocalStorage is empty, in `PiniaConfig` (`generate()`/`persist()`). The "Reset demo data" button in `/users` calls `resetDemoData()` from `PiniaConfig`, which seeds exactly the same way, and then the view logs out the session with `AuthService.logout()`.
21. The session **never** stores the user's password.

## Git and PRs

22. No direct pushes to `main`: everything through branch + Pull Request. Push and PR require explicit authorization from the team member who owns that branch; approving and merging to `main` remains the architect's authority, same as installing or updating dependencies.
23. Conventional commits: type in English + description in Spanish (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`), body in bullets of verifiable technical facts — no narration of the process and no messages addressed to a person.
24. Before every commit: `npm run lint`, `npm run format`, and `npm run type-check` clean (if `format` modifies files, those changes go in the same commit). `npm run build` clean before opening the PR.

## How to add a new entity (with or without an AI agent)

The Architecture section's pattern doesn't depend on having an agent apply it for you. To add a new entity by hand, in this order:

1. **`interfaces/NameInterface.ts`** — only the attributes, no methods. First check if an equivalent piece already exists for another entity and copy its shape.
2. **`dtos/CreateNameDTO.ts`** — an `Omit`/`Pick` over the interface, one per use case; if you need a filter or aggregation DTO (reports, charts), it's its own interface, because its shape doesn't come from the entity.
3. **`stores/NameStore.ts`** — only the array's `ref`. Don't add logic here, not even "for now."
4. **`services/NameService.ts`** — this is where the validations and all the logic go (`getAll`, `getById`, `create`, `update`, `remove`, and whatever domain-specific methods you need).
5. If the entity needs seed data, **`seeders/NameSeeder.ts`** — a function that builds and returns typed plain objects without reading or modifying external state (stores, LocalStorage), never class instances. Not pure in the strict sense: it generates random ids with `generateId()`.
6. Before saving: the file carries your name in the first line as a comment, imports are grouped (`// external imports` / `// internal imports`) and alphabetized within each group.
7. Before committing, run `npm run lint`, `npm run format`, and `npm run type-check` — all three clean (if `format` modifies files, those changes go in the same commit). Run `npm run build` clean before requesting review or opening the PR.
8. The acceptance criterion isn't "it compiles": it's that you can explain every file you created in the individual defense, unassisted. If you can't explain why something ended up where it did, review it before committing, not after.
