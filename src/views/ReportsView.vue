<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive, ref } from 'vue'

// internal imports
import BudgetByBrandChart from '@/components/charts/BudgetByBrandChart.vue'
import OrdersByCreatorChart from '@/components/charts/OrdersByCreatorChart.vue'
import OrdersByMonthChart from '@/components/charts/OrdersByMonthChart.vue'
import OrdersByStatusChart from '@/components/charts/OrdersByStatusChart.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import OrdersTable from '@/components/OrdersTable.vue'
import ReportTable from '@/components/ReportTable.vue'
import StatCardGrid from '@/components/StatCardGrid.vue'
import type { OrderFilterDTO } from '@/dtos/OrderFilterDTO'
import { STATUSES } from '@/interfaces/OrderInterface'
import type { ReportOption, ReportType } from '@/interfaces/ReportInterface'
import type { ReportTableColumn } from '@/interfaces/ReportTableColumnInterface'
import { BrandService } from '@/services/BrandService'
import { CreatorService } from '@/services/CreatorService'
import { OrderService } from '@/services/OrderService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatStatus } from '@/utils/formatStatus'

const REPORT_OPTIONS: ReportOption[] = [
  { id: 'month', label: 'Pedidos por mes' },
  { id: 'status', label: 'Pedidos por estado' },
  { id: 'creator', label: 'Pedidos por creador' },
  { id: 'brand', label: 'Presupuesto por marca' },
]

// selectors
const filters = reactive<Pick<OrderFilterDTO, 'status' | 'brandId' | 'creatorId'>>({
  status: undefined,
  brandId: undefined,
  creatorId: undefined,
})

const reportType = ref<ReportType>('month')

// state
const from = ref('')
const to = ref('')

// computed variables
const brands = computed(() => BrandService.getAll())
const creators = computed(() => CreatorService.getAll())

const completeFilters = computed<OrderFilterDTO>(() => ({
  ...filters,
  from: from.value,
  to: to.value,
}))

const filteredOrders = computed(() =>
  OrderService.filter(OrderService.getAll(), completeFilters.value),
)

const stats = computed(() => OrderService.getReportStats(filteredOrders.value))
const byStatus = computed(() => OrderService.getOrdersByStatus(filteredOrders.value))
const byCreator = computed(() => OrderService.getOrdersByCreator(filteredOrders.value))
const byBrand = computed(() => OrderService.getBudgetByBrand(filteredOrders.value))
const byMonth = computed(() => OrderService.getOrdersByMonth(filteredOrders.value))

const currentReportOption = computed(
  () => REPORT_OPTIONS.find((option) => option.id === reportType.value) ?? REPORT_OPTIONS[0],
)

const reportColumns = computed<ReportTableColumn[]>(() => {
  if (reportType.value === 'status') {
    return [
      { key: 'status', label: 'Estado' },
      { key: 'count', label: 'Cantidad' },
    ]
  }
  if (reportType.value === 'creator') {
    return [
      { key: 'creator', label: 'Creador' },
      { key: 'count', label: 'Cantidad' },
    ]
  }
  if (reportType.value === 'brand') {
    return [
      { key: 'brand', label: 'Marca' },
      { key: 'budget', label: 'Presupuesto' },
    ]
  }
  return [
    { key: 'month', label: 'Mes' },
    { key: 'count', label: 'Cantidad' },
    { key: 'budget', label: 'Presupuesto' },
  ]
})

const reportRows = computed<Record<string, string>[]>(() => {
  if (reportType.value === 'status') {
    return byStatus.value.map((row) => ({
      status: formatStatus(row.status),
      count: String(row.count),
    }))
  }
  if (reportType.value === 'creator') {
    return byCreator.value.map((row) => ({
      creator: row.creatorName,
      count: String(row.count),
    }))
  }
  if (reportType.value === 'brand') {
    return byBrand.value.map((row) => ({
      brand: row.brandName,
      budget: formatCurrency(row.budget),
    }))
  }
  return byMonth.value.map((row) => ({
    month: row.label,
    count: String(row.count),
    budget: formatCurrency(row.budget),
  }))
})

// functions
function clearFilters(): void {
  filters.status = undefined
  filters.brandId = undefined
  filters.creatorId = undefined
  from.value = ''
  to.value = ''
}
</script>

<template>
  <main class="Panel reportes">
    <h1>Reportes</h1>

    <div class="reportes__filtros">
      <select v-model="filters.status" class="reportes__filtro-input">
        <option :value="undefined">Todos los estados</option>
        <option v-for="option in STATUSES" :key="option" :value="option">
          {{ formatStatus(option) }}
        </option>
      </select>

      <select v-model="filters.brandId" class="reportes__filtro-input">
        <option :value="undefined">Todas las marcas</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>

      <select v-model="filters.creatorId" class="reportes__filtro-input">
        <option :value="undefined">Todos los creadores</option>
        <option v-for="creator in creators" :key="creator.id" :value="creator.id">
          {{ creator.name }}
        </option>
      </select>

      <label class="reportes__filtro-fecha">
        Desde
        <input v-model="from" class="reportes__filtro-input" type="date" />
      </label>

      <label class="reportes__filtro-fecha">
        Hasta
        <input v-model="to" class="reportes__filtro-input" type="date" />
      </label>

      <button type="button" class="reportes__limpiar" @click="clearFilters">Limpiar filtros</button>
    </div>

    <p v-if="filteredOrders.length === 0" class="reportes__vacio">
      No hay pedidos que coincidan con estos filtros.
    </p>

    <template v-else>
      <StatCardGrid :stats="stats" />

      <DashboardCard class="reportes__reporte">
        <div class="reportes__reporte-header">
          <h2 class="reportes__reporte-titulo">{{ currentReportOption.label }}</h2>
          <label class="reportes__reporte-selector">
            Tipo de reporte
            <select v-model="reportType" class="reportes__filtro-input">
              <option v-for="option in REPORT_OPTIONS" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="reportRows.length === 0" class="reportes__vacio">
          No hay datos para «{{ currentReportOption.label }}» con estos filtros.
        </p>

        <div v-else class="reportes__reporte-cuerpo">
          <ReportTable :columns="reportColumns" :rows="reportRows" />

          <OrdersByMonthChart v-if="reportType === 'month'" :items="byMonth" />
          <OrdersByStatusChart v-else-if="reportType === 'status'" :items="byStatus" />
          <OrdersByCreatorChart v-else-if="reportType === 'creator'" :items="byCreator" />
          <BudgetByBrandChart v-else :items="byBrand" />
        </div>
      </DashboardCard>

      <DashboardCard title="Detalle de pedidos" class="reportes__detalle">
        <OrdersTable :orders="filteredOrders" />
      </DashboardCard>
    </template>
  </main>
</template>

<style scoped>
.reportes__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: end;
  margin: 1.5rem 0;
}

.reportes__filtro-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.reportes__filtro-fecha {
  display: grid;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text);
}

.reportes__limpiar {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.reportes__vacio {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.reportes__reporte {
  margin-top: 2rem;
}

.reportes__reporte-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.reportes__reporte-titulo {
  color: var(--color-heading);
  font-size: 1.2rem;
}

.reportes__reporte-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text);
}

.reportes__reporte-cuerpo {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.reportes__detalle {
  margin-top: 1.5rem;
}

@media (min-width: 900px) {
  .reportes__reporte-cuerpo {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: start;
  }
}
</style>
