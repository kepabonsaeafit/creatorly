# Guía de estilo de programación

Guía **híbrida**: lo que el linter garantiza automáticamente y las convenciones manuales que el linter no puede revisar.

## Parte automatizada: el linter

El proyecto trae tres herramientas configuradas. Corren con un solo comando:

```sh
npm run lint     # oxlint (rápido) + eslint (completo), ambos con --fix
npm run format   # prettier sobre src/
```

**Qué hace cada una:**

| Herramienta | Archivo de config | Qué garantiza |
|---|---|---|
| **ESLint** + `eslint-plugin-vue` | `eslint.config.js` | Reglas de código correcto y esenciales de Vue (orden de atributos, SFC válido, sin variables sin usar) |
| **oxlint** | `.oxlintrc.json` | Primera pasada rápida de errores comunes (se ejecuta antes de ESLint) |
| **Prettier** | `.prettierrc.json` | Formato uniforme: sangría, comillas simples sin punto y coma, ancho de línea, comas finales |

**Regla de oro:** `npm run lint` debe terminar en verde y sin warnings nuevos antes de abrir cualquier Pull Request. No se discute estilo en los PRs — el linter ya lo decidió.

## Parte manual: convenciones que el linter no revisa

### Estructura de carpetas

```text
src/
├── assets/       # estilos globales (paleta de marca en base.css)
├── components/   # componentes reutilizables (PascalCase)
│   └── charts/   # gráficos Chart.js, siempre vía BaseChart.vue
├── interfaces/   # la forma de cada entidad: User, Creador, Marca, Pedido
├── dtos/         # tipos derivados por caso de uso (Omit/Pick)
├── stores/       # stores de Pinia (solo el array, cero lógica)
├── services/     # toda la lógica; StorageService es la única puerta a LocalStorage
├── seeders/      # datos ficticios tipados, uno por entidad
├── utils/        # formateadores puros compartidos (fecha, moneda, estado)
├── router/       # rutas + guards (admin/ agrupa las rutas solo-admin)
└── views/        # una vista por ruta (*View.vue)
```

### Nombres

- **Componentes:** `PascalCase.vue` (`StatCard.vue`, `BaseChart.vue`).
- **Vistas:** `NombreView.vue` (`PedidosIndexView.vue`, `CreadoresEditView.vue`).
- **Interfaces:** `NombreInterface.ts` (`PedidoInterface.ts`).
- **DTOs:** `NombreDTO.ts` (`CreatePedidoDTO.ts`, `PedidoFiltroDTO.ts`).
- **Services:** `NombreService.ts` (`PedidoService.ts`, `StorageService.ts`).
- **Seeders:** `NombreSeeder.ts` (`PedidoSeeder.ts`).
- **Rutas:** paths en minúscula con guiones (`/pedidos/crear`).
- **CSS:** clases con prefijo del bloque (`stat-card__label`, patrón BEM ligero).

### Estilos

- Usar las **variables de marca** de `src/assets/base.css` (`--color-primary`, `--color-success`, etc.); no colores mágicos (`#7c3aed`) en componentes.
- Estilos `scoped` en cada SFC; solo `assets/` tiene estilos globales.
- Consultar [Identidad de Marca y Sistema de Diseño](./identidad-de-marca.md) para la guía completa de tokens, tipografía (3 roles), KPI cards y paleta de gráficos Chart.js.

### Documentación

- **Tipos explícitos en TypeScript**, no JSDoc: todo parámetro y retorno de función o método declara su tipo directamente en la firma. `any` está prohibido sin justificación escrita en comentario.

### Commits

- Conventional commits con **tipo en inglés + descripción en español**: `feat: agrega gráfico de pedidos por estado`, `fix: corrige guard de rutas admin`, `docs: agrega borradores del wiki`.
