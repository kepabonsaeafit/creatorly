<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { computed } from 'vue'

// internal imports
import BaseChartComponent from '@/components/charts/BaseChartComponent.vue'
import type { BudgetByBrandDTO } from '@/dtos/Reports/BudgetByBrandDTO'
import { ColorUtil } from '@/utils/ColorUtil'
import { CurrencyUtil } from '@/utils/CurrencyUtil'

// props
const props = defineProps<{ items: BudgetByBrandDTO[] }>()

// computed variables
const data = computed<ChartData<'bar'>>(() => ({
  labels: props.items.map((row: BudgetByBrandDTO): string => row.brandName),
  datasets: [
    {
      label: 'Budget',
      data: props.items.map((row: BudgetByBrandDTO): number => row.budget),
      backgroundColor: ColorUtil.getChartPalette()[1],
    },
  ],
}))

const options = computed<ChartOptions<'bar'>>(() => ({
  scales: {
    x: { ticks: { color: ColorUtil.getChartTextColor() }, grid: { display: false } },
    y: {
      ticks: { color: ColorUtil.getChartTextColor() },
      grid: { color: ColorUtil.getChartGridColor() },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'bar'>): string => CurrencyUtil.format(Number(context.raw)),
      },
    },
  },
}))
</script>

<template>
  <BaseChartComponent type="bar" :data="data" :options="options" />
</template>
