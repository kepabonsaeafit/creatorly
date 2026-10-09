<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import { AuthService } from '@/services/AuthService'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { BrandService } from '@/services/BrandService'
import BudgetByBrandChartComponent from '@/components/charts/BudgetByBrandChartComponent.vue'
import type { BudgetByBrandDTO } from '@/dtos/Reports/BudgetByBrandDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { CreatorService } from '@/services/CreatorService'
import DashboardCardComponent from '@/components/DashboardCardComponent.vue'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatStatus, STATUS_LABELS, toSelectOptions } from '@/utils/labels'
import type { OrderFilterDTO } from '@/dtos/Orders/OrderFilterDTO'
import type { OrderInterface } from '@/interfaces/OrderInterface'
import OrdersByCreatorChartComponent from '@/components/charts/OrdersByCreatorChartComponent.vue'
import type { OrdersByCreatorDTO } from '@/dtos/Reports/OrdersByCreatorDTO'
import OrdersByMonthChartComponent from '@/components/charts/OrdersByMonthChartComponent.vue'
import type { OrdersByMonthDTO } from '@/dtos/Reports/OrdersByMonthDTO'
import OrdersByStatusChartComponent from '@/components/charts/OrdersByStatusChartComponent.vue'
import type { OrdersByStatusDTO } from '@/dtos/Reports/OrdersByStatusDTO'
import { OrderService } from '@/services/OrderService'
import OrdersTableComponent from '@/components/OrdersTableComponent.vue'
import ReportTableComponent from '@/components/ReportTableComponent.vue'
import StatCardGridComponent from '@/components/StatCardGridComponent.vue'

/** Report types available in this view. */
type ReportType = 'month' | 'status' | 'creator' | 'brand'

/** An option of the report-type selector. */
interface ReportOption {
  id: ReportType
  label: string
}

// non-reactive variables
const toast = useToast()

const REPORT_OPTIONS: ReportOption[] = [
  { id: 'month', label: 'Orders by month' },
  { id: 'status', label: 'Orders by status' },
  { id: 'creator', label: 'Orders by creator' },
  { id: 'brand', label: 'Budget by brand' },
]

// reactive variables
const allOrders = ref<OrderInterface[]>([])
const brands = ref<BrandInterface[]>([])
const creators = ref<CreatorInterface[]>([])
const from = ref('')
const to = ref('')

// selectors
const filters = reactive<Pick<OrderFilterDTO, 'status' | 'brandId' | 'creatorId'>>({
  status: undefined,
  brandId: undefined,
  creatorId: undefined,
})

const reportType = ref<ReportType>('month')

// computed variables
const statusOptions = computed(() => toSelectOptions(STATUS_LABELS))

const completeFilters = computed<OrderFilterDTO>(() => ({
  ...filters,
  from: from.value,
  to: to.value,
}))

const filteredOrders = computed(() => OrderService.filter(allOrders.value, completeFilters.value))

const stats = computed(() => OrderService.getReportStats(filteredOrders.value))
const byStatus = computed(() => OrderService.getOrdersByStatus(filteredOrders.value))
const byCreator = computed(() =>
  OrderService.getOrdersByCreator(filteredOrders.value, creators.value),
)
const byBrand = computed(() => OrderService.getBudgetByBrand(filteredOrders.value, brands.value))
const byMonth = computed(() => OrderService.getOrdersByMonth(filteredOrders.value))

const currentReportOption = computed(
  () =>
    REPORT_OPTIONS.find((option: ReportOption): boolean => option.id === reportType.value) ??
    REPORT_OPTIONS[0],
)

const reportColumns = computed(() => {
  if (reportType.value === 'status') {
    return [
      { key: 'status', label: 'Status' },
      { key: 'count', label: 'Count' },
    ]
  }
  if (reportType.value === 'creator') {
    return [
      { key: 'creator', label: 'Creator' },
      { key: 'count', label: 'Count' },
    ]
  }
  if (reportType.value === 'brand') {
    return [
      { key: 'brand', label: 'Brand' },
      { key: 'budget', label: 'Budget' },
    ]
  }
  return [
    { key: 'month', label: 'Month' },
    { key: 'count', label: 'Count' },
    { key: 'budget', label: 'Budget' },
  ]
})

const reportRows = computed<Record<string, string>[]>(() => {
  if (reportType.value === 'status') {
    return byStatus.value.map((row: OrdersByStatusDTO): Record<string, string> => ({
      status: formatStatus(row.status),
      count: String(row.count),
    }))
  }
  if (reportType.value === 'creator') {
    return byCreator.value.map((row: OrdersByCreatorDTO): Record<string, string> => ({
      creator: row.creatorName,
      count: String(row.count),
    }))
  }
  if (reportType.value === 'brand') {
    return byBrand.value.map((row: BudgetByBrandDTO): Record<string, string> => ({
      brand: row.brandName,
      budget: formatCurrency(row.budget),
    }))
  }
  return byMonth.value.map((row: OrdersByMonthDTO): Record<string, string> => ({
    month: row.label,
    count: String(row.count),
    budget: formatCurrency(row.budget),
  }))
})

// functions
onMounted(async (): Promise<void> => {
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
    toast.error(AuthService.getErrorMessage(caughtError, 'It was not possible to load the reports'))
  }
})

function clearFilters(): void {
  filters.status = undefined
  filters.brandId = undefined
  filters.creatorId = undefined
  from.value = ''
  to.value = ''
}
</script>

<template>
  <main class="Panel reports">
    <h1>Reports</h1>

    <div class="reports__filters">
      <select v-model="filters.status" class="reports__filter-input">
        <option :value="undefined">All statuses</option>
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <select v-model="filters.brandId" class="reports__filter-input">
        <option :value="undefined">All brands</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>

      <select v-model="filters.creatorId" class="reports__filter-input">
        <option :value="undefined">All creators</option>
        <option v-for="creator in creators" :key="creator.id" :value="creator.id">
          {{ creator.name }}
        </option>
      </select>

      <label class="reports__filter-date">
        From
        <input v-model="from" class="reports__filter-input" type="date" />
      </label>

      <label class="reports__filter-date">
        To
        <input v-model="to" class="reports__filter-input" type="date" />
      </label>

      <button type="button" class="reports__clear" @click="clearFilters">Clear filters</button>
    </div>

    <p v-if="filteredOrders.length === 0" class="reports__empty">No orders match these filters.</p>

    <template v-else>
      <StatCardGridComponent :stats="stats" />

      <DashboardCardComponent class="reports__report">
        <div class="reports__report-header">
          <h2 class="reports__report-title">{{ currentReportOption.label }}</h2>
          <label class="reports__report-selector">
            Report type
            <select v-model="reportType" class="reports__filter-input">
              <option v-for="option in REPORT_OPTIONS" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="reportRows.length === 0" class="reports__empty">
          No data for "{{ currentReportOption.label }}" with these filters.
        </p>

        <div v-else class="reports__report-body">
          <ReportTableComponent :columns="reportColumns" :rows="reportRows" />

          <OrdersByMonthChartComponent v-if="reportType === 'month'" :items="byMonth" />
          <OrdersByStatusChartComponent v-else-if="reportType === 'status'" :items="byStatus" />
          <OrdersByCreatorChartComponent v-else-if="reportType === 'creator'" :items="byCreator" />
          <BudgetByBrandChartComponent v-else :items="byBrand" />
        </div>
      </DashboardCardComponent>

      <DashboardCardComponent title="Order details" class="reports__detail">
        <OrdersTableComponent :orders="filteredOrders" :brands="brands" :creators="creators" />
      </DashboardCardComponent>
    </template>
  </main>
</template>

<style scoped>
.reports__filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: end;
  margin: 1.5rem 0;
}

.reports__filter-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.reports__filter-date {
  display: grid;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text);
}

.reports__clear {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.reports__empty {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.reports__report {
  margin-top: 2rem;
}

.reports__report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.reports__report-title {
  color: var(--color-heading);
  font-size: 1.2rem;
}

.reports__report-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text);
}

.reports__report-body {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.reports__detail {
  margin-top: 1.5rem;
}

@media (min-width: 900px) {
  .reports__report-body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: start;
  }
}
</style>
