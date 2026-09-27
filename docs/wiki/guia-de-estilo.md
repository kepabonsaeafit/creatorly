# Programming style guide

**Hybrid** guide: what the linter guarantees automatically and the manual conventions the linter can't check.

## Automated part: linter and formatter

They're two distinct tools, with distinct responsibilities. The **linter** checks that the code is correct: errors, bad practices, essential Vue and TypeScript rules. The **formatter** only decides how the code looks (indentation, quotes, line width), without changing what it does.

### Linter: oxlint + ESLint

**What it is:** two tools that run together. oxlint is a fast first pass over common errors; ESLint (with `eslint-plugin-vue` and the TypeScript config) does the full review, including Vue rules.

**How it's used:**

```sh
npm run lint   # runs lint:oxlint and lint:eslint, in that order, both with --fix
```

Whatever can be fixed automatically gets fixed; the rest stays as an error and must be corrected by hand.

**Where it's used:** across the whole project (`.`), per `.oxlintrc.json` and `eslint.config.js`.

**When it's used:** before every commit; nothing gets committed with lint errors.

### Formatter: Prettier

**What it is:** applies uniform formatting to the code without changing its behavior.

**How it's used:**

```sh
npm run format   # prettier --write over src/
```

Rewrites the files in place. Config in `.prettierrc.json`: no semicolons, single quotes, 100-character line width.

**Where it's used:** only in `src/`.

**When it's used:** before every commit; if it modifies files, those changes go in the same commit.

**Golden rule:** before every commit, `npm run lint`, `npm run format`, and `npm run type-check` clean (if `format` modifies files, those changes go in the same commit); `npm run build` clean before opening any Pull Request. Style isn't debated in PRs — the linter already decided it.

## Manual part: conventions the linter doesn't check

### Folder structure

```text
src/
├── assets/       # global styles (brand palette in base.css)
├── components/   # reusable components (PascalCase)
│   └── charts/   # Chart.js charts, always via BaseChart.vue
├── interfaces/   # each entity's shape: User, Creator, Brand, Order
├── dtos/         # input: derived with Omit/Pick; filter/aggregation: their own interfaces
├── stores/       # Pinia stores (only the array, zero logic; exception: SessionStore)
├── services/     # all the logic
├── seeders/      # typed fake data, one per entity
├── storage/      # StorageService: the only door to LocalStorage
├── utils/        # shared helpers with no access to stores/LocalStorage (date, currency, status, ids)
├── router/       # routes + guards (admin/ groups the admin-only routes)
└── views/        # one view per route (*View.vue)
```

### Names

- **Components:** `PascalCase.vue` (`StatCard.vue`, `BaseChart.vue`).
- **Views:** `NameView.vue` (`OrdersIndexView.vue`, `CreatorsEditView.vue`).
- **Interfaces:** `NameInterface.ts` (`OrderInterface.ts`).
- **DTOs:** `NameDTO.ts` (`CreateOrderDTO.ts`, `OrderFilterDTO.ts`).
- **Services:** `NameService.ts` (`OrderService.ts`).
- **Seeders:** `NameSeeder.ts` (`OrderSeeder.ts`).
- **Routes:** lowercase paths with hyphens (`/orders/create`).
- **CSS:** classes prefixed by block (`stat-card__label`, light BEM pattern).

### Styles

- Use the **brand variables** from `src/assets/base.css` (`--color-primary`, `--color-success`, etc.); no magic colors (`#7c3aed`) in components.
- `scoped` styles in every SFC; only `assets/` has global styles.
- See [Brand Identity and Design System](identidad-de-marca) for the full guide to tokens, typography (3 roles), KPI cards, and the Chart.js chart palette.

### Documentation

- **Explicit types in TypeScript**, not JSDoc for shapes: every function or method parameter and return declares its type directly in the signature. `any` is forbidden without a written justification comment.

### Commits

- Conventional commits with **type in English + description in Spanish**: `feat: agrega gráfico de pedidos por estado`, `fix: corrige guard de rutas admin`, `docs: agrega borradores del wiki`.
