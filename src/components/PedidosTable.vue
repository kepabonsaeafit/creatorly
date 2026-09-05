<script setup lang="ts">
// Felipe Gómez

// internal imports
import type { PedidoInterface } from '@/interfaces/PedidoInterface'
import { PedidoService } from '@/services/PedidoService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { formatEstado } from '@/utils/formatEstado'

withDefaults(defineProps<{ pedidos: PedidoInterface[]; accionable?: boolean }>(), {
  accionable: false,
})

const emit = defineEmits<{ eliminar: [id: string] }>()

// functions
function nombreMarca(pedido: PedidoInterface): string {
  return PedidoService.getMarca(pedido)?.nombre ?? 'Marca eliminada'
}

function nombreCreador(pedido: PedidoInterface): string {
  return PedidoService.getCreador(pedido)?.nombre ?? 'Sin asignar'
}

function onEliminar(id: string): void {
  if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return
  emit('eliminar', id)
}
</script>

<template>
  <p v-if="pedidos.length === 0" class="pedidos-table__vacio">
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
        <th v-if="accionable"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="pedido in pedidos" :key="pedido.id">
        <td>{{ pedido.descripcion }}</td>
        <td>{{ nombreMarca(pedido) }}</td>
        <td>{{ nombreCreador(pedido) }}</td>
        <td>{{ formatCurrency(pedido.presupuesto) }}</td>
        <td>
          <span class="pedidos-table__badge" :class="`pedidos-table__badge--${pedido.estado}`">
            {{ formatEstado(pedido.estado) }}
          </span>
        </td>
        <td>{{ formatDate(pedido.fechaSolicitud) }}</td>
        <td>{{ formatDate(pedido.fechaEntrega) }}</td>
        <td v-if="accionable" class="pedidos-table__acciones">
          <RouterLink :to="{ name: 'pedidos.edit', params: { id: pedido.id } }">Editar</RouterLink>
          <button type="button" class="pedidos-table__eliminar" @click="onEliminar(pedido.id)">
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

.pedidos-table__badge--entregado,
.pedidos-table__badge--aprobado {
  background: var(--color-success);
  color: #ffffff;
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
