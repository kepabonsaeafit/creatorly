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
  return OrderService.getBrand(order)?.name ?? 'Marca eliminada'
}

function creatorName(order: OrderInterface): string {
  return OrderService.getCreator(order)?.name ?? 'Sin asignar'
}

function onDelete(id: string): void {
  if (!confirmDeletion('pedido')) return
  emit('delete', id)
}
</script>

<template>
  <p v-if="orders.length === 0" class="pedidos-table__vacio">
    No hay pedidos que coincidan con estos filtros.
  </p>

  <table v-else class="pedidos-table">
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Marca</th>
        <th>Creador</th>
        <th>Presupuesto</th>
        <th>Estado</th>
        <th>Solicitud</th>
        <th>Entrega</th>
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
          <span class="pedidos-table__badge" :class="`pedidos-table__badge--${order.status}`">
            {{ formatStatus(order.status) }}
          </span>
        </td>
        <td>{{ formatDate(order.requestDate) }}</td>
        <td>{{ formatDate(order.deliveryDate) }}</td>
        <td v-if="actionable" class="pedidos-table__acciones">
          <RouterLink :to="{ name: 'orders.edit', params: { id: order.id } }">Editar</RouterLink>
          <button type="button" class="pedidos-table__eliminar" @click="onDelete(order.id)">
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.pedidos-table__vacio {
  color: var(--color-text);
  opacity: 0.75;
  padding: 2rem 0;
  text-align: center;
}

.pedidos-table {
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
  display: block;
}

.pedidos-table th,
.pedidos-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.pedidos-table th {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.pedidos-table__badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  background: var(--color-background-mute);
  color: var(--color-text);
}

.pedidos-table__badge--delivered,
.pedidos-table__badge--approved {
  background: var(--color-success);
  color: var(--brand-white);
}

.pedidos-table__acciones {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.pedidos-table__eliminar {
  border: none;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  font: inherit;
}
</style>
