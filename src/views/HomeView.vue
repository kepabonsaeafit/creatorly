<script setup lang="ts">
// Kevin Pabón

// external imports
import { computed } from 'vue'

// internal imports
import ActivityList from '@/components/ActivityList.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import StatCardGrid from '@/components/StatCardGrid.vue'
import { OrderService } from '@/services/OrderService'

// computed variables
const stats = computed(() => OrderService.getStats())
const recentOrders = computed(() => OrderService.getRecentOrders())
</script>

<template>
  <main class="Panel dashboard">
    <h1>Dashboard</h1>

    <StatCardGrid :stats="stats" />

    <div class="dashboard__panels">
      <DashboardCard title="Recent orders">
        <ActivityList :items="recentOrders" />
      </DashboardCard>

      <DashboardCard title="Business charts">
        <p class="dashboard__hint">
          The charts (pie, bar and line with Chart.js) live on the
          <RouterLink :to="{ name: 'reports' }">Reports</RouterLink> page.
        </p>
      </DashboardCard>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.dashboard__panels {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.dashboard__hint {
  color: var(--color-text);
  opacity: 0.8;
}

@media (min-width: 1024px) {
  .dashboard__panels {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
