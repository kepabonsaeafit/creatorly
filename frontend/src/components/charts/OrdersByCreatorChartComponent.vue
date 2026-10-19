<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChartComponent from '@/components/charts/BaseChartComponent.vue'
import { ColorUtil } from '@/utils/ColorUtil'
import type { OrdersByCreatorDTO } from '@/dtos/Reports/OrdersByCreatorDTO'

// props
const props = defineProps<{ items: OrdersByCreatorDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.items.map((row: OrdersByCreatorDTO): string => row.creatorName),
  datasets: [
    {
      label: 'Orders',
      data: props.items.map((row: OrdersByCreatorDTO): number => row.count),
      backgroundColor: ColorUtil.getChartPalette()[0],
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  indexAxis: 'y',
  scales: {
    x: {
      ticks: { color: ColorUtil.getChartTextColor() },
      grid: { color: ColorUtil.getChartGridColor() },
    },
    y: { ticks: { color: ColorUtil.getChartTextColor() }, grid: { display: false } },
  },
  plugins: { legend: { display: false } },
}))
</script>

<template>
  <BaseChartComponent type="bar" :data="data" :options="options" />
</template>
