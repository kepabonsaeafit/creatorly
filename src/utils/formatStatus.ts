// Felipe Gómez

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'

const LABELS: Record<OrderStatus, string> = {
  solicitado: 'Solicitado',
  asignado: 'Asignado',
  en_produccion: 'En producción',
  entregado: 'Entregado',
  aprobado: 'Aprobado',
}

/** Etiqueta legible de un OrderStatus, reusada por la tabla de Pedidos y los gráficos de Reportes. */
export function formatStatus(status: OrderStatus): string {
  return LABELS[status]
}
