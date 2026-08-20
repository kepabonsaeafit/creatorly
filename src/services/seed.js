import { hasData, write } from '@/services/storage'
import User from '@/models/User'
import Creador from '@/models/Creador'
import Marca from '@/models/Marca'
import Pedido from '@/models/Pedido'

/**
 * Siembra los datos ficticios en LocalStorage. Solo actúa en el primer
 * arranque: si ya existen usuarios o pedidos, no toca nada (regla 18).
 * @returns {void}
 */
export function seed() {
  if (hasData('users') || hasData('pedidos')) return

  const users = [
    new User({
      nombre: 'Camila Torres',
      email: 'admin@creatorly.com',
      password: '1234',
      rol: 'admin',
      createdAt: '2026-01-05T08:00:00.000Z',
    }),
    new User({
      nombre: 'Laura Restrepo',
      email: 'laura@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-05T08:05:00.000Z',
    }),
    new User({
      nombre: 'Sara Gómez',
      email: 'sara@creatorly.com',
      password: '1234',
      rol: 'coordinador',
      createdAt: '2026-01-06T09:30:00.000Z',
    }),
  ]

  const creadores = [
    new Creador({
      nombre: 'Valentina Ríos',
      nicho: 'belleza',
      tipoContenido: 'TikTok',
      tarifa: 1500,
      disponible: true,
      createdAt: '2026-01-08T10:00:00.000Z',
    }),
    new Creador({
      nombre: 'Andrés Mesa',
      nicho: 'gaming',
      tipoContenido: 'YouTube',
      tarifa: 2400,
      disponible: true,
      createdAt: '2026-01-09T11:00:00.000Z',
    }),
    new Creador({
      nombre: 'Daniela Kim',
      nicho: 'moda',
      tipoContenido: 'Instagram',
      tarifa: 1800,
      disponible: true,
      createdAt: '2026-01-12T14:00:00.000Z',
    }),
    new Creador({
      nombre: 'Sebastián Ortiz',
      nicho: 'fitness',
      tipoContenido: 'YouTube',
      tarifa: 2100,
      disponible: false,
      createdAt: '2026-01-15T09:00:00.000Z',
    }),
    new Creador({
      nombre: 'Isabella Cruz',
      nicho: 'gastronomía',
      tipoContenido: 'TikTok',
      tarifa: 1200,
      disponible: true,
      createdAt: '2026-02-02T16:00:00.000Z',
    }),
    new Creador({
      nombre: 'Mateo Vargas',
      nicho: 'tecnología',
      tipoContenido: 'Instagram',
      tarifa: 2000,
      disponible: true,
      createdAt: '2026-02-10T10:30:00.000Z',
    }),
  ]

  const marcas = [
    new Marca({
      nombre: 'Natura Belleza',
      industria: 'belleza y cuidado personal',
      contactoNombre: 'María Fernández',
      contactoEmail: 'maria@naturabelleza.com',
      createdAt: '2026-01-07T09:00:00.000Z',
    }),
    new Marca({
      nombre: 'PixelPlay',
      industria: 'videojuegos',
      contactoNombre: 'Carlos Andrade',
      contactoEmail: 'carlos@pixelplay.co',
      createdAt: '2026-01-20T15:00:00.000Z',
    }),
    new Marca({
      nombre: 'Áurea Moda',
      industria: 'moda y accesorios',
      contactoNombre: 'Paula Ruiz',
      contactoEmail: 'paula@aureamoda.com',
      createdAt: '2026-02-01T08:30:00.000Z',
    }),
    new Marca({
      nombre: 'FitPro Suplementos',
      industria: 'fitness y nutrición',
      contactoNombre: 'Diego Salazar',
      contactoEmail: 'diego@fitpro.com',
      createdAt: '2026-02-05T13:00:00.000Z',
    }),
  ]

  const [, laura, sara] = users
  const [valentina, andres, daniela, sebastian, isabella, mateo] = creadores
  const [natura, pixel, aurea, fitpro] = marcas

  // Estados finales usados para derivar updatedAt.
  const FINALES = ['entregado', 'aprobado']

  /**
   * Construye un pedido de semilla.
   * @param {Partial<Pedido> & { marcaId: string, coordinadorId: string }} d
   * @returns {Pedido}
   */
  const pedido = (d) => {
    const createdAt = `${d.fechaSolicitud}T09:00:00.000Z`
    const updatedAt = FINALES.includes(d.estado) ? `${d.fechaEntrega}T15:00:00.000Z` : createdAt
    return new Pedido({ ...d, createdAt, updatedAt })
  }

  const pedidos = [
    pedido({
      descripcion: '3 videos TikTok para campaña de sérum facial',
      presupuesto: 3200,
      fechaSolicitud: '2026-07-02',
      fechaEntrega: '2026-08-20',
      estado: 'en_produccion',
      marcaId: natura.id,
      creadorId: valentina.id,
      coordinadorId: laura.id,
    }),
    pedido({
      descripcion: 'Serie de 4 reels de rutina nocturna de skincare',
      presupuesto: 2400,
      fechaSolicitud: '2026-03-10',
      fechaEntrega: '2026-04-15',
      estado: 'aprobado',
      marcaId: natura.id,
      creadorId: valentina.id,
      coordinadorId: sara.id,
    }),
    pedido({
      descripcion: 'Gameplay de 10 min con integración de producto',
      presupuesto: 4100,
      fechaSolicitud: '2026-08-01',
      fechaEntrega: '2026-09-05',
      estado: 'asignado',
      marcaId: pixel.id,
      creadorId: andres.id,
      coordinadorId: laura.id,
    }),
    pedido({
      descripcion: '2 historias y 1 post de lanzamiento de DLC',
      presupuesto: 1800,
      fechaSolicitud: '2026-08-10',
      fechaEntrega: '2026-09-12',
      estado: 'solicitado',
      marcaId: pixel.id,
      creadorId: null,
      coordinadorId: sara.id,
    }),
    pedido({
      descripcion: 'Lookbook de temporada con 6 fotos Instagram',
      presupuesto: 2600,
      fechaSolicitud: '2026-06-18',
      fechaEntrega: '2026-08-14',
      estado: 'entregado',
      marcaId: aurea.id,
      creadorId: daniela.id,
      coordinadorId: laura.id,
    }),
    pedido({
      descripcion: 'Unboxing y reseña del nuevo catálogo',
      presupuesto: 2900,
      fechaSolicitud: '2026-07-22',
      fechaEntrega: '2026-08-25',
      estado: 'en_produccion',
      marcaId: aurea.id,
      creadorId: daniela.id,
      coordinadorId: sara.id,
    }),
    pedido({
      descripcion: 'Rutina de entrenamiento con stack de suplementos',
      presupuesto: 3500,
      fechaSolicitud: '2026-01-15',
      fechaEntrega: '2026-02-20',
      estado: 'aprobado',
      marcaId: fitpro.id,
      creadorId: sebastian.id,
      coordinadorId: laura.id,
    }),
    pedido({
      descripcion: 'Video YouTube de 8 min de pre-entreno',
      presupuesto: 2200,
      fechaSolicitud: '2026-05-06',
      fechaEntrega: '2026-07-10',
      estado: 'entregado',
      marcaId: fitpro.id,
      creadorId: sebastian.id,
      coordinadorId: sara.id,
    }),
    pedido({
      descripcion: 'Recetas fáciles con línea gourmet',
      presupuesto: 1500,
      fechaSolicitud: '2026-08-12',
      fechaEntrega: '2026-09-01',
      estado: 'solicitado',
      marcaId: natura.id,
      creadorId: null,
      coordinadorId: laura.id,
    }),
    pedido({
      descripcion: 'Live de 1 hora jugando el nuevo título',
      presupuesto: 3900,
      fechaSolicitud: '2026-07-14',
      fechaEntrega: '2026-08-28',
      estado: 'en_produccion',
      marcaId: pixel.id,
      creadorId: andres.id,
      coordinadorId: sara.id,
    }),
    pedido({
      descripcion: '5 fotos de street style con accesorios',
      presupuesto: 1700,
      fechaSolicitud: '2026-08-05',
      fechaEntrega: '2026-08-30',
      estado: 'asignado',
      marcaId: aurea.id,
      creadorId: isabella.id,
      coordinadorId: laura.id,
    }),
    pedido({
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

  write(
    'users',
    users.map((u) => u.toPlain()),
  )
  write(
    'creadores',
    creadores.map((c) => c.toPlain()),
  )
  write(
    'marcas',
    marcas.map((m) => m.toPlain()),
  )
  write(
    'pedidos',
    pedidos.map((p) => p.toPlain()),
  )
}
