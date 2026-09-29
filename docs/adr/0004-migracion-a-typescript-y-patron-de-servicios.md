# ADR-0004: Migration to TypeScript and the interfaces + stores + services pattern

- **Date:** 2026-09-02
- **Status:** Accepted
- **Decided by:** Kevin Pabón (architect)

## Context

Creatorly was built in JavaScript with a model-class architecture: each entity (`User`, `Creator`, `Brand`, `Order`) was a class that carried its shape, its validations, and its static CRUD all at once, reading and writing directly against `services/storage.js`. Types were documented with JSDoc.

That decision was made reading the "Deliverable 1 Part 1 - Base" assignment, which doesn't mention TypeScript, DTOs, interfaces, or a specific folder structure. It only asks for Vue 3, LocalStorage, pages, CRUDs, and Chart.js.

On 2026-09-01 another team in the course presented their project and the professor shared the grading rubric. The rubric lists, as gradable items: **Store, DTOs, Interfaces, Services, Views, Components, Utils**. During the defense the professor reviewed file by file the typing, the import order, variable naming, and where the charts lived.

Reviewing the course tutorials (`desarrollo-web-tutoriales`), it was confirmed that:

- They're written in TypeScript with `tsconfig` and `vue-tsc`.
- Their `src/` contains exactly `interfaces/`, `dtos/`, `stores/`, `services/`, `utils/`, `components/`, and `views/`.
- The pattern is: an interface with only attributes, a Pinia store that only holds the array, and a service as a class of static methods with all the logic.
- CRUDs are split into three routes (`BooksIndexView`, `BooksCreateView`, `BooksShowView`).

The team that presented follows that same pattern without deviating, and got a good grade.

The conclusion is that the graded architecture doesn't come from the written assignment but from the "code dictatorship" agreed on in class, embodied in the tutorials.

## Decision

Migrate Creatorly to TypeScript and adopt the tutorials' three-layer pattern:

- **`interfaces/`** — each entity's shape, attributes only, no methods.
- **`dtos/`** — types derived with `Omit`/`Pick`, one per use case.
- **`stores/`** — Pinia, only the entity's array, no logic.
- **`services/`** — classes of static methods with all the business logic and validations.
- **`seeders/`** — seed data, one per entity.
- **`utils/`** — formatters and helpers.
- **`components/charts/`** — all the Chart.js charts; no view imports them.

The `composables/` folder is removed: its logic moves to the services.

The 7-step execution plan lives in `PLAN_MIGRACION_TS.md`.

## Alternatives Considered

**Stay in JavaScript with JSDoc.** The current JSDoc is correct and gives editor autocompletion, and the written assignment doesn't require TypeScript. Discarded because the rubric explicitly grades DTOs and interfaces, which are TypeScript constructs, and because the professor reviewed the typing in detail during the defense. The risk of losing those items outweighs the cost of migrating.

**Migrate only the folder structure, without TypeScript.** `services/` and `utils/` could be created in JS. Discarded because `interfaces/` and `dtos/` have no real equivalent in JavaScript: a DTO in the course's pattern is a derived type (`Omit<UserInterface, 'id'>`), and that doesn't exist without TS.

**Migrate after finishing the pages.** Discarded for the opposite reason: migrating later is much more expensive. Today no view is implemented, so the rework cost is zero.

## Consequences

**Positive**

- The project structure matches items 8 to 14 of the rubric.
- Types are checked at compile time (`vue-tsc` in the build), not just in the editor.
- The store/service separation keeps views thin and the logic testable and reusable.
- The team works on the same pattern already practiced in the tutorials, instead of a homegrown one.

**Negative**

- Immediate cost of migrating the base (models, storage, seeding, router, session).
- Felipe and Gerónimo are blocked until step 6 of the plan is done.
- Both teammates have to work in TypeScript, which may be new to them. Mitigated with a short guide to the pattern, which also feeds the wiki's "Programming rules" page.
- Each entity goes from one file to three, which increases the file count even as coupling drops.

**On the class diagram**

The submitted diagram declares `+CRUD()`, `+getters()`, `+setters()` on the four classes. With pure interfaces those methods no longer exist in the code. It was verified that the team that presented has exactly the same mismatch — diagram with those three methods, code with methodless interfaces — and the professor didn't penalize it. The diagram keeps those three methods on purpose, but it **was redrawn** as part of the Deliverable 1 correction plan to follow the rubric: classes in English (`User`, `Creator`, `Brand`, `Order`), private attributes (`-`), plain association lines without arrows, and multiplicities at each end (`Brand 1 — 0..* Order`, `Creator 0..1 — 0..* Order`, `User 1 — 0..* Order`).

If the mismatch comes up during the defense, the explanation is that the diagram models the domain (what operations exist on each entity) while the code places them in the service layer, following the course's pattern.

## Impact on Previous ADRs

- **ADR-0001** (LocalStorage + references by id): still stands. The file name changes (`storage.js` → `StorageService.ts`) and `PiniaConfig.ts` is added to hydrate and persist the stores.
- **ADR-0003** (custom BaseChart): still stands and is reinforced. The component moves to `components/charts/` and the rule "no view imports Chart.js" becomes explicit in the professor's rubric.
