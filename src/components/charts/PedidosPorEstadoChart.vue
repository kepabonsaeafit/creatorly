<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { PedidosPorEstadoDTO } from '@/dtos/PedidosPorEstadoDTO'
import { getChartPalette, getChartTextColor } from '@/utils/chartColors'
import { formatEstado } from '@/utils/formatEstado'

const props = withDefaults(
  defineProps<{ datos: PedidosPorEstadoDTO[]; mostrarLeyenda?: boolean }>(),
  {
    mostrarLeyenda: true,
  },
)

// computed variables
const data = computed<ChartData<'pie'>>(() => ({
  labels: props.datos.map((fila) => formatEstado(fila.estado)),
  datasets: [
    {
      data: props.datos.map((fila) => fila.cantidad),
      backgroundColor: getChartPalette(),
    },
  ],
}))

const options = computed<ChartOptions<'pie'>>(() => ({
  plugins: {
    legend: {
      display: props.mostrarLeyenda,
      labels: { color: getChartTextColor() },
    },
  },
}))
</script>

<template>
  <BaseChart type="pie" :data="data" :options="options" />
</template>
