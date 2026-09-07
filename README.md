# Creatorly

Dashboard interno (SPA) para que una agencia de contenido UGC administre su operación diaria: el catálogo de **Creadores**, las **Marcas** que solicitan contenido, y los **Pedidos** que conectan a ambos, con presupuesto y seguimiento de estado.

No hay backend: la "base de datos" es el **LocalStorage** del navegador, sembrada con datos ficticios en el primer arranque.

## Stack

- **Vue 3** + `<script setup lang="ts">` en cada componente
- **TypeScript** en todo `src/`
- **Vite** como bundler y servidor de desarrollo
- **Pinia** para el estado (solo el array/estado de cada entidad, sin lógica)
- **Vue Router** con guards de acceso
- **Chart.js** para los gráficos de Reportes y Pedidos
- **vue-toastification** para las notificaciones de éxito/error

## Cómo correr el proyecto

Requiere **Node `^22.18.0 || >=24.12.0`** (el rango exacto que exige `engines` en `package.json`; Node 23.x, por ejemplo, no lo cumple).

```sh
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

## Ruta principal

`/` exige sesión, igual que casi toda la app (la única ruta pública es `/login`). Sin sesión, el guard del router redirige automáticamente a `/login`.

## Credenciales demo

Los datos de siembra incluyen 3 usuarios (`src/seeders/UserSeeder.ts`):

| Email | Contraseña | Rol | Nombre |
|---|---|---|---|
| `admin@creatorly.com` | `1234` | admin | Camila Torres |
| `laura@creatorly.com` | `1234` | coordinador | Laura Restrepo |
| `sara@creatorly.com` | `1234` | coordinador | Sara Gómez |

El rol **admin** es el único que accede a `/creadores` y `/usuarios`.

## Restablecer datos demo

En `/usuarios` (solo admin), sección "Datos demo" → botón **Restablecer datos demo**: borra todo lo guardado en LocalStorage, vuelve a sembrar los datos ficticios iniciales y cierra la sesión actual (la nueva siembra genera usuarios con ids distintos a los de la sesión previa).

## Scripts disponibles

```sh
npm run dev         # servidor de desarrollo (Vite)
npm run build        # build de producción (incluye type-check)
npm run preview      # sirve el build de producción localmente
npm run type-check   # vue-tsc: verificación de tipos
npm run lint         # oxlint + eslint, ambos con --fix
npm run format       # prettier sobre src/
```

## Para profundizar

- **[AGENTS.md](./AGENTS.md)** — arquitectura del proyecto (patrón de 5 piezas por entidad), reglas de código y política de trabajo con agentes de IA.
- **[CONTEXT.md](./CONTEXT.md)** — glosario oficial del dominio.
- **[docs/adr/](./docs/adr/)** — decisiones de arquitectura ya tomadas, y por qué.
