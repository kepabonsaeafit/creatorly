<script setup lang="ts">
// Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { OrdersByStatusDTO } from '@/dtos/OrdersByStatusDTO'
import { getChartPalette, getChartTextColor } from '@/utils/chartColors'
import { formatStatus } from '@/utils/formatStatus'

const props = withDefaults(defineProps<{ items: OrdersByStatusDTO[]; showLegend?: boolean }>(), {
  showLegend: true,
})

// computed variables
const data = computed<ChartData<'pie'>>(() => ({
  labels: props.items.map((row) => formatStatus(row.status)),
  datasets: [
    {
      data: props.items.map((row) => row.count),
      backgroundColor: getChartPalette(),
    },
  ],
}))

const options = computed<ChartOptions<'pie'>>(() => ({
  plugins: {
    legend: {
      display: props.showLegend,
      labels: { color: getChartTextColor() },
    },
  },
}))
</script>

<template>
  <BaseChart type="pie" :data="data" :options="options" />
</template>
