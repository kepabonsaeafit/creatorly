<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChartComponent from '@/components/charts/BaseChartComponent.vue'
import { formatStatus } from '@/utils/labels'
import { getChartPalette, getChartTextColor } from '@/utils/chartColors'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'

// props
const props = withDefaults(defineProps<{ items: OrdersByStatusDTO[]; showLegend?: boolean }>(), {
  showLegend: true,
})

// computed variables
const data = computed<ChartData<'pie'>>(() => ({
  labels: props.items.map((row: OrdersByStatusDTO): string => formatStatus(row.status)),
  datasets: [
    {
      data: props.items.map((row: OrdersByStatusDTO): number => row.count),
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
  <BaseChartComponent type="pie" :data="data" :options="options" />
</template>
