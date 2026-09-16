# Hallazgo: fechas desplazadas un día por zona horaria

**Estado:** documentado, sin corregir.
**Archivo:** `src/utils/formatDate.ts` — funciones `formatDate` y `formatMonthLabel`.

## Síntoma

En un navegador con zona horaria de Bogotá (UTC−5):

| Llamada | Esperado | Obtenido en Bogotá | Obtenido en UTC |
|---|---|---|---|
| `formatMonthLabel('2026-08-01')` | `ago 2026` | `jul 2026` | `ago 2026` |
| `formatDate('2026-08-12')` | `12 ago 2026` | `11 ago 2026` | `12 ago 2026` |

Dónde se ve en la aplicación:

- **Reportes:** `PedidoService.getPedidosPorMes` genera `etiqueta` con
  ``formatMonthLabel(`${mes}-01`)``, así que cada barra del gráfico mensual lleva
  el nombre del mes anterior.
- **Tabla de Pedidos:** `PedidosTable.vue` muestra `fechaSolicitud` y
  `fechaEntrega` con `formatDate`, un día antes del valor guardado.

## Causa

1. `fechaSolicitud` y `fechaEntrega` se guardan como fecha sin hora (`YYYY-MM-DD`).
2. Según la especificación de ECMAScript, `new Date('2026-08-01')` interpreta una
   fecha ISO sin hora como **medianoche UTC**: `2026-08-01T00:00:00Z`.
3. `Intl.DateTimeFormat` sin la opción `timeZone` formatea en la **zona horaria local**.
   En Bogotá ese instante es `2026-07-31 19:00`, es decir, 31 de julio.

Toda zona horaria detrás de UTC (América) ve el día anterior. Las zonas por
delante de UTC ven el día correcto.

## Por qué una prueba pasaría en CI y fallaría en Bogotá

Los runners `ubuntu-latest` de GitHub Actions corren con `TZ=UTC`. En UTC el
desplazamiento es cero y la conversión devuelve el mismo día, así que una prueba
como

```ts
expect(formatMonthLabel('2026-08-01')).toBe('ago 2026')
```

sale en verde en CI y en rojo en cualquier máquina del equipo en Colombia. La
prueba no sería determinista: su resultado dependería del entorno, no del código.

Por eso las pruebas unitarias actuales:

- no cubren `formatDate` ni `formatMonthLabel`;
- en `getPedidosPorMes` verifican solo `mes`, `cantidad` y `presupuesto`, nunca `etiqueta`.

Se comprobó que las pruebas pasan con `TZ=UTC`, `TZ=America/Bogota` y
`TZ=Pacific/Kiritimati` (UTC+14).

## Fix propuesto

Formatear las fechas sin hora en UTC, la misma zona en que `new Date` las interpretó:

```ts
export function formatMonthLabel(iso: string): string {
  return new Intl.DateTimeFormat('es', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
```

Con `timeZone: 'UTC'` ambos pasos usan la misma zona, y el resultado es `ago 2026`
en cualquier máquina.

Cuidado con `formatDate`: también la usa `UsuariosTable.vue` con `createdAt`, que
es un timestamp completo (`2026-08-10T12:00:00.000Z`). Ese valor sí es un instante
y debe mostrarse en hora local. Aplicar `timeZone: 'UTC'` sin distinguir los dos
casos corregiría las fechas de Pedido, pero mostraría en día UTC los usuarios
creados cerca de la medianoche. El fix debe aplicar UTC solo a cadenas `YYYY-MM-DD`,
o separar una función para fechas sin hora y otra para timestamps.

Una vez corregido, las pruebas pueden fijar la zona para ser deterministas, por
ejemplo con `TZ=America/Bogota` en el script `test` o con `process.env.TZ` en un
`setupFiles` de Vitest, y cubrir el caso de Bogotá explícitamente.

## Por qué no se corrigió todavía

`dist/` está versionado y el `Dockerfile` lo copia tal cual a producción. El fix
en `src/` no llega al despliegue sin regenerar y commitear `dist/`. Se pospone
para no mezclar ese cambio con el periodo de calificación.
