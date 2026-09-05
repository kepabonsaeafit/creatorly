<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive } from 'vue'

// internal imports
import PedidosPorCreadorChart from '@/components/charts/PedidosPorCreadorChart.vue'
import PedidosPorEstadoChart from '@/components/charts/PedidosPorEstadoChart.vue'
import PedidosPorMesChart from '@/components/charts/PedidosPorMesChart.vue'
import PresupuestoPorMarcaChart from '@/components/charts/PresupuestoPorMarcaChart.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import PedidosTable from '@/components/PedidosTable.vue'
import StatCardGrid from '@/components/StatCardGrid.vue'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { PedidoService } from '@/services/PedidoService'
import { formatEstado } from '@/utils/formatEstado'

const ESTADOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado']

// selectors
const filtro = reactive<PedidoFiltroDTO>({
  estado: undefined,
  marcaId: undefined,
  creadorId: undefined,
  desde: '',
  hasta: '',
})

// computed variables
const marcas = computed(() => MarcaService.getAll())
const creadores = computed(() => CreadorService.getAll())

const pedidosFiltrados = computed(() => PedidoService.filtrar(PedidoService.getAll(), filtro))

const stats = computed(() => PedidoService.getReportStats(pedidosFiltrados.value))
const porEstado = computed(() => PedidoService.getPedidosPorEstado(pedidosFiltrados.value))
const porCreador = computed(() => PedidoService.getPedidosPorCreador(pedidosFiltrados.value))
const porMarca = computed(() => PedidoService.getPresupuestoPorMarca(pedidosFiltrados.value))
const porMes = computed(() => PedidoService.getPedidosPorMes(pedidosFiltrados.value))

// functions
function limpiarFiltros(): void {
  filtro.estado = undefined
  filtro.marcaId = undefined
  filtro.creadorId = undefined
  filtro.desde = ''
  filtro.hasta = ''
}
</script>

<template>
  <main class="Panel reportes">
    <h1>Reportes</h1>

    <div class="reportes__filtros">
      <select v-model="filtro.estado" class="reportes__filtro-input">
        <option :value="undefined">Todos los estados</option>
        <option v-for="opcion in ESTADOS" :key="opcion" :value="opcion">
          {{ formatEstado(opcion) }}
        </option>
      </select>

      <select v-model="filtro.marcaId" class="reportes__filtro-input">
        <option :value="undefined">Todas las marcas</option>
        <option v-for="marca in marcas" :key="marca.id" :value="marca.id">
          {{ marca.nombre }}
        </option>
      </select>

      <select v-model="filtro.creadorId" class="reportes__filtro-input">
        <option :value="undefined">Todos los creadores</option>
        <option v-for="creador in creadores" :key="creador.id" :value="creador.id">
          {{ creador.nombre }}
        </option>
      </select>

      <label class="reportes__filtro-fecha">
        Desde
        <input v-model="filtro.desde" class="reportes__filtro-input" type="date" />
      </label>

      <label class="reportes__filtro-fecha">
        Hasta
        <input v-model="filtro.hasta" class="reportes__filtro-input" type="date" />
      </label>

      <button type="button" class="reportes__limpiar" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </div>

    <p v-if="pedidosFiltrados.length === 0" class="reportes__vacio">
      No hay pedidos que coincidan con estos filtros.
    </p>

    <template v-else>
      <StatCardGrid :stats="stats" />

      <div class="reportes__graficos">
        <DashboardCard title="Pedidos por estado">
          <PedidosPorEstadoChart :datos="porEstado" />
        </DashboardCard>
        <DashboardCard title="Pedidos por creador">
          <PedidosPorCreadorChart :datos="porCreador" />
        </DashboardCard>
        <DashboardCard title="Presupuesto por marca">
          <PresupuestoPorMarcaChart :datos="porMarca" />
        </DashboardCard>
        <DashboardCard title="Pedidos por mes de solicitud">
          <PedidosPorMesChart :datos="porMes" />
        </DashboardCard>
      </div>

      <DashboardCard title="Detalle de pedidos" class="reportes__detalle">
        <PedidosTable :pedidos="pedidosFiltrados" />
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

.reportes__graficos {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
  grid-template-columns: 1fr;
}

.reportes__detalle {
  margin-top: 1.5rem;
}

@media (min-width: 900px) {
  .reportes__graficos {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
