# Guía de estilo de programación

Guía **híbrida**: lo que el linter garantiza automáticamente y las convenciones manuales que el linter no puede revisar.

## Parte automatizada: linter y formatter

Son dos herramientas distintas, con responsabilidades distintas. El **linter** revisa que el código sea correcto: errores, malas prácticas, reglas esenciales de Vue y TypeScript. El **formatter** solo decide cómo se ve el código (sangría, comillas, ancho de línea), sin cambiar lo que hace.

### Linter: oxlint + ESLint

**Qué es:** dos herramientas que corren juntas. oxlint es una primera pasada rápida de errores comunes; ESLint (con `eslint-plugin-vue` y la configuración de TypeScript) hace la revisión completa, incluidas las reglas de Vue.

**Cómo se usa:**

```sh
npm run lint   # corre lint:oxlint y lint:eslint, en ese orden, ambos con --fix
```

Lo que se puede arreglar solo, se arregla; lo demás queda como error y hay que corregirlo a mano.

**Dónde se usa:** sobre todo el proyecto (`.`), según `.oxlintrc.json` y `eslint.config.js`.

**Cuándo se usa:** antes de cada commit; no se commitea con errores de lint.

### Formatter: Prettier

**Qué es:** da formato uniforme al código sin cambiar su comportamiento.

**Cómo se usa:**

```sh
npm run format   # prettier --write sobre src/
```

Reescribe los archivos en su lugar. Config en `.prettierrc.json`: sin punto y coma, comillas simples, ancho de línea 100.

**Dónde se usa:** solo en `src/`.

**Cuándo se usa:** antes de cada commit; si modifica archivos, esos cambios van en el mismo commit.

**Regla de oro:** antes de cada commit, `npm run lint`, `npm run format` y `npm run type-check` en verde (si `format` modifica archivos, esos cambios van en el mismo commit); `npm run build` en verde antes de abrir cualquier Pull Request. No se discute estilo en los PRs — el linter ya lo decidió.

## Parte manual: convenciones que el linter no revisa

### Estructura de carpetas

```text
src/
├── assets/       # estilos globales (paleta de marca en base.css)
├── components/   # componentes reutilizables (PascalCase)
│   └── charts/   # gráficos Chart.js, siempre vía BaseChart.vue
├── interfaces/   # la forma de cada entidad: User, Creador, Marca, Pedido
├── dtos/         # de entrada: derivados con Omit/Pick; de filtro/agregación: interfaces propias
├── stores/       # stores de Pinia (solo el array, cero lógica; excepción: SessionStore)
├── services/     # toda la lógica
├── seeders/      # datos ficticios tipados, uno por entidad
├── storage/      # StorageService: única puerta a LocalStorage
├── utils/        # helpers compartidos sin acceso a stores/LocalStorage (fecha, moneda, estado, ids)
├── router/       # rutas + guards (admin/ agrupa las rutas solo-admin)
└── views/        # una vista por ruta (*View.vue)
```

### Nombres

- **Componentes:** `PascalCase.vue` (`StatCard.vue`, `BaseChart.vue`).
- **Vistas:** `NombreView.vue` (`PedidosIndexView.vue`, `CreadoresEditView.vue`).
- **Interfaces:** `NombreInterface.ts` (`PedidoInterface.ts`).
- **DTOs:** `NombreDTO.ts` (`CreatePedidoDTO.ts`, `PedidoFiltroDTO.ts`).
- **Services:** `NombreService.ts` (`PedidoService.ts`).
- **Seeders:** `NombreSeeder.ts` (`PedidoSeeder.ts`).
- **Rutas:** paths en minúscula con guiones (`/pedidos/crear`).
- **CSS:** clases con prefijo del bloque (`stat-card__label`, patrón BEM ligero).

### Estilos

- Usar las **variables de marca** de `src/assets/base.css` (`--color-primary`, `--color-success`, etc.); no colores mágicos (`#7c3aed`) en componentes.
- Estilos `scoped` en cada SFC; solo `assets/` tiene estilos globales.
- Consultar [Identidad de Marca y Sistema de Diseño](identidad-de-marca) para la guía completa de tokens, tipografía (3 roles), KPI cards y paleta de gráficos Chart.js.

### Documentación

- **Tipos explícitos en TypeScript**, no JSDoc: todo parámetro y retorno de función o método declara su tipo directamente en la firma. `any` está prohibido sin justificación escrita en comentario.

### Commits

- Conventional commits con **tipo en inglés + descripción en español**: `feat: agrega gráfico de pedidos por estado`, `fix: corrige guard de rutas admin`, `docs: agrega borradores del wiki`.
