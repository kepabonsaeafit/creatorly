<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChartComponent from '@/components/charts/BaseChartComponent.vue'
import { ColorUtil } from '@/utils/ColorUtil'
import type { OrdersByMonthDTO } from '@/dtos/Reports/OrdersByMonthDTO'

// props
const props = defineProps<{ items: OrdersByMonthDTO[] }>()

// computed variables
const data = computed<ChartData<'line'>>(() => ({
  labels: props.items.map((row: OrdersByMonthDTO): string => row.label),
  datasets: [
    {
      label: 'Orders',
      data: props.items.map((row: OrdersByMonthDTO): number => row.count),
      borderColor: ColorUtil.getChartPalette()[0],
      backgroundColor: ColorUtil.getChartPalette()[0],
      tension: 0.3,
    },
  ],
}))

const options = computed<ChartOptions<'line'>>(() => ({
  scales: {
    x: { ticks: { color: ColorUtil.getChartTextColor() }, grid: { display: false } },
    y: {
      ticks: { color: ColorUtil.getChartTextColor() },
      grid: { color: ColorUtil.getChartGridColor() },
    },
  },
  plugins: { legend: { display: false } },
}))
</script>

<template>
  <BaseChartComponent type="line" :data="data" :options="options" />
</template>
