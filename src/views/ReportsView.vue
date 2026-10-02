<script setup lang="ts">
// Author: Felipe Gómez

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
import { BrandService } from '@/services/BrandService'
import { CreatorService } from '@/services/CreatorService'
import { OrderService } from '@/services/OrderService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatStatus, STATUS_LABELS, toSelectOptions } from '@/utils/labels'

/** Report types available in this view. */
type ReportType = 'month' | 'status' | 'creator' | 'brand'

/** An option of the report-type selector. */
interface ReportOption {
  id: ReportType
  label: string
}

const REPORT_OPTIONS: ReportOption[] = [
  { id: 'month', label: 'Orders by month' },
  { id: 'status', label: 'Orders by status' },
  { id: 'creator', label: 'Orders by creator' },
  { id: 'brand', label: 'Budget by brand' },
]

// selectors
const filters = reactive<Pick<OrderFilterDTO, 'status' | 'brandId' | 'creatorId'>>({
  status: undefined,
  brandId: undefined,
  creatorId: undefined,
})

const reportType = ref<ReportType>('month')

// reactive variables
const from = ref('')
const to = ref('')

// computed variables
const brands = computed(() => BrandService.getAll())
const creators = computed(() => CreatorService.getAll())
const statusOptions = computed(() => toSelectOptions(STATUS_LABELS))

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
      <StatCardGrid :stats="stats" />

      <DashboardCard class="reports__report">
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
          <ReportTable :columns="reportColumns" :rows="reportRows" />

          <OrdersByMonthChart v-if="reportType === 'month'" :items="byMonth" />
          <OrdersByStatusChart v-else-if="reportType === 'status'" :items="byStatus" />
          <OrdersByCreatorChart v-else-if="reportType === 'creator'" :items="byCreator" />
          <BudgetByBrandChart v-else :items="byBrand" />
        </div>
      </DashboardCard>

      <DashboardCard title="Order details" class="reports__detail">
        <OrdersTable :orders="filteredOrders" />
      </DashboardCard>
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
