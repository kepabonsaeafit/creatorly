<script setup>
defineProps({
  label: {
    type: String,
    default: '¡Gráfico próximamente!',
  },
})
</script>

<template>
  <div class="chart-placeholder">
    <slot>
      <p class="chart-placeholder__label">{{ label }}</p>
    </slot>
  </div>
</template>

<style scoped>
.chart-placeholder {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-border-hover);
  border-radius: 8px;
  background: var(--color-background-mute);
}

.chart-placeholder__label {
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.9rem;
}
</style>
