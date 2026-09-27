// Kevin Pabón

/** Nombres de las cuatro colecciones persistidas en LocalStorage. */
export type CollectionName = 'users' | 'creators' | 'brands' | 'orders'

/** Forma en la que se persiste la sesión activa en LocalStorage. */
export interface SessionRecord {
  userId: string
}
