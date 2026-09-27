// Kevin Pabón

/**
 * Creador UGC del catálogo de la agencia (el talento que produce el contenido).
 */
export interface CreatorInterface {
  id: string
  name: string
  niche: string
  contentType: string
  rate: number
  available: boolean
  createdAt: string
  updatedAt: string
}
