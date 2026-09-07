<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, reactive, ref } from 'vue'

// internal imports
import PedidosPorCreadorChart from '@/components/charts/PedidosPorCreadorChart.vue'
import PedidosPorEstadoChart from '@/components/charts/PedidosPorEstadoChart.vue'
import PedidosPorMesChart from '@/components/charts/PedidosPorMesChart.vue'
import PresupuestoPorMarcaChart from '@/components/charts/PresupuestoPorMarcaChart.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import PedidosTable from '@/components/PedidosTable.vue'
import ReportTable, { type ReportTableColumn } from '@/components/ReportTable.vue'
import StatCardGrid from '@/components/StatCardGrid.vue'
import type { PedidoFiltroDTO } from '@/dtos/PedidoFiltroDTO'
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { PedidoService } from '@/services/PedidoService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatEstado } from '@/utils/formatEstado'

const ESTADOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado']

type TipoReporte = 'mes' | 'estado' | 'creador' | 'marca'

interface OpcionReporte {
  id: TipoReporte
  label: string
}

const OPCIONES_REPORTE: OpcionReporte[] = [
  { id: 'mes', label: 'Pedidos por mes' },
  { id: 'estado', label: 'Pedidos por estado' },
  { id: 'creador', label: 'Pedidos por creador' },
  { id: 'marca', label: 'Presupuesto por marca' },
]

// selectors
const filtro = reactive<PedidoFiltroDTO>({
  estado: undefined,
  marcaId: undefined,
  creadorId: undefined,
  desde: '',
  hasta: '',
})

const tipoReporte = ref<TipoReporte>('mes')

// computed variables
const marcas = computed(() => MarcaService.getAll())
const creadores = computed(() => CreadorService.getAll())

const pedidosFiltrados = computed(() => PedidoService.filtrar(PedidoService.getAll(), filtro))

const stats = computed(() => PedidoService.getReportStats(pedidosFiltrados.value))
const porEstado = computed(() => PedidoService.getPedidosPorEstado(pedidosFiltrados.value))
const porCreador = computed(() => PedidoService.getPedidosPorCreador(pedidosFiltrados.value))
const porMarca = computed(() => PedidoService.getPresupuestoPorMarca(pedidosFiltrados.value))
const porMes = computed(() => PedidoService.getPedidosPorMes(pedidosFiltrados.value))

const opcionReporteActual = computed(
  () => OPCIONES_REPORTE.find((opcion) => opcion.id === tipoReporte.value) ?? OPCIONES_REPORTE[0],
)

const columnasReporte = computed<ReportTableColumn[]>(() => {
  if (tipoReporte.value === 'estado') {
    return [
      { key: 'estado', label: 'Estado' },
      { key: 'cantidad', label: 'Cantidad' },
    ]
  }
  if (tipoReporte.value === 'creador') {
    return [
      { key: 'creador', label: 'Creador' },
      { key: 'cantidad', label: 'Cantidad' },
    ]
  }
  if (tipoReporte.value === 'marca') {
    return [
      { key: 'marca', label: 'Marca' },
      { key: 'presupuesto', label: 'Presupuesto' },
    ]
  }
  return [
    { key: 'mes', label: 'Mes' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'presupuesto', label: 'Presupuesto' },
  ]
})

const filasReporte = computed<Record<string, string>[]>(() => {
  if (tipoReporte.value === 'estado') {
    return porEstado.value.map((fila) => ({
      estado: formatEstado(fila.estado),
      cantidad: String(fila.cantidad),
    }))
  }
  if (tipoReporte.value === 'creador') {
    return porCreador.value.map((fila) => ({
      creador: fila.creadorNombre,
      cantidad: String(fila.cantidad),
    }))
  }
  if (tipoReporte.value === 'marca') {
    return porMarca.value.map((fila) => ({
      marca: fila.marcaNombre,
      presupuesto: formatCurrency(fila.presupuesto),
    }))
  }
  return porMes.value.map((fila) => ({
    mes: fila.etiqueta,
    cantidad: String(fila.cantidad),
    presupuesto: formatCurrency(fila.presupuesto),
  }))
})

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

      <DashboardCard class="reportes__reporte">
        <div class="reportes__reporte-header">
          <h2 class="reportes__reporte-titulo">{{ opcionReporteActual.label }}</h2>
          <label class="reportes__reporte-selector">
            Tipo de reporte
            <select v-model="tipoReporte" class="reportes__filtro-input">
              <option v-for="opcion in OPCIONES_REPORTE" :key="opcion.id" :value="opcion.id">
                {{ opcion.label }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="filasReporte.length === 0" class="reportes__vacio">
          No hay datos para «{{ opcionReporteActual.label }}» con estos filtros.
        </p>

        <div v-else class="reportes__reporte-cuerpo">
          <ReportTable :columnas="columnasReporte" :filas="filasReporte" />

          <PedidosPorMesChart v-if="tipoReporte === 'mes'" :datos="porMes" />
          <PedidosPorEstadoChart v-else-if="tipoReporte === 'estado'" :datos="porEstado" />
          <PedidosPorCreadorChart v-else-if="tipoReporte === 'creador'" :datos="porCreador" />
          <PresupuestoPorMarcaChart v-else :datos="porMarca" />
        </div>
      </DashboardCard>

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
