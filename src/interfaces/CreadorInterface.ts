// Kevin Pabón

/**
 * Creador UGC del catálogo de la agencia (el talento que produce el contenido).
 */
export interface CreadorInterface {
  id: string
  nombre: string
  nicho: string
  tipoContenido: string
  tarifa: number
  disponible: boolean
  createdAt: string
  updatedAt: string
}
