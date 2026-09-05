// Felipe Gómez

// internal imports
import type { EstadoPedido } from '@/interfaces/PedidoInterface'

const ETIQUETAS: Record<EstadoPedido, string> = {
  solicitado: 'Solicitado',
  asignado: 'Asignado',
  en_produccion: 'En producción',
  entregado: 'Entregado',
  aprobado: 'Aprobado',
}

/** Etiqueta legible de un EstadoPedido, reusada por la tabla de Pedidos y los gráficos de Reportes. */
export function formatEstado(estado: EstadoPedido): string {
  return ETIQUETAS[estado]
}
