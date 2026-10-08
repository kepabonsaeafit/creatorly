// Author: Kevin Pabón

/**
 * UGC Creator from the agency catalog (the talent that produces the content).
 */
export interface CreatorInterface {
  id: number
  name: string
  niche: string
  contentType: string
  rate: number
  available: boolean
  createdAt: string
  updatedAt: string
}
