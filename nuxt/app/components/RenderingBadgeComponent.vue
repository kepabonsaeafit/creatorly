<script setup lang="ts">
// Author: Kevin Pabón

// props
interface Props {
  /** Rendering mode of the page or section: SSG, SSR or CSR. */
  rendering: string
}

defineProps<Props>()
</script>

<template>
  <span class="rendering-badge">{{ rendering }}</span>
</template>

<style scoped>
.rendering-badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
