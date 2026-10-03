<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { OrdersByMonthDTO } from '@/dtos/Reports/OrdersByMonthDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'

// props
const props = defineProps<{ items: OrdersByMonthDTO[] }>()

// computed variables
const data = computed<ChartData<'line'>>(() => ({
  labels: props.items.map((row) => row.label),
  datasets: [
    {
      label: 'Orders',
      data: props.items.map((row) => row.count),
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
