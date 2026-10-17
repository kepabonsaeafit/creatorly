<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChartComponent from '@/components/charts/BaseChartComponent.vue'
import { ColorUtil } from '@/utils/ColorUtil'
import { LabelUtil } from '@/utils/LabelUtil'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'

// props
const props = withDefaults(defineProps<{ items: OrdersByStatusDTO[]; showLegend?: boolean }>(), {
  showLegend: true,
})

// computed variables
const data = computed<ChartData<'pie'>>(() => ({
  labels: props.items.map((row: OrdersByStatusDTO): string => LabelUtil.formatStatus(row.status)),
  datasets: [
    {
      data: props.items.map((row: OrdersByStatusDTO): number => row.count),
      backgroundColor: ColorUtil.getChartPalette(),
    },
  ],
}))

const options = computed<ChartOptions<'pie'>>(() => ({
  plugins: {
    legend: {
      display: props.showLegend,
      labels: { color: ColorUtil.getChartTextColor() },
    },
  },
}))
</script>

<template>
  <BaseChartComponent type="pie" :data="data" :options="options" />
</template>
