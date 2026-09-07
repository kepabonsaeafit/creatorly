<script setup lang="ts">
// Felipe Gómez

export interface ReportTableColumn {
  key: string
  label: string
}

defineProps<{
  columnas: ReportTableColumn[]
  filas: Record<string, string>[]
}>()
</script>

<template>
  <p v-if="filas.length === 0" class="report-table__vacio">No hay datos para este reporte.</p>

  <table v-else class="report-table">
    <thead>
      <tr>
        <th v-for="columna in columnas" :key="columna.key">{{ columna.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fila, indice) in filas" :key="indice">
        <td v-for="columna in columnas" :key="columna.key">{{ fila[columna.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.report-table__vacio {
  color: var(--color-text);
  opacity: 0.75;
  padding: 1.5rem 0;
  text-align: center;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.report-table th,
.report-table td {
  text-align: left;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.report-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}
</style>
