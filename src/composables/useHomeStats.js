import { computed } from 'vue'
import Pedido, { ESTADOS_ACTIVOS } from '@/models/Pedido'

/**
 * Métricas del dominio para el Home (KPIs calculados sobre los pedidos).
 * Los valores se calculan al montar la vista que usa el composable.
 * @returns {{
 *   stats: import('vue').ComputedRef<Array<{ id: string, label: string, value: number, unit: string }>>,
 *   recentPedidos: import('vue').ComputedRef<Array<{ id: string, title: string, timestamp: string, type: string }>>
 * }}
 */
export function useHomeStats() {
  const pedidos = computed(() => Pedido.all())

  const stats = computed(() => {
    const list = pedidos.value
    const activos = list.filter((p) => ESTADOS_ACTIVOS.includes(p.estado))
    const presupuestoComprometido = activos.reduce((suma, p) => suma + p.presupuesto, 0)

    const hoy = new Date()
    const mismoMes = (isoDate) => {
      const fecha = new Date(isoDate)
      return (
        fecha.getUTCFullYear() === hoy.getUTCFullYear() && fecha.getUTCMonth() === hoy.getUTCMonth()
      )
    }
    const entregasDelMes = list.filter(
      (p) =>
        ['entregado', 'aprobado'].includes(p.estado) && p.fechaEntrega && mismoMes(p.fechaEntrega),
    ).length

    return [
      { id: 'total', label: 'Pedidos totales', value: list.length, unit: '' },
      { id: 'activos', label: 'Pedidos activos', value: activos.length, unit: '' },
      {
        id: 'presupuesto',
        label: 'Presupuesto comprometido',
        value: presupuestoComprometido,
        unit: '$',
      },
      { id: 'entregas', label: 'Entregas del mes', value: entregasDelMes, unit: '' },
    ]
  })

  const recentPedidos = computed(() =>
    [...pedidos.value]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: `${p.descripcion} — ${p.marca()?.nombre ?? 'sin marca'}`,
        timestamp: p.createdAt,
        type: ['entregado', 'aprobado'].includes(p.estado) ? 'milestone' : 'default',
      })),
  )

  return { stats, recentPedidos }
}
