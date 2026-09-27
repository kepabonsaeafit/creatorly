<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import OrdersByStatusChart from '@/components/charts/OrdersByStatusChart.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import OrdersTable from '@/components/OrdersTable.vue'
import type { OrderFilterDTO } from '@/dtos/OrderFilterDTO'
import { STATUSES } from '@/interfaces/OrderInterface'
import { BrandService } from '@/services/BrandService'
import { OrderService } from '@/services/OrderService'
import { getChartPalette } from '@/utils/chartColors'
import { formatStatus } from '@/utils/formatStatus'

const toast = useToast()

// selectors
const filters = reactive<Pick<OrderFilterDTO, 'status' | 'brandId'>>({
  status: undefined,
  brandId: undefined,
})

// state
const text = ref('')

// computed variables
const brands = computed(() => BrandService.getAll())

const completeFilters = computed<OrderFilterDTO>(() => ({ ...filters, text: text.value }))

const orders = computed(() => {
  const allOrders = OrderService.getAll()
  return OrderService.filterSorted(allOrders, completeFilters.value)
})

const byStatus = computed(() => OrderService.getOrdersByStatus(orders.value))

const statusPalette = computed(() => getChartPalette())

// functions
function onDelete(id: string): void {
  const removed = OrderService.remove(id)
  if (removed) {
    toast.success('Pedido eliminado correctamente')
  } else {
    toast.error('No fue posible eliminar el pedido')
  }
}

function clearFilters(): void {
  filters.status = undefined
  filters.brandId = undefined
  text.value = ''
}
</script>

<template>
  <main class="Panel pedidos">
    <div class="pedidos__header">
      <h1>Pedidos</h1>
      <RouterLink class="pedidos__crear" :to="{ name: 'pedidos.create' }">Nuevo pedido</RouterLink>
    </div>

    <div class="pedidos__filtros">
      <input
        v-model="text"
        class="pedidos__filtro-input"
        type="search"
        placeholder="Buscar por descripción…"
      />

      <select v-model="filters.status" class="pedidos__filtro-input">
        <option :value="undefined">Todos los estados</option>
        <option v-for="option in STATUSES" :key="option" :value="option">
          {{ formatStatus(option) }}
        </option>
      </select>

      <select v-model="filters.brandId" class="pedidos__filtro-input">
        <option :value="undefined">Todas las marcas</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>

      <button type="button" class="pedidos__limpiar" @click="clearFilters">Limpiar filtros</button>
    </div>

    <DashboardCard v-if="orders.length > 0" class="pedidos__grafico">
      <div class="pedidos__grafico-header">
        <h2 class="pedidos__grafico-titulo">Pedidos por estado</h2>
        <span class="pedidos__grafico-total">{{ orders.length }} en total</span>
      </div>

      <div class="pedidos__grafico-cuerpo">
        <div class="pedidos__grafico-chart">
          <OrdersByStatusChart :items="byStatus" :show-legend="false" />
        </div>

        <ul class="pedidos__grafico-leyenda">
          <li v-for="(row, index) in byStatus" :key="row.status" class="pedidos__grafico-item">
            <span
              class="pedidos__grafico-punto"
              :style="{ backgroundColor: statusPalette[index] }"
            ></span>
            <span class="pedidos__grafico-label">{{ formatStatus(row.status) }}</span>
            <span class="pedidos__grafico-valor">{{ row.count }}</span>
          </li>
        </ul>
      </div>
    </DashboardCard>

    <OrdersTable :orders="orders" actionable @delete="onDelete" />
  </main>
</template>

<style scoped>
.pedidos__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.pedidos__crear {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
}

.pedidos__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.pedidos__grafico {
  margin-bottom: 1.5rem;
  max-width: 560px;
}

.pedidos__grafico-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.pedidos__grafico-titulo {
  color: var(--color-heading);
  font-size: 1.05rem;
}

.pedidos__grafico-total {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

.pedidos__grafico-cuerpo {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.pedidos__grafico-chart {
  width: 150px;
  flex-shrink: 0;
}

.pedidos__grafico-chart :deep(.base-chart) {
  height: 150px;
}

.pedidos__grafico-leyenda {
  display: grid;
  gap: 0.5rem;
  flex: 1;
  list-style: none;
}

.pedidos__grafico-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text);
}

.pedidos__grafico-punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pedidos__grafico-label {
  flex: 1;
}

.pedidos__grafico-valor {
  font-weight: 600;
  color: var(--color-heading);
}

.pedidos__filtro-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.pedidos__limpiar {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
