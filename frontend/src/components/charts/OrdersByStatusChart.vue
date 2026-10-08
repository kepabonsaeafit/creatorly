<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import { formatStatus } from '@/utils/labels'
import { getChartPalette, getChartTextColor } from '@/utils/chartColors'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'

// props
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
