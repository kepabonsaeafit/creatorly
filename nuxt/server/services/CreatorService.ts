// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CREATORS } from '../data/CreatorData'

export class CreatorService {
  /**
   * Finds every creator in the catalog.
   * @returns All creators.
   */
  static findAll(): CreatorInterface[] {
    return CREATORS
  }

  /**
   * Finds a creator by id.
   * @param id - Creator id.
   * @returns The matching creator.
   * @throws H3Error with status 404 when no creator has that id.
   */
  static findOne(id: number): CreatorInterface {
    const creator = CREATORS.find((item: CreatorInterface): boolean => item.id === id)

    if (!creator) {
      throw createError({ status: 404, statusText: 'Creator: not found' })
    }

    return creator
  }
}
