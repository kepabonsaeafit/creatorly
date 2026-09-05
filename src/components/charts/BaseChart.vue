<script setup lang="ts">
// Felipe Gómez

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
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Tooltip,
} from 'chart.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'

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

interface Props {
  type: ChartType
  data: ChartData
  options?: ChartOptions
}

const props = defineProps<Props>()

// selectors
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// functions
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
