# Chart.js directo con wrapper propio (BaseChart.vue) en vez de vue-chartjs

> **Actualizado por ADR-0004 (2026-09-02):** la decisión sigue vigente y se refuerza. Cambia la ubicación del componente y se hace explícita la regla de que ningún gráfico vive dentro de una view.

El enunciado exige Chart.js como librería gráfica obligatoria. Decidimos usar `chart.js` directamente y construir nuestro propio componente wrapper `components/charts/BaseChart.vue` — monta el canvas, recibe `type` + `data` + `options` tipados y destruye la instancia al desmontar — en lugar de añadir la librería `vue-chartjs`. Menos dependencias, control total del ciclo de vida del gráfico, y el wrapper cuenta como uno de los componentes reutilizables que el enunciado exige. La segunda librería visual obligatoria queda pendiente de elección por Felipe.

## Considered Options

- **`vue-chartjs`** — descartado por dependencia extra y menos control del ciclo de vida. Se deja constancia de que es una opción legítima: el equipo que sustentó el 2026-09-01 la usa y no fue penalizado. Si `BaseChart` resulta más costoso de mantener de lo previsto, revisar esta decisión antes de la entrega.

## Consequences

- **Ninguna view instancia ni importa Chart.js.** Todo gráfico se compone dentro de `components/charts/`, y las views solo reciben datos de un service y los pasan como props. Esta regla es además un criterio explícito de la rúbrica del profesor.
- `BaseChart` es responsable de destruir la instancia del chart al desmontarse (Chart.js no limpia solo).
- Los datos que alimentan cada gráfico se calculan en el service correspondiente y se devuelven tipados como DTO (por ejemplo `PedidosPorEstadoDTO`), no se agregan dentro del componente.
- Los colores de las series salen de las variables de marca en `src/assets/base.css`; nada de colores mágicos en la configuración de Chart.js.