<script setup>
import StatCard from '@/components/StatCard.vue'

defineProps({
  stats: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="stat-grid">
    <StatCard v-for="stat in stats" :key="stat.id" v-bind="stat" />
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
