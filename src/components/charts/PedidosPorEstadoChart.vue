<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { PedidosPorEstadoDTO } from '@/dtos/PedidosPorEstadoDTO'
import { getChartPalette } from '@/utils/chartColors'
import { formatEstado } from '@/utils/formatEstado'

const props = defineProps<{ datos: PedidosPorEstadoDTO[] }>()

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
</script>

<template>
  <BaseChart type="pie" :data="data" />
</template>
