<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { PresupuestoPorMarcaDTO } from '@/dtos/PresupuestoPorMarcaDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'
import { formatCurrency } from '@/utils/formatCurrency'

const props = defineProps<{ datos: PresupuestoPorMarcaDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.datos.map((fila) => fila.marcaNombre),
  datasets: [
    {
      label: 'Presupuesto',
      data: props.datos.map((fila) => fila.presupuesto),
      backgroundColor: getChartPalette()[1],
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  scales: {
    x: { ticks: { color: getChartTextColor() }, grid: { display: false } },
    y: { ticks: { color: getChartTextColor() }, grid: { color: getChartGridColor() } },
  },
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (contexto) => formatCurrency(Number(contexto.raw)) } },
  },
}))
</script>

<template>
  <BaseChart type="bar" :data="data" :options="options" />
</template>
