<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  delta: {
    type: Number,
    default: null,
  },
  unit: {
    type: String,
    default: '',
  },
})

const formattedValue = computed(() => `${props.unit}${props.value.toLocaleString()}`)

const deltaClass = computed(() => {
  if (props.delta === null) return ''
  return props.delta >= 0 ? 'positive' : 'negative'
})
</script>

<template>
  <div class="stat-card">
    <p class="stat-card__label">{{ label }}</p>
    <p class="stat-card__value">{{ formattedValue }}</p>
    <p v-if="delta !== null" class="stat-card__delta" :class="deltaClass">
      {{ delta >= 0 ? '+' : '' }}{{ delta }}%
    </p>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.stat-card__label {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.stat-card__value {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-top: 0.25rem;
}

.stat-card__delta {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.stat-card__delta.positive {
  color: var(--color-success);
}

.stat-card__delta.negative {
  color: var(--color-danger);
}
</style>
