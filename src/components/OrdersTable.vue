<script setup lang="ts">
// Felipe Gómez

// internal imports
import type { OrderInterface } from '@/interfaces/OrderInterface'
import { OrderService } from '@/services/OrderService'
import { confirmDeletion } from '@/utils/confirmDeletion'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { formatStatus } from '@/utils/labels'

withDefaults(defineProps<{ orders: OrderInterface[]; actionable?: boolean }>(), {
  actionable: false,
})

const emit = defineEmits<{ delete: [id: string] }>()

// functions
function brandName(order: OrderInterface): string {
  return OrderService.getBrand(order)?.name ?? 'Brand deleted'
}

function creatorName(order: OrderInterface): string {
  return OrderService.getCreator(order)?.name ?? 'Unassigned'
}

function onDelete(id: string): void {
  if (!confirmDeletion('order')) return
  emit('delete', id)
}
</script>

<template>
  <p v-if="orders.length === 0" class="orders-table__empty">No orders match these filters.</p>

  <table v-else class="orders-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Brand</th>
        <th>Creator</th>
        <th>Budget</th>
        <th>Status</th>
        <th>Request</th>
        <th>Delivery</th>
        <th v-if="actionable"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.description }}</td>
        <td>{{ brandName(order) }}</td>
        <td>{{ creatorName(order) }}</td>
        <td>{{ formatCurrency(order.budget) }}</td>
        <td>
          <span class="orders-table__badge" :class="`orders-table__badge--${order.status}`">
            {{ formatStatus(order.status) }}
          </span>
        </td>
        <td>{{ formatDate(order.requestDate) }}</td>
        <td>{{ formatDate(order.deliveryDate) }}</td>
        <td v-if="actionable" class="orders-table__actions">
          <RouterLink :to="{ name: 'orders.edit', params: { id: order.id } }">Edit</RouterLink>
          <button type="button" class="orders-table__delete" @click="onDelete(order.id)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.orders-table__empty {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.orders-table th,
.orders-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.orders-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.orders-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.orders-table__badge--delivered,
.orders-table__badge--approved {
  background: var(--color-success);
  color: var(--brand-white);
}

.orders-table__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.orders-table__delete {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}
</style>
