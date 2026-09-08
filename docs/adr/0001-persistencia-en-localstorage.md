# Persistencia en LocalStorage con referencias por id

> **Actualizado por ADR-0004 (2026-09-02):** la decisión de fondo sigue vigente. Cambian los nombres de archivo y la forma de hidratar los datos, por la migración a TypeScript con el patrón interfaces + stores + services.
>
> **Actualizado el 2026-09-07:** el despliegue en GCP por HTTP sin dominio propio expuso que `crypto.randomUUID()` solo existe en contextos seguros (HTTPS o `localhost`) — en ese entorno el navegador no lo expone y lanza `TypeError: crypto.randomUUID is not a function`, rompiendo el sembrado de datos al arrancar. Los ids se siguen generando como UUID v4, pero ahora a través de `utils/generateId.ts`, que usa `crypto.randomUUID()` cuando está disponible y si no arma el UUID a mano con `crypto.getRandomValues()` (esta sí funciona sin contexto seguro). Ver detalle en Consequences.

El enunciado del curso exige que la "base de datos" de la SPA viva en el LocalStorage del navegador, sembrada con datos ficticios en el primer arranque. Decidimos: una clave por colección con prefijo `creatorly_` (`creatorly_users`, `creatorly_creadores`, `creatorly_marcas`, `creatorly_pedidos`), identificadores generados como UUID v4, y cada pedido guarda sus referencias a marca, creador y coordinador como **ids planos** — nunca objetos anidados. Las relaciones se resuelven al leer, no al escribir. Todo acceso a LocalStorage pasa por un único servicio (`services/StorageService.ts`).

## Considered Options

- **Objetos anidados dentro del pedido** — rechazado: duplica datos (DRY), hace costoso actualizar un creador y complica los gráficos por marca/creador.
- **IDs incrementales** — rechazado: frágiles tras borrar registros; un UUID no colisiona y no requiere coordinación.
- **`crypto.randomUUID()` directo, sin respaldo** — funcionaba en desarrollo local (`localhost` es contexto seguro) pero rota en cualquier despliegue por HTTP sin dominio, porque ahí el navegador no expone la función; descartado en favor de un fallback manual con `crypto.getRandomValues()`, que no depende de contexto seguro.

## Consequences

- La fuente de verdad en memoria son los stores de Pinia; LocalStorage es la capa de persistencia detrás de ellos.
- `PiniaConfig.init()` centraliza el arranque: hidrata los stores desde LocalStorage o ejecuta la siembra si están vacíos, y luego observa los stores en profundidad para persistir cada cambio.
- Los services leen y escriben sobre los stores, no sobre LocalStorage. `StorageService` es el único módulo que toca la API del navegador.
- Las relaciones por id se resuelven en los services (`PedidoService.getMarca(pedido)`), no en las views.
- Ningún service ni seeder llama a `crypto.randomUUID()` directamente: todos generan ids con `utils/generateId.ts`, que centraliza el fallback y evita que el bug de contexto inseguro se repita en un archivo nuevo.