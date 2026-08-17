<script setup>
import StatCardGrid from '@/components/StatCardGrid.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import ActivityList from '@/components/ActivityList.vue'
import { useHomeStats } from '@/composables/useHomeStats'

const { stats, recentPedidos } = useHomeStats()
</script>

<template>
  <main class="Panel dashboard">
    <h1>Panel de Control</h1>

    <StatCardGrid :stats="stats" />

    <div class="dashboard__panels">
      <DashboardCard title="Pedidos recientes">
        <ActivityList :items="recentPedidos" />
      </DashboardCard>

      <DashboardCard title="Gráficos del negocio">
        <p class="dashboard__hint">
          Los gráficos (pie, barras y línea con Chart.js) viven en la página
          <RouterLink to="/reportes">Reportes</RouterLink>.
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
