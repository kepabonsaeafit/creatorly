<script setup lang="ts">
// Kevin Pabón

// internal imports
import StatCard from '@/components/StatCard.vue'
import type { HomeStat } from '@/services/PedidoService'

defineProps<{ stats: HomeStat[] }>()
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
