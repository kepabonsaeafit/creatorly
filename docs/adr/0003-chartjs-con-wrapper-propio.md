# Chart.js directly with a custom wrapper (BaseChartComponent.vue) instead of vue-chartjs

> **Updated by ADR-0004 (2026-09-02):** the decision still stands and is reinforced. The component's location changes and the rule that no chart lives inside a view is made explicit.

The course requirements mandate Chart.js as the required charting library. We decided to use `chart.js` directly and build our own wrapper component `components/charts/BaseChartComponent.vue` — it mounts the canvas, receives typed `type` + `data` + `options`, and destroys the instance on unmount — instead of adding the `vue-chartjs` library. Fewer dependencies, full control over the chart's lifecycle, and the wrapper counts as one of the reusable components the assignment requires. The second required JS library is still pending the professor's answer on whether `vue-toastification`, already installed in the project, counts as one.

## Considered Options

- **`vue-chartjs`** — discarded due to the extra dependency and less control over the lifecycle. Noted for the record that it's a legitimate option: the team that presented on 2026-09-01 uses it and wasn't penalized. If `BaseChart` turns out costlier to maintain than expected, revisit this decision before the submission.

## Consequences

- **No view instantiates or imports Chart.js.** Every chart is composed inside `components/charts/`, and views only receive data from a service and pass it as props. This rule is also an explicit criterion of the professor's rubric.
- `BaseChart` is responsible for destroying the chart instance on unmount (Chart.js doesn't clean up on its own).
- The data that feeds each chart is computed in the corresponding service and returned typed as a DTO (for example `OrdersByStatusDTO`), not aggregated inside the component.
- Series colors come from the brand variables in `src/assets/base.css`; no magic colors in the Chart.js configuration.
