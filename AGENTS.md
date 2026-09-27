# AGENTS.md — Instructions for AI agents in Creatorly

> Shared file, committed at the repo root. Any agent that assists **any of the 3 members of Team 7** (Kevin Pabón, Felipe Gómez, Gerónimo Montes) reads it on startup — regardless of whether that person uses AI agents regularly or not. `CLAUDE.md` is just an import of this file (`@AGENTS.md`); editing this one doesn't require touching `CLAUDE.md`.

## 1. What this file is and who it's for

This file is the **mandatory floor for any agent working in this repo, not the ceiling**. Each team member can also keep their own personal instructions file (for example, Kevin's `CLAUDE.local.md`, excluded from the repo via `.git/info/exclude`) with their own preferences for working with their agent: their pace, their review cadence, their own log. A personal file can **add stricter rules**, never contradict or loosen a rule from this file. If a personal file and this one ever contradict each other, **this one wins**.

Nothing in this file assumes whether Kevin, Felipe, or Gerónimo use an AI agent for their part of the project, nor does it assume it differently between them. The rules below apply equally in any case.

## 2. The project in 30 seconds

**Creatorly** is a SPA dashboard (Vue 3 + Vite + TypeScript) for running a UGC creator agency: a **Creators** catalog, client **Brands**, and the **Orders** that connect them. The "database" is the browser's LocalStorage with seed data. The official domain glossary is in `CONTEXT.md` — use it to talk about the domain unambiguously; architecture decisions already made live in `docs/adr/`.

## 3. Sources of truth, in reading order

1. **This file** — mandatory code rules and rules for working with agents.
2. **`CONTEXT.md`** — domain glossary.
3. **`docs/adr/`** — architecture decisions already made, and why.
4. **The code** — if something here doesn't match what's in `src/`, the code wins and this file is out of date; report it instead of assuming.

## 4. Commands

```sh
npm install         # requires explicit authorization from Kevin — see section 10
npm run dev         # development server (Vite)
npm run lint        # oxlint + eslint, both with --fix
npm run format      # prettier over src/
npm run type-check  # vue-tsc: type checking
npm run build       # production build (includes type-check)
```

Requirement: **Node 22+** (enforced by `engines` in `package.json`).

## 5. Architecture: the five pieces of the pattern

Each domain entity is split into up to five files. This is the full mold — non-negotiable, the one the professor audits:

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

Today the real project has 12 `interfaces/`, 12 `dtos/`, 5 `stores/`, 5 `services/`, and 4 `seeders/` — one per entity (`User`, `Creator`, `Brand`, `Order`), except that `OrderSeeder` receives the other three already-seeded collections as parameters, to reference them by id (see ADR-0001), and that `services/` adds `AuthService` on top of the four per-entity ones. Of the 12 interfaces, 4 are entity interfaces and the remaining 8 are supporting types: `HomeStatInterface` and `OrderActivityInterface` are Home data shapes (the first one, also of Reports); the other six came from views and components that declared them loosely (`StorageInterface`, `LoginResultInterface`, `ReportTableColumnInterface`, `ReportInterface`, `NavLinkInterface`, `OrderSeedDataInterface`) and cover storage, login, the reports table, report types, navigation, and order seeding. `StorageService` lives in `src/storage/`, as a persistence layer, outside `services/`. Validations (budget ≥ 0, valid status, email format, required fields) always live in the service, never in the interface, and no module-level constants or standalone functions in a service: everything goes inside the class (`private static`). An `interfaces/` file can export, alongside its type, the `as const` list that type derives from (`STATUSES` in `OrderInterface.ts`, `ROLES` in `UserInterface.ts`) — it's the single source for those values, and services/views/components import it from there instead of declaring their own copy. Before creating a new file, check whether one of these five pieces already exists for the entity you need — the pattern is reused, not reinvented per page.

**`utils/`** is the sixth piece the professor's rubric explicitly mentions (ADR-0004: *"interfaces/, dtos/, stores/, services/, utils/"*). Today it has 7 files: `chartColors.ts`, `confirmDeletion.ts`, `email.ts`, `formatCurrency.ts`, `formatDate.ts`, `generateId.ts`, and `labels.ts`. They are shared helpers with no access to stores or LocalStorage, reused by more than one view or component.

## 6. Code rules (mandatory in everything you produce)

1. **TypeScript everywhere**: `.ts` files, SFCs with `<script setup lang="ts">`. No new `.js`.
2. **Explicit types** on every function or method parameter and return value. `any` is forbidden without a written justification comment.
3. One route → one SFC view in `views/`; reusable components in `components/` (PascalCase). **No composables**: logic goes to `services/`.
4. **Nobody touches `localStorage` directly**: always through `storage/StorageService.ts` (ADR-0001).
5. **Views don't touch stores**: they only talk to services.
6. **One DTO per use case**: input DTOs (`Create*`, `Login`) derive from their interface with `Omit`/`Pick`; filter and aggregation DTOs (reports and charts) are their own interfaces, because their shape doesn't come from an entity. Multiple DTOs in one service is fine; one DTO split into two isn't.
7. Ids are generated with `generateId()` (`utils/generateId.ts`), which uses `crypto.randomUUID()` in secure contexts and, otherwise, falls back to `crypto.getRandomValues()` (see ADR-0001). `crypto.randomUUID()` is never called directly; orders reference brand/creator/coordinator **by id**.
8. **No chart inside a view**: all Chart.js lives in `components/charts/` (ADR-0003) — this is also an explicit criterion of the professor's rubric, not a style preference.
9. Styles: brand variables from `src/assets/base.css`; no magic colors.
10. **DRY and ETC**: extract components/services before duplicating; write code that's easy to change.

The commit message convention lives in section 10 (Git policy), not here — it's a process rule, not a code rule.

## 7. File conventions (the professor reviews these in the defense)

**Header:** first line of every file, comment `// Author: Name` with the name of whoever wrote it — the author can be any of the 3 team members, don't assume it's always the same one.

**Grouped imports, alphabetical within each group:**

```ts
// Author: Name of whoever writes the file

// external imports
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// internal imports
import type { OrderInterface } from '@/interfaces/OrderInterface';
import { OrderService } from '@/services/OrderService';
```

**Sections inside views and components** (the professor explicitly asks about selectors and computed variables), in this order:

```ts
// props
// emits
// selectors
// reactive variables
// computed variables
// watchers
// functions
```

`// selectors` is only for variables bound with `v-model` to a `<select>`; any other reactive variable (text fields, dates, numbers, flags like `error`/`saving`) goes under `// reactive variables`. `// props` goes above `defineProps`/`interface Props`, `// emits` above `defineEmits`, and `// watchers` above each `watch(...)`. A file only carries the sections that apply to it: if it has no `<select>`, no `// selectors`; if it receives no props, no `// props`; and so on for the rest.

**JSDoc in services:** every public (non-`private`) method of a service carries a short JSDoc in English, with `@param` per parameter, `@returns` if not `void`, and `@throws` when the method (or its `validate()`) throws an `Error`.

**Unambiguous names.** No `d`, `p`, `i`, `data`, `temp`. In callbacks: `(order) =>`, not `(o) =>`.

## 8. How an agent must work in this repo

Helping isn't generating and pasting. Any agent assisting a team member in this repo must, on every task:

1. **Explain what changed and why**, in terms the team member can repeat without the agent present.
2. **Be able to be questioned about a design decision** and give a real reason — "because the agent did it that way" isn't a valid answer in the defense.
3. **Before proposing a commit, run `npm run lint`, `npm run format`, and `npm run type-check` clean** (if `format` modifies files, those changes go in the same commit); **`npm run build` clean before opening the PR** — not after, not "we'll fix it in the next one."
4. Remember the acceptance criterion isn't "it compiles": it's that **the person can defend that code in their individual grade**, which multiplies the team's grade. An agent that doesn't leave its team member in that position hasn't finished the task, even if the build passes.

## 9. Scope of an agent: what it can and can't touch

An agent working in this repo operates **only within the branch and scope of the team member it assists**. It doesn't touch, "fix," or rewrite another team member's code on its own initiative, even if the change looks obviously correct or the other person's code is incomplete — that goes through PR and review, just like any other change to `main`, with no exception for unfinished code or for the author not currently using AI. The barrier is the PR, not whether there's a human or an agent on the other side of the change.

## 10. Git policy

- ✅ **Local commits allowed** (on branch, never directly on `main`).
- ✅ **Before any commit:** run `npm run lint`, `npm run format`, and `npm run type-check`. If `format` modifies files, those changes are included in the same commit. **Do not commit with red lint or type errors.**
- **Commits:** type in English + description in Spanish (`feat: agrega guard de rutas admin`). Body in short bullets, only verifiable technical facts — what was created/deleted/moved, a design decision with its reason, a verification line. **Filter before proposing any commit: if a sentence describes the code, it stays; if it describes the conversation or addresses a person ("confirmed with X", "from this commit on the team can..."), it goes.** That lives in the team's separate communication, never in the commit message.
- ❌ **Push and creating a PR: require explicit, written authorization from the team member the agent is working for**, requested before executing. The environment showing a permissions dialog and the person clicking "allow" is not authorization: the agent must have requested it beforehand, in text, as part of its task.
- ❌ **Approving and merging a PR to `main`: always Kevin**, as the team's architect — authority granted by the course syllabus (see ADR-0002). This doesn't change based on who does or doesn't use an agent.
- ❌ **Installing or updating dependencies (`package.json`/`package-lock.json`): explicit, prior authorization from Kevin**, regardless of which branch needs it. A new dependency affects the build for all 3 team members, not just the branch that requests it — it carries the weight of a merge to `main`, not of a push to one's own branch.
- ⛔ Never `push --force`, never touch `main` directly, never rewrite already-published history.
- When finishing a task: list the files touched and ask in writing for authorization for what comes next (push/PR).

## 11. Maintaining this file

A change to this file follows the same flow as any other file in the repo: branch + Pull Request, with Kevin's approval as architect — it isn't edited directly, even if whoever proposes it is sure it's needed.

To add a new ADR in `docs/adr/`: it's justified when the decision meets the usual three criteria — it's hard to reverse, it would be surprising without the written context, and there's a real trade-off someone else could question in the defense. A new ADR also goes through a PR.
