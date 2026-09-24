// Kevin Pabón

// internal imports
import type { EstadoPedido } from '@/interfaces/PedidoInterface'

/** Datos de un pedido ficticio antes de derivarle createdAt/updatedAt en PedidoSeeder. */
export interface DatosPedidoSeed {
  descripcion: string
  presupuesto: number
  fechaSolicitud: string
  fechaEntrega: string
  estado: EstadoPedido
  marcaId: string
  creadorId: string | null
  userId: string
}
