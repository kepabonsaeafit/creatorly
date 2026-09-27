<script setup lang="ts">
// Felipe Gómez

// internal imports
import type { ReportTableColumn } from '@/interfaces/ReportTableColumnInterface'

defineProps<{
  columns: ReportTableColumn[]
  rows: Record<string, string>[]
}>()
</script>

<template>
  <p v-if="rows.length === 0" class="report-table__empty">No hay datos para este reporte.</p>

  <table v-else class="report-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="column in columns" :key="column.key">{{ row[column.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.report-table__empty {
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
