<script setup>
import { useDashboardData } from '@/composables/useDashboardData'
import StatCardGrid from '@/components/StatCardGrid.vue'
import ActivityList from '@/components/ActivityList.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import ChartPlaceholder from '@/components/ChartPlaceholder.vue'

const { stats, activity } = useDashboardData()
</script>

<template>
  <main class="Panel dashboard">
    <h1>Panel de Control</h1>

    <StatCardGrid :stats="stats" />

    <div class="dashboard__panels">
      <DashboardCard title="Resumen de Crecimiento">
        <ChartPlaceholder label="Grafica De Crecimiento Pronto!" />
      </DashboardCard>

      <DashboardCard title="Actividad Reciente">
        <ActivityList :items="activity" />
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

@media (min-width: 1024px) {
  .dashboard__panels {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
