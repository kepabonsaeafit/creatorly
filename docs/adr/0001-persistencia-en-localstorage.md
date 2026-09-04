# Persistencia en LocalStorage con referencias por id

> **Actualizado por ADR-0004 (2026-09-02):** la decisión de fondo sigue vigente. Cambian los nombres de archivo y la forma de hidratar los datos, por la migración a TypeScript con el patrón interfaces + stores + services.

El enunciado del curso exige que la "base de datos" de la SPA viva en el LocalStorage del navegador, sembrada con datos ficticios en el primer arranque. Decidimos: una clave por colección con prefijo `creatorly_` (`creatorly_users`, `creatorly_creadores`, `creatorly_marcas`, `creatorly_pedidos`), identificadores generados con `crypto.randomUUID()`, y cada pedido guarda sus referencias a marca, creador y coordinador como **ids planos** — nunca objetos anidados. Las relaciones se resuelven al leer, no al escribir. Todo acceso a LocalStorage pasa por un único servicio (`services/StorageService.ts`).

## Considered Options

- **Objetos anidados dentro del pedido** — rechazado: duplica datos (DRY), hace costoso actualizar un creador y complica los gráficos por marca/creador.
- **IDs incrementales** — rechazado: frágiles tras borrar registros; `crypto.randomUUID()` no colisiona y no requiere coordinación.

## Consequences

- La fuente de verdad en memoria son los stores de Pinia; LocalStorage es la capa de persistencia detrás de ellos.
- `PiniaConfig.init()` centraliza el arranque: hidrata los stores desde LocalStorage o ejecuta la siembra si están vacíos, y luego observa los stores en profundidad para persistir cada cambio.
- Los services leen y escriben sobre los stores, no sobre LocalStorage. `StorageService` es el único módulo que toca la API del navegador.
- Las relaciones por id se resuelven en los services (`PedidoService.getMarca(pedido)`), no en las views.