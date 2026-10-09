<script setup lang="ts">
// Author: Kevin Pabón

// internal imports
import type { HomeStat } from '@/services/OrderService'
import StatCardComponent from '@/components/StatCardComponent.vue'

// props
defineProps<{ stats: HomeStat[] }>()
</script>

<template>
  <div class="stat-grid">
    <StatCardComponent v-for="stat in stats" :key="stat.id" v-bind="stat" />
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
</style>
