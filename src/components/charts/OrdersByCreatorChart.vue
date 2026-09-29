<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { OrdersByCreatorDTO } from '@/dtos/OrdersByCreatorDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'

// props
const props = defineProps<{ items: OrdersByCreatorDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.items.map((row) => row.creatorName),
  datasets: [
    {
      label: 'Orders',
      data: props.items.map((row) => row.count),
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
