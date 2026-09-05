<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { PedidosPorMesDTO } from '@/dtos/PedidosPorMesDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'

const props = defineProps<{ datos: PedidosPorMesDTO[] }>()

// computed variables
const data = computed<ChartData<'line'>>(() => ({
  labels: props.datos.map((fila) => fila.etiqueta),
  datasets: [
    {
      label: 'Pedidos',
      data: props.datos.map((fila) => fila.cantidad),
      borderColor: getChartPalette()[0],
      backgroundColor: getChartPalette()[0],
      tension: 0.3,
    },
  ],
}))

const options = computed<ChartOptions<'line'>>(() => ({
  scales: {
    x: { ticks: { color: getChartTextColor() }, grid: { display: false } },
    y: { ticks: { color: getChartTextColor() }, grid: { color: getChartGridColor() } },
  },
  plugins: { legend: { display: false } },
}))
</script>

<template>
  <BaseChart type="line" :data="data" :options="options" />
</template>
