// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import type { CreatorFilterDTO } from '@/dtos/Creators/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'

export class CreatorService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/creators`

  /**
   * Gets every creator from the API.
   * @returns All creators.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getAll(): Promise<CreatorInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds a creator by id.
   * @param id - Id of the creator to look up.
   * @returns The matching creator, or `null` if none has that id.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getById(id: number): Promise<CreatorInterface | null> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    // the API answers an empty body (not JSON null) when no creator has that id
    return data || null
  }

  /**
   * Creates a new creator. The backend validates it.
   * @param creatorData - Data required to create the creator.
   * @returns The created creator, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async create(creatorData: CreateCreatorDTO): Promise<CreatorInterface> {
    const { data } = await axios.post(this.API_URL, creatorData)

    return data
  }

  /**
   * Applies partial changes to a creator. The backend validates them.
   * @param id - Id of the creator to update.
   * @param changes - Partial fields to change.
   * @returns The updated creator.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async update(id: number, changes: Partial<CreateCreatorDTO>): Promise<CreatorInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, changes)

    return data
  }

  /**
   * Removes a creator by id.
   * @param id - Id of the creator to remove.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async remove(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }

  /**
   * Applies a CreatorFilterDTO over a list of creators already fetched from
   * the API and sorts the result by name. Used by CreatorsIndexView.
   * @param creators - Creators to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted creators.
   */
  static filter(creators: CreatorInterface[], filter: CreatorFilterDTO): CreatorInterface[] {
    return creators
      .filter((creator: CreatorInterface): boolean => {
        if (filter.niche && creator.niche !== filter.niche) return false
        if (filter.available !== undefined && creator.available !== filter.available) return false
        if (filter.text) {
          const text = filter.text.trim().toLowerCase()

          if (text && !creator.name.toLowerCase().includes(text)) return false
        }

        return true
      })
      .sort((first: CreatorInterface, second: CreatorInterface): number =>
        first.name.localeCompare(second.name),
      )
  }

  /**
   * Distinct niches present in a list of creators, sorted, to populate the filter.
   * @param creators - Creators to read the niches from.
   * @returns The sorted list of distinct niches.
   */
  static getNiches(creators: CreatorInterface[]): string[] {
    const uniqueNiches = new Set(creators.map((creator: CreatorInterface): string => creator.niche))

    return [...uniqueNiches].sort((first: string, second: string): number =>
      first.localeCompare(second),
    )
  }
}
