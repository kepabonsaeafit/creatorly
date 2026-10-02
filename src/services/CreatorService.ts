// Author: Kevin Pabón

// internal imports
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import type { CreatorFilterDTO } from '@/dtos/Creators/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { useCreatorStore } from '@/stores/CreatorStore'
import { generateId } from '@/utils/generateId'

export class CreatorService {
  private static validate(creatorData: CreateCreatorDTO): void {
    if (!creatorData.name || typeof creatorData.name !== 'string') {
      throw new Error('Creator: name is required')
    }

    if (!creatorData.niche || typeof creatorData.niche !== 'string') {
      throw new Error('Creator: niche is required')
    }

    if (!creatorData.contentType || typeof creatorData.contentType !== 'string') {
      throw new Error('Creator: content type is required')
    }

    if (
      typeof creatorData.rate !== 'number' ||
      Number.isNaN(creatorData.rate) ||
      creatorData.rate < 0
    ) {
      throw new Error('Creator: rate must be a number >= 0')
    }
  }

  /**
   * Gets every creator in the store.
   * @returns All creators.
   */
  static getAll(): CreatorInterface[] {
    return useCreatorStore().creators
  }

  /**
   * Finds a creator by id.
   * @param id - Id of the creator to look up.
   * @returns The matching creator, or `undefined` if not found.
   */
  static getById(id: string): CreatorInterface | undefined {
    return useCreatorStore().creators.find((creator) => creator.id === id)
  }

  /**
   * Validates and creates a new creator.
   * @param creatorData - Data required to create the creator.
   * @returns The created creator, with its id and timestamps.
   * @throws {Error} If any required field is missing or invalid.
   */
  static create(creatorData: CreateCreatorDTO): CreatorInterface {
    const normalizedData: CreateCreatorDTO = {
      ...creatorData,
      available: creatorData.available ?? true,
    }

    this.validate(normalizedData)

    const now = new Date().toISOString()
    const newCreator: CreatorInterface = {
      ...normalizedData,
      available: Boolean(normalizedData.available),
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }

    useCreatorStore().creators.push(newCreator)

    return newCreator
  }

  /**
   * Validates and applies partial changes to a creator.
   * @param id - Id of the creator to update.
   * @param changes - Partial fields to change.
   * @returns The updated creator, or `undefined` if not found.
   * @throws {Error} If the merged data fails validation.
   */
  static update(id: string, changes: Partial<CreateCreatorDTO>): CreatorInterface | undefined {
    const creators = useCreatorStore().creators
    const index = creators.findIndex((creator) => creator.id === id)

    if (index === -1) return undefined

    const merged: CreateCreatorDTO = {
      name: changes.name ?? creators[index].name,
      niche: changes.niche ?? creators[index].niche,
      contentType: changes.contentType ?? creators[index].contentType,
      rate: changes.rate ?? creators[index].rate,
      available: changes.available ?? creators[index].available,
    }

    this.validate(merged)

    const updated: CreatorInterface = {
      ...creators[index],
      ...merged,
      available: Boolean(merged.available),
      updatedAt: new Date().toISOString(),
    }

    creators[index] = updated

    return updated
  }

  /**
   * Removes a creator by id.
   * @param id - Id of the creator to remove.
   * @returns `true` if it was removed, `false` if not found.
   */
  static remove(id: string): boolean {
    const creators = useCreatorStore().creators
    const index = creators.findIndex((creator) => creator.id === id)

    if (index === -1) return false
    creators.splice(index, 1)

    return true
  }

  /**
   * Applies a CreatorFilterDTO over a list of creators and sorts the
   * result by name. Used by CreatorsIndexView.
   * @param creators - Creators to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted creators.
   */
  static filter(creators: CreatorInterface[], filter: CreatorFilterDTO): CreatorInterface[] {
    return creators
      .filter((creator) => {
        if (filter.niche && creator.niche !== filter.niche) return false
        if (filter.available !== undefined && creator.available !== filter.available) return false
        if (filter.text) {
          const text = filter.text.trim().toLowerCase()

          if (text && !creator.name.toLowerCase().includes(text)) return false
        }

        return true
      })
      .sort((first, second) => first.name.localeCompare(second.name))
  }

  /**
   * Distinct niches present in the catalog, sorted, to populate the filter.
   * @returns The sorted list of distinct niches.
   */
  static getNiches(): string[] {
    const uniqueNiches = new Set(this.getAll().map((creator) => creator.niche))

    return [...uniqueNiches].sort((first, second) => first.localeCompare(second))
  }
}
