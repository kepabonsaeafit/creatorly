<script setup lang="ts">
// Author: Kevin Pabón

// external imports
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import ActivityListComponent from '@/components/ActivityListComponent.vue'
import { BrandService } from '@/services/BrandService'
import DashboardCardComponent from '@/components/DashboardCardComponent.vue'
import { ErrorUtil } from '@/utils/ErrorUtil'
import type { HomeStatInterface } from '@/interfaces/HomeStatInterface'
import type { OrderActivityInterface } from '@/interfaces/OrderActivityInterface'
import { OrderService } from '@/services/OrderService'
import { ReportUtil } from '@/utils/ReportUtil'
import StatCardGridComponent from '@/components/StatCardGridComponent.vue'

// non-reactive variables
const toast = useToast()

// reactive variables
const stats = ref<HomeStatInterface[]>([])
const recentOrders = ref<OrderActivityInterface[]>([])
const loading = ref(true)

// functions
onMounted(async (): Promise<void> => {
  try {
    const [orders, brands] = await Promise.all([OrderService.getAll(), BrandService.getAll()])

    stats.value = ReportUtil.getStats(orders)
    recentOrders.value = ReportUtil.getRecentOrders(orders, brands)
  } catch (caughtError) {
    toast.error(ErrorUtil.getMessage(caughtError, 'It was not possible to load the dashboard'))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="Panel dashboard">
    <h1>Dashboard</h1>

    <p v-if="loading" class="dashboard__loading">Loading dashboard…</p>

    <template v-else>
      <StatCardGridComponent :stats="stats" />

      <div class="dashboard__panels">
        <DashboardCardComponent title="Recent orders">
          <ActivityListComponent :items="recentOrders" />
        </DashboardCardComponent>

        <DashboardCardComponent title="Business charts">
          <p class="dashboard__hint">
            The charts (pie, bar and line with Chart.js) live on the
            <RouterLink :to="{ name: 'reports' }">Reports</RouterLink> page.
          </p>
        </DashboardCardComponent>
      </div>
    </template>
  </main>
</template>

<style scoped>
.dashboard__loading {
  color: var(--color-text);
  opacity: 0.75;
}

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
