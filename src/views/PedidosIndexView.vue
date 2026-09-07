<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import PedidosPorEstadoChart from '@/components/charts/PedidosPorEstadoChart.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import PedidosTable from '@/components/PedidosTable.vue'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { MarcaService } from '@/services/MarcaService'
import { PedidoService } from '@/services/PedidoService'
import { getChartPalette } from '@/utils/chartColors'
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

const porEstado = computed(() => PedidoService.getPedidosPorEstado(pedidos.value))

const paletaEstados = computed(() => getChartPalette())

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

    <DashboardCard v-if="pedidos.length > 0" class="pedidos__grafico">
      <div class="pedidos__grafico-header">
        <h2 class="pedidos__grafico-titulo">Pedidos por estado</h2>
        <span class="pedidos__grafico-total">{{ pedidos.length }} en total</span>
      </div>

      <div class="pedidos__grafico-cuerpo">
        <div class="pedidos__grafico-chart">
          <PedidosPorEstadoChart :datos="porEstado" :mostrar-leyenda="false" />
        </div>

        <ul class="pedidos__grafico-leyenda">
          <li v-for="(fila, indice) in porEstado" :key="fila.estado" class="pedidos__grafico-item">
            <span
              class="pedidos__grafico-punto"
              :style="{ backgroundColor: paletaEstados[indice] }"
            ></span>
            <span class="pedidos__grafico-label">{{ formatEstado(fila.estado) }}</span>
            <span class="pedidos__grafico-valor">{{ fila.cantidad }}</span>
          </li>
        </ul>
      </div>
    </DashboardCard>

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
