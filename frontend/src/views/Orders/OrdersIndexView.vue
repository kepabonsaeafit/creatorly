<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { BrandService } from '@/services/BrandService'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'
import DashboardCard from '@/components/DashboardCard.vue'
import { formatStatus, STATUS_LABELS, toSelectOptions } from '@/utils/labels'
import { getChartPalette } from '@/utils/chartColors'
import type { OrderFilterDTO } from '@/dtos/Orders/OrderFilterDTO'
import type { OrderInterface } from '@/interfaces/OrderInterface'
import OrdersByStatusChart from '@/components/charts/OrdersByStatusChart.vue'
import { OrderService } from '@/services/OrderService'
import OrdersTable from '@/components/OrdersTable.vue'

// selectors
const filters = reactive<Pick<OrderFilterDTO, 'status' | 'brandId'>>({
  status: undefined,
  brandId: undefined,
})

// non-reactive variables
const toast = useToast()

// reactive variables
const allOrders = ref<OrderInterface[]>([])
const brands = ref<BrandInterface[]>([])
const creators = ref<CreatorInterface[]>([])
const text = ref('')

// computed variables
const statusOptions = computed(() => toSelectOptions(STATUS_LABELS))

const completeFilters = computed<OrderFilterDTO>(() => ({ ...filters, text: text.value }))

const orders = computed(() => OrderService.filterSorted(allOrders.value, completeFilters.value))

const byStatus = computed(() => OrderService.getOrdersByStatus(orders.value))

const statusPalette = computed(() => getChartPalette())

// functions
async function loadOrders(): Promise<void> {
  try {
    const [loadedOrders, loadedBrands, loadedCreators] = await Promise.all([
      OrderService.getAll(),
      BrandService.getAll(),
      CreatorService.getAll(),
    ])

    allOrders.value = loadedOrders
    brands.value = loadedBrands
    creators.value = loadedCreators
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the orders'))
  }
}

onMounted(loadOrders)

async function onDelete(id: number): Promise<void> {
  try {
    await OrderService.remove(id)
    toast.success('Order deleted successfully')
    await loadOrders()
  } catch (caughtError) {
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to delete the order'))
  }
}

function clearFilters(): void {
  filters.status = undefined
  filters.brandId = undefined
  text.value = ''
}
</script>

<template>
  <main class="Panel orders">
    <div class="orders__header">
      <h1>Orders</h1>
      <RouterLink class="orders__create" :to="{ name: 'orders.create' }">New order</RouterLink>
    </div>

    <div class="orders__filters">
      <input
        v-model="text"
        class="orders__filter-input"
        type="search"
        placeholder="Search by description…"
      />

      <select v-model="filters.status" class="orders__filter-input">
        <option :value="undefined">All statuses</option>
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <select v-model="filters.brandId" class="orders__filter-input">
        <option :value="undefined">All brands</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>

      <button type="button" class="orders__clear" @click="clearFilters">Clear filters</button>
    </div>

    <DashboardCard v-if="orders.length > 0" class="orders__chart">
      <div class="orders__chart-header">
        <h2 class="orders__chart-title">Orders by status</h2>
        <span class="orders__chart-total">{{ orders.length }} total</span>
      </div>

      <div class="orders__chart-body">
        <div class="orders__chart-canvas">
          <OrdersByStatusChart :items="byStatus" :show-legend="false" />
        </div>

        <ul class="orders__chart-legend">
          <li v-for="(row, index) in byStatus" :key="row.status" class="orders__chart-item">
            <span
              class="orders__chart-dot"
              :style="{ backgroundColor: statusPalette[index] }"
            ></span>
            <span class="orders__chart-label">{{ formatStatus(row.status) }}</span>
            <span class="orders__chart-value">{{ row.count }}</span>
          </li>
        </ul>
      </div>
    </DashboardCard>

    <OrdersTable
      :orders="orders"
      :brands="brands"
      :creators="creators"
      actionable
      @delete="onDelete"
    />
  </main>
</template>

<style scoped>
.orders__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.orders__create {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
}

.orders__filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.orders__chart {
  margin-bottom: 1.5rem;
  max-width: 560px;
}

.orders__chart-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.orders__chart-title {
  color: var(--color-heading);
  font-size: 1.05rem;
}

.orders__chart-total {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.65;
}

.orders__chart-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.orders__chart-canvas {
  width: 150px;
  flex-shrink: 0;
}

.orders__chart-canvas :deep(.base-chart) {
  height: 150px;
}

.orders__chart-legend {
  display: grid;
  gap: 0.5rem;
  flex: 1;
  list-style: none;
}

.orders__chart-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text);
}

.orders__chart-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.orders__chart-label {
  flex: 1;
}

.orders__chart-value {
  font-weight: 600;
  color: var(--color-heading);
}

.orders__filter-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.orders__clear {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
