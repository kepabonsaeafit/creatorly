<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const width = 100
const height = 30

const points = computed(() => {
  const min = Math.min(...props.data)
  const max = Math.max(...props.data)
  const range = max - min || 1

  return props.data
    .map((value, index) => {
      const x = (index / (props.data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
})

const trendClass = computed(() => {
  return props.data[props.data.length - 1] >= props.data[0] ? 'positive' : 'negative'
})
</script>

<template>
  <svg
    class="trend-sparkline"
    :class="trendClass"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
  >
    <polyline :points="points" fill="none" stroke="currentColor" stroke-width="2" />
  </svg>
</template>

<style scoped>
.trend-sparkline {
  width: 100%;
  height: 32px;
  display: block;
}

.trend-sparkline.positive {
  color: var(--color-success);
}

.trend-sparkline.negative {
  color: var(--color-danger);
}
</style>
