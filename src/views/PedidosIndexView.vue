<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import PedidosTable from '@/components/PedidosTable.vue'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { MarcaService } from '@/services/MarcaService'
import { PedidoService } from '@/services/PedidoService'
import { formatEstado } from '@/utils/formatEstado'

const ESTADOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado']

const toast = useToast()

// selectors
const filtro = reactive<PedidoFiltroDTO>({ estado: undefined, marcaId: undefined, texto: '' })

// computed variables
const marcas = computed(() => MarcaService.getAll())

const pedidos = computed(() => {
  const todos = PedidoService.getAll()
  return PedidoService.filtrar(todos, filtro).sort((a, b) =>
    b.fechaSolicitud.localeCompare(a.fechaSolicitud),
  )
})

// functions
function onEliminar(id: string): void {
  const eliminado = PedidoService.remove(id)
  if (eliminado) {
    toast.success('Pedido eliminado correctamente')
  } else {
    toast.error('No fue posible eliminar el pedido')
  }
}

function limpiarFiltros(): void {
  filtro.estado = undefined
  filtro.marcaId = undefined
  filtro.texto = ''
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
        v-model="filtro.texto"
        class="pedidos__filtro-input"
        type="search"
        placeholder="Buscar por descripción…"
      />

      <select v-model="filtro.estado" class="pedidos__filtro-input">
        <option :value="undefined">Todos los estados</option>
        <option v-for="opcion in ESTADOS" :key="opcion" :value="opcion">
          {{ formatEstado(opcion) }}
        </option>
      </select>

      <select v-model="filtro.marcaId" class="pedidos__filtro-input">
        <option :value="undefined">Todas las marcas</option>
        <option v-for="marca in marcas" :key="marca.id" :value="marca.id">
          {{ marca.nombre }}
        </option>
      </select>

      <button type="button" class="pedidos__limpiar" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </div>

    <PedidosTable :pedidos="pedidos" accionable @eliminar="onEliminar" />
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
  color: #ffffff;
  font-weight: 600;
}

.pedidos__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
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
