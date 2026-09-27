// Author: Gerónimo Montes

/**
 * Optional filters to narrow the creator catalog in CreatorsIndexView.
 * Does not derive from CreatorInterface: it is a read DTO, not a write one.
 */
export interface CreatorFilterDTO {
  niche?: string
  available?: boolean
  text?: string
}
