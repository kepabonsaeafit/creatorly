<script setup lang="ts">
// Author: Kevin Pabón

// external imports
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import ActivityList from '@/components/ActivityList.vue'
import { AuthService } from '@/services/AuthService'
import { BrandService } from '@/services/BrandService'
import DashboardCard from '@/components/DashboardCard.vue'
import { type HomeStat, type OrderActivity, OrderService } from '@/services/OrderService'
import StatCardGrid from '@/components/StatCardGrid.vue'

// non-reactive variables
const toast = useToast()

// reactive variables
const stats = ref<HomeStat[]>([])
const recentOrders = ref<OrderActivity[]>([])

// functions
onMounted(async () => {
  try {
    const [orders, brands] = await Promise.all([OrderService.getAll(), BrandService.getAll()])

    stats.value = OrderService.getStats(orders)
    recentOrders.value = OrderService.getRecentOrders(orders, brands)
  } catch (caughtError) {
    toast.error(
      AuthService.getErrorMessage(caughtError, 'It was not possible to load the dashboard'),
    )
  }
})
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
