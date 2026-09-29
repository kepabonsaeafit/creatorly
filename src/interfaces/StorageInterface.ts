// Author: Kevin Pabón

/** Names of the four collections persisted in LocalStorage. */
export type CollectionName = 'users' | 'creators' | 'brands' | 'orders'

/** Shape in which the active session is persisted in LocalStorage. */
export interface SessionRecord {
  userId: string
}
