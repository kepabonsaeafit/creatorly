<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartType,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
} from 'chart.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// props
interface Props {
  type: ChartType
  data: ChartData
  options?: ChartOptions
}

const props = defineProps<Props>()

// non-reactive variables
let chart: Chart | null = null

// reactive variables
const canvas = ref<HTMLCanvasElement | null>(null)

// functions
Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Tooltip,
)

function render(): void {
  if (!canvas.value) return
  chart = new Chart(canvas.value, {
    type: props.type,
    data: props.data,
    options: props.options,
  })
}

function destroy(): void {
  chart?.destroy()
  chart = null
}

onMounted(render)
onUnmounted(destroy)

// watchers
watch(
  () => [props.type, props.data, props.options],
  () => {
    destroy()
    render()
  },
  { deep: true },
)
</script>

<template>
  <div class="base-chart">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.base-chart {
  position: relative;
  width: 100%;
  height: 260px;
}
</style>
