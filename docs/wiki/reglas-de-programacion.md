# Reglas de programación

Reglas esenciales del proyecto, por categoría. Si un PR las incumple, se remite a esta página. Fuente completa: [AGENTS.md](../../AGENTS.md).

## Generales

1. **TypeScript en todo**: archivos `.ts`, SFCs con `<script setup lang="ts">`. Tipos explícitos en todo parámetro y retorno de función o método; `any` está prohibido sin justificación escrita en comentario.
2. **DRY** (Don't Repeat Yourself) y **ETC** (Easier to Change): si un segundo lugar necesita lo mismo, se extrae a un componente/servicio; se escribe código pensando en cambiarlo.
3. Código y UI en español (etiquetas, mensajes); identificadores en español cuando sean del dominio (`Creador`, `estado`) y en inglés cuando sean técnicos (`store`, `service`).

## Rutas

4. Toda ruta está asociada a una vista SFC en `views/`; no hay rutas "sueltas".
5. Los paths van en minúscula con guiones (`/pedidos/crear`); los nombres de ruta con punto para variantes de un mismo recurso (`pedidos`, `pedidos.create`, `pedidos.edit`).
6. El acceso se controla en `router/accessControl.ts` (guard) y `router/admin/adminRoutes.ts` (rutas solo-admin agrupadas por nivel de acceso): sesión obligatoria para todo salvo `/login`, y rol `admin` para `/creadores` (y sus 3 rutas) y `/usuarios`.

## Vistas

7. Las vistas orquestan: llaman services y componen componentes. **Sin lógica de negocio dentro de la vista.**
8. **Las views no tocan los stores**: solo hablan con services.
9. **No se crean composables**: toda la lógica va a `services/`.
10. **Ningún gráfico dentro de una view**: todo Chart.js vive en `components/charts/`.

## Componentes

11. Todo componente reutilizable vive en `components/`, en PascalCase, con props tipadas vía `defineProps<Interface>()` (no validación de props en tiempo de ejecución).
12. Los componentes reciben datos por props y emiten eventos; no mutan props.
13. Si dos páginas necesitan el mismo gráfico/tabla/selector, es un componente reutilizable.
14. Todo gráfico de Chart.js se instancia a través de `components/charts/BaseChart.vue`; ninguna view ni componente de página importa `chart.js` directamente.

## Arquitectura

15. Cada entidad del dominio se parte en hasta cinco piezas: `interfaces/` (la forma, sin métodos) + `dtos/` (tipos derivados con `Omit`/`Pick`) + `stores/` (Pinia, solo el array, cero lógica) + `services/` (clase de métodos estáticos, toda la lógica y validaciones) + `seeders/` (datos ficticios, objetos planos tipados). `utils/` guarda formateadores puros compartidos (fecha, moneda, estado) sin estado ni acceso a stores/LocalStorage.
16. **Un DTO por caso de uso.** Varios DTOs en un service está bien; un DTO partido en dos, no.
17. Los ids se generan con `crypto.randomUUID()`; los pedidos referencian marca/creador/coordinador **por id**, no con objetos anidados.

## Datos

18. **Nadie toca `localStorage` directamente**: siempre vía `services/StorageService.ts`.
19. Claves de LocalStorage con prefijo `creatorly_` (`creatorly_users`, `creatorly_pedidos`, `creatorly_session`…).
20. La siembra de datos ficticios ocurre solo si LocalStorage está vacío (`PiniaConfig` + `DemoDataService.generar()`/`.persistir()`). El botón "Restablecer datos demo" en `/usuarios` llama a `DemoDataService.reset()`, que siembra exactamente igual y cierra la sesión activa.
21. La sesión **nunca** guarda la contraseña del usuario.

## Git y PRs

22. Nada de pushes directos a `main`: todo por rama + Pull Request. Push y PR requieren autorización explícita del integrante dueño de esa rama; aprobar y mergear a `main` sigue siendo autoridad del arquitecto, igual que instalar o actualizar dependencias.
23. Commits convencionales: tipo en inglés + descripción en español (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`), cuerpo en viñetas de hechos técnicos verificables — nada de narración del proceso ni mensajes dirigidos a alguien.
24. `npm run lint`, `npm run type-check` y `npm run build` en verde antes de abrir el PR.
