// Kevin Pabón

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { EstadoPedido, PedidoInterface } from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'

const ESTADOS_FINALES: EstadoPedido[] = ['entregado', 'aprobado']

interface DatosPedidoSeed {
  descripcion: string
  presupuesto: number
  fechaSolicitud: string
  fechaEntrega: string
  estado: EstadoPedido
  marcaId: string
  creadorId: string | null
  coordinadorId: string
}

/** Igual al helper `pedido()` de services/seed.js:128-139: deriva createdAt/updatedAt. */
function construirPedido(datos: DatosPedidoSeed): PedidoInterface {
  const createdAt = `${datos.fechaSolicitud}T09:00:00.000Z`
  const updatedAt = ESTADOS_FINALES.includes(datos.estado)
    ? `${datos.fechaEntrega}T15:00:00.000Z`
    : createdAt
  return {
    id: crypto.randomUUID(),
    descripcion: datos.descripcion,
    presupuesto: datos.presupuesto,
    fechaSolicitud: datos.fechaSolicitud,
    fechaEntrega: datos.fechaEntrega,
    estado: datos.estado,
    marcaId: datos.marcaId,
    creadorId: datos.creadorId,
    coordinadorId: datos.coordinadorId,
    createdAt,
    updatedAt,
  }
}

/**
 * Datos ficticios de pedidos. Mismos valores que services/seed.js:141-262.
 * Recibe marcas/creadores/users ya sembrados para referenciarlos por id,
 * igual que seed.js los captura por posición (seed.js:121-123) antes de
 * construir los pedidos.
 */
export function seedPedidos(
  marcas: MarcaInterface[],
  creadores: CreadorInterface[],
  users: UserInterface[],
): PedidoInterface[] {
  const [, laura, sara] = users
  const [valentina, andres, daniela, sebastian, isabella, mateo] = creadores
  const [natura, pixel, aurea, fitpro] = marcas

  return [
    construirPedido({
      descripcion: '3 videos TikTok para campaña de sérum facial',
      presupuesto: 3200,
      fechaSolicitud: '2026-07-02',
      fechaEntrega: '2026-08-20',
      estado: 'en_produccion',
      marcaId: natura.id,
      creadorId: valentina.id,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: 'Serie de 4 reels de rutina nocturna de skincare',
      presupuesto: 2400,
      fechaSolicitud: '2026-03-10',
      fechaEntrega: '2026-04-15',
      estado: 'aprobado',
      marcaId: natura.id,
      creadorId: valentina.id,
      coordinadorId: sara.id,
    }),
    construirPedido({
      descripcion: 'Gameplay de 10 min con integración de producto',
      presupuesto: 4100,
      fechaSolicitud: '2026-08-01',
      fechaEntrega: '2026-09-05',
      estado: 'asignado',
      marcaId: pixel.id,
      creadorId: andres.id,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: '2 historias y 1 post de lanzamiento de DLC',
      presupuesto: 1800,
      fechaSolicitud: '2026-08-10',
      fechaEntrega: '2026-09-12',
      estado: 'solicitado',
      marcaId: pixel.id,
      creadorId: null,
      coordinadorId: sara.id,
    }),
    construirPedido({
      descripcion: 'Lookbook de temporada con 6 fotos Instagram',
      presupuesto: 2600,
      fechaSolicitud: '2026-06-18',
      fechaEntrega: '2026-08-14',
      estado: 'entregado',
      marcaId: aurea.id,
      creadorId: daniela.id,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: 'Unboxing y reseña del nuevo catálogo',
      presupuesto: 2900,
      fechaSolicitud: '2026-07-22',
      fechaEntrega: '2026-08-25',
      estado: 'en_produccion',
      marcaId: aurea.id,
      creadorId: daniela.id,
      coordinadorId: sara.id,
    }),
    construirPedido({
      descripcion: 'Rutina de entrenamiento con stack de suplementos',
      presupuesto: 3500,
      fechaSolicitud: '2026-01-15',
      fechaEntrega: '2026-02-20',
      estado: 'aprobado',
      marcaId: fitpro.id,
      creadorId: sebastian.id,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: 'Video YouTube de 8 min de pre-entreno',
      presupuesto: 2200,
      fechaSolicitud: '2026-05-06',
      fechaEntrega: '2026-07-10',
      estado: 'entregado',
      marcaId: fitpro.id,
      creadorId: sebastian.id,
      coordinadorId: sara.id,
    }),
    construirPedido({
      descripcion: 'Recetas fáciles con línea gourmet',
      presupuesto: 1500,
      fechaSolicitud: '2026-08-12',
      fechaEntrega: '2026-09-01',
      estado: 'solicitado',
      marcaId: natura.id,
      creadorId: null,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: 'Live de 1 hora jugando el nuevo título',
      presupuesto: 3900,
      fechaSolicitud: '2026-07-14',
      fechaEntrega: '2026-08-28',
      estado: 'en_produccion',
      marcaId: pixel.id,
      creadorId: andres.id,
      coordinadorId: sara.id,
    }),
    construirPedido({
      descripcion: '5 fotos de street style con accesorios',
      presupuesto: 1700,
      fechaSolicitud: '2026-08-05',
      fechaEntrega: '2026-08-30',
      estado: 'asignado',
      marcaId: aurea.id,
      creadorId: isabella.id,
      coordinadorId: laura.id,
    }),
    construirPedido({
      descripcion: 'Review honesta de proteína vegana',
      presupuesto: 2000,
      fechaSolicitud: '2026-06-20',
      fechaEntrega: '2026-08-08',
      estado: 'entregado',
      marcaId: fitpro.id,
      creadorId: mateo.id,
      coordinadorId: sara.id,
    }),
  ]
}
