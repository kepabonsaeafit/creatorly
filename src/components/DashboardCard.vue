<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h2 v-if="title" class="dashboard-card__title">{{ title }}</h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.dashboard-card__title {
  color: var(--color-heading);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>
