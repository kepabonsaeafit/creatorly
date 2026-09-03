// Kevin Pabón

/** Estados válidos del ciclo de vida de un Pedido. */
export type EstadoPedido = 'solicitado' | 'asignado' | 'en_produccion' | 'entregado' | 'aprobado'

/**
 * Pedido: la unidad de trabajo del sistema. Conecta a una Marca (quien solicita),
 * un Creador (quien produce, opcional hasta la asignación) y un User coordinador
 * (quien lo gestiona). Ver ADR-0001: las referencias se guardan por id.
 */
export interface PedidoInterface {
  id: string
  descripcion: string
  presupuesto: number
  fechaSolicitud: string
  fechaEntrega: string | null
  estado: EstadoPedido
  marcaId: string
  creadorId: string | null
  coordinadorId: string
  createdAt: string
  updatedAt: string
}
