# Reglas de programación

Reglas esenciales del proyecto, por categoría. Si un PR las incumple, se remite a esta página.

## Generales

1. **DRY** (Don't Repeat Yourself) y **ETC** (Easier to Change): si un segundo lugar necesita lo mismo, se extrae a un componente/servicio; se escribe código pensando en cambiarlo.
2. **Todo método o función de `models/`, `services/` y `composables/` define tipos** de parámetros y retorno mediante JSDoc (`@param {string} id`, `@returns {Pedido[]}`).
3. Código y UI en español (etiquetas, mensajes); identificadores en español cuando sean del dominio (`Creador`, `estado`) y en inglés cuando sean técnicos (`storage`, `seed`).

## Rutas

4. Toda ruta está asociada a una vista (`views/*View.vue`); no hay rutas "sueltas".
5. Toda vista es un **Single File Component** (SFC).
6. Los paths van en minúscula con guiones: `/pedidos/nuevo`, `/pedidos/:id/editar`.
7. El acceso restringido se controla con guards del router (`router.beforeEach`): sesión obligatoria para todo, y `rol === 'admin'` para `/creadores` y `/usuarios`.

## Vistas

8. Las vistas orquestan: llaman composables/servicios y componen componentes. **Sin lógica de negocio dentro de la vista.**
9. Ninguna vista accede a `localStorage` directamente: siempre vía `services/storage.js`.

## Componentes

10. Todo componente reutilizable vive en `components/`, en PascalCase, con props validadas (`type`, `required`/`default`).
11. Los componentes reciben datos por props y emiten eventos; no mutan props.
12. Si dos páginas necesitan el mismo gráfico/tabla/selector, es un componente reutilizable (`DataTable`, `BaseChart`, `FilterSelect`).
13. Todo gráfico de Chart.js se instancia a través de `BaseChart`; ninguna vista importa `chart.js` directamente.

## Modelos y servicios

14. Las 4 clases del dominio (`User`, `Creador`, `Marca`, `Pedido`) se implementan en `models/` con sus relaciones, usando siempre los términos canónicos del dominio (Pedido, Creador, Marca, User, coordinador, administrador).
15. El CRUD de cada clase vive como métodos estáticos de la propia clase; los datos pasan por `services/storage.js`.
16. Los ids se generan con `crypto.randomUUID()`; los pedidos referencian marca, creador y coordinador **por id**, no con objetos anidados.

## Datos

17. Claves de LocalStorage con prefijo `creatorly_` (`creatorly_users`, `creatorly_pedidos`, `creatorly_session`…).
18. La siembra de datos ficticios ocurre solo en el primer arranque (si las claves no existen).
19. La sesión **nunca** guarda la contraseña del usuario.

## Git y PRs

20. Nada de pushes directos a `main`: todo por rama + Pull Request aprobado por el arquitecto, quien puede revertir lo que incumpla estas reglas.
21. Commits convencionales: tipo inglés + descripción español (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
22. `npm run lint` en verde y sin warnings nuevos antes de abrir el PR.
