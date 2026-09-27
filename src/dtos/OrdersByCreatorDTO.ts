// Author: Felipe Gómez

/**
 * Aggregation of orders per creator, for the Reports view.
 * Does not derive from OrderInterface: it is a read DTO, not a write one.
 */
export interface OrdersByCreatorDTO {
  creatorId: string
  creatorName: string
  count: number
}
