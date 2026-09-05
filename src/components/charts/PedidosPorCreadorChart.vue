<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { PedidosPorCreadorDTO } from '@/dtos/PedidosPorCreadorDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'

const props = defineProps<{ datos: PedidosPorCreadorDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.datos.map((fila) => fila.creadorNombre),
  datasets: [
    {
      label: 'Pedidos',
      data: props.datos.map((fila) => fila.cantidad),
      backgroundColor: getChartPalette()[0],
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  scales: {
    x: { ticks: { color: getChartTextColor() }, grid: { color: getChartGridColor() } },
    y: { ticks: { color: getChartTextColor() }, grid: { display: false } },
  },
  plugins: { legend: { display: false } },
}))
</script>

<template>
  <BaseChart type="bar" :data="data" :options="options" />
</template>
