// Kevin Pabón

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { FINAL_STATUSES, type OrderInterface } from '@/interfaces/OrderInterface'
import type { OrderSeedData } from '@/interfaces/OrderSeedDataInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { generateId } from '@/utils/generateId'

/** Deriva createdAt/updatedAt a partir de requestDate, deliveryDate y el estado. */
function buildOrder(orderData: OrderSeedData): OrderInterface {
  const createdAt = `${orderData.requestDate}T09:00:00.000Z`
  const updatedAt = FINAL_STATUSES.includes(orderData.status)
    ? `${orderData.deliveryDate}T15:00:00.000Z`
    : createdAt
  return {
    id: generateId(),
    description: orderData.description,
    budget: orderData.budget,
    requestDate: orderData.requestDate,
    deliveryDate: orderData.deliveryDate,
    status: orderData.status,
    brandId: orderData.brandId,
    creatorId: orderData.creatorId,
    userId: orderData.userId,
    createdAt,
    updatedAt,
  }
}

/**
 * Datos ficticios de pedidos.
 * Recibe marcas/creadores/users ya sembrados para referenciarlos por id,
 * capturándolos por posición antes de construir los pedidos.
 */
export function seedOrders(
  brands: BrandInterface[],
  creators: CreatorInterface[],
  users: UserInterface[],
): OrderInterface[] {
  const [, laura, sara] = users
  const [valentina, andres, daniela, sebastian, isabella, mateo] = creators
  const [natura, pixel, aurea, fitpro] = brands

  return [
    buildOrder({
      description: '3 videos TikTok para campaña de sérum facial',
      budget: 3200,
      requestDate: '2026-07-02',
      deliveryDate: '2026-08-20',
      status: 'in_production',
      brandId: natura.id,
      creatorId: valentina.id,
      userId: laura.id,
    }),
    buildOrder({
      description: 'Serie de 4 reels de rutina nocturna de skincare',
      budget: 2400,
      requestDate: '2026-03-10',
      deliveryDate: '2026-04-15',
      status: 'approved',
      brandId: natura.id,
      creatorId: valentina.id,
      userId: sara.id,
    }),
    buildOrder({
      description: 'Gameplay de 10 min con integración de producto',
      budget: 4100,
      requestDate: '2026-08-01',
      deliveryDate: '2026-09-05',
      status: 'assigned',
      brandId: pixel.id,
      creatorId: andres.id,
      userId: laura.id,
    }),
    buildOrder({
      description: '2 historias y 1 post de lanzamiento de DLC',
      budget: 1800,
      requestDate: '2026-08-10',
      deliveryDate: '2026-09-12',
      status: 'requested',
      brandId: pixel.id,
      creatorId: null,
      userId: sara.id,
    }),
    buildOrder({
      description: 'Lookbook de temporada con 6 fotos Instagram',
      budget: 2600,
      requestDate: '2026-06-18',
      deliveryDate: '2026-08-14',
      status: 'delivered',
      brandId: aurea.id,
      creatorId: daniela.id,
      userId: laura.id,
    }),
    buildOrder({
      description: 'Unboxing y reseña del nuevo catálogo',
      budget: 2900,
      requestDate: '2026-07-22',
      deliveryDate: '2026-08-25',
      status: 'in_production',
      brandId: aurea.id,
      creatorId: daniela.id,
      userId: sara.id,
    }),
    buildOrder({
      description: 'Rutina de entrenamiento con stack de suplementos',
      budget: 3500,
      requestDate: '2026-01-15',
      deliveryDate: '2026-02-20',
      status: 'approved',
      brandId: fitpro.id,
      creatorId: sebastian.id,
      userId: laura.id,
    }),
    buildOrder({
      description: 'Video YouTube de 8 min de pre-entreno',
      budget: 2200,
      requestDate: '2026-05-06',
      deliveryDate: '2026-07-10',
      status: 'delivered',
      brandId: fitpro.id,
      creatorId: sebastian.id,
      userId: sara.id,
    }),
    buildOrder({
      description: 'Recetas fáciles con línea gourmet',
      budget: 1500,
      requestDate: '2026-08-12',
      deliveryDate: '2026-09-01',
      status: 'requested',
      brandId: natura.id,
      creatorId: null,
      userId: laura.id,
    }),
    buildOrder({
      description: 'Live de 1 hora jugando el nuevo título',
      budget: 3900,
      requestDate: '2026-07-14',
      deliveryDate: '2026-08-28',
      status: 'in_production',
      brandId: pixel.id,
      creatorId: andres.id,
      userId: sara.id,
    }),
    buildOrder({
      description: '5 fotos de street style con accesorios',
      budget: 1700,
      requestDate: '2026-08-05',
      deliveryDate: '2026-08-30',
      status: 'assigned',
      brandId: aurea.id,
      creatorId: isabella.id,
      userId: laura.id,
    }),
    buildOrder({
      description: 'Review honesta de proteína vegana',
      budget: 2000,
      requestDate: '2026-06-20',
      deliveryDate: '2026-08-08',
      status: 'delivered',
      brandId: fitpro.id,
      creatorId: mateo.id,
      userId: sara.id,
    }),
  ]
}
