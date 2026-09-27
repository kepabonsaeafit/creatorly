<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChart from '@/components/charts/BaseChart.vue'
import type { BudgetByBrandDTO } from '@/dtos/BudgetByBrandDTO'
import { getChartGridColor, getChartPalette, getChartTextColor } from '@/utils/chartColors'
import { formatCurrency } from '@/utils/formatCurrency'

// props
const props = defineProps<{ items: BudgetByBrandDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.items.map((row) => row.brandName),
  datasets: [
    {
      label: 'Budget',
      data: props.items.map((row) => row.budget),
      backgroundColor: getChartPalette()[1],
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  scales: {
    x: { ticks: { color: getChartTextColor() }, grid: { display: false } },
    y: { ticks: { color: getChartTextColor() }, grid: { color: getChartGridColor() } },
  },
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (context) => formatCurrency(Number(context.raw)) } },
  },
}))
</script>

<template>
  <BaseChart type="bar" :data="data" :options="options" />
</template>
