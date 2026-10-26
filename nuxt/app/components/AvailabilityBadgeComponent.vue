<script setup lang="ts">
// Author: Kevin Pabón

// props
interface Props {
  /** Whether the creator can take new orders. */
  available: boolean
}

defineProps<Props>()
</script>

<template>
  <span
    class="availability-badge"
    :class="available ? 'availability-badge--available' : 'availability-badge--busy'"
  >
    {{ available ? 'Available' : 'Not available' }}
  </span>
</template>

<style scoped>
.availability-badge {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.availability-badge--available {
  background: var(--color-success);
  color: var(--brand-white);
}

.availability-badge--busy {
  background: var(--color-background-mute);
  color: var(--color-text);
}
</style>
