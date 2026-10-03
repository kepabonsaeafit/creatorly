# Persistence in LocalStorage with references by id

> **Updated by ADR-0004 (2026-09-02):** the underlying decision still stands. File names and the way data is hydrated change, due to the migration to TypeScript with the interfaces + stores + services pattern.
>
> **Updated on 2026-09-07:** the HTTP deployment on GCP without a domain of its own revealed that `crypto.randomUUID()` only exists in secure contexts (HTTPS or `localhost`) — in that environment the browser doesn't expose it and throws `TypeError: crypto.randomUUID is not a function`, breaking data seeding on startup. Ids are still generated as UUID v4, but now through `utils/generateId.ts`, which uses `crypto.randomUUID()` when available and otherwise builds the UUID by hand with `crypto.getRandomValues()` (this one does work without a secure context). See details in Consequences.
>
> **Updated on 2026-09-23:** `StorageService` moves out of `services/` into `storage/`, because it's the persistence layer, not business logic. The underlying decision doesn't change.

The course requirements demand that the SPA's "database" live in the browser's LocalStorage, seeded with fake data on first launch. We decided: one key per collection prefixed with `creatorly_` (`creatorly_users`, `creatorly_creators`, `creatorly_brands`, `creatorly_orders`), identifiers generated as UUID v4, and each order stores its brand, creator, and coordinator references as **plain ids** — never nested objects. Relationships are resolved on read, not on write. All LocalStorage access goes through a single service (`storage/StorageService.ts`).

## Considered Options

- **Nested objects inside the order** — rejected: duplicates data (DRY), makes updating a creator expensive, and complicates the brand/creator charts.
- **Incremental IDs** — rejected: fragile after deleting records; a UUID doesn't collide and requires no coordination.
- **`crypto.randomUUID()` directly, with no fallback** — worked in local development (`localhost` is a secure context) but breaks in any HTTP deployment without a domain, because the browser doesn't expose the function there; discarded in favor of a manual fallback with `crypto.getRandomValues()`, which doesn't depend on a secure context.

## Consequences

- The source of truth in memory is the Pinia stores; LocalStorage is the persistence layer behind them.
- `initPinia()` centralizes startup: hydrates the stores from LocalStorage or runs the seed if they're empty, then deep-watches the stores to persist every change.
- Services read and write against the stores, not against LocalStorage. `StorageService` is the only module that touches the browser API.
- Relationships by id are resolved in the services (`OrderService.getBrand(order)`), not in the views.
- No service calls `crypto.randomUUID()` directly: all of them generate ids with `utils/generateId.ts`, which centralizes the fallback and prevents the insecure-context bug from being reintroduced in a new file. Seeders don't generate ids: their data uses plain `'1'`, `'2'`, ... ids.
