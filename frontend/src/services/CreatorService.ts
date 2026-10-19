// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
import type { CreatorFilterDTO } from '@/dtos/Creators/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { StringUtil } from '@/utils/StringUtil'

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
   * @returns The matching creator.
   * @throws {AxiosError} If the API rejects the request (404 if no creator has that id).
   */
  static async getById(id: number): Promise<CreatorInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    return data
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
   * the API and sorts the result by name. The niche is compared ignoring case
   * and the spaces around it. Used by CreatorsIndexView.
   * @param creators - Creators to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted creators.
   */
  static filter(creators: CreatorInterface[], filter: CreatorFilterDTO): CreatorInterface[] {
    const wantedNiche = filter.niche ? this.normalizeNiche(filter.niche) : ''

    return creators
      .filter((creator: CreatorInterface): boolean => {
        if (wantedNiche && this.normalizeNiche(creator.niche) !== wantedNiche) return false
        if (filter.available !== undefined && creator.available !== filter.available) return false
        if (filter.text && !StringUtil.contains(creator.name, filter.text)) return false

        return true
      })
      .sort((first: CreatorInterface, second: CreatorInterface): number =>
        first.name.localeCompare(second.name),
      )
  }

  /**
   * Distinct niches present in a list of creators, sorted, to populate the filter.
   * Niches are trimmed and lowercased before comparing, so rows saved with a
   * different case count as one niche.
   * @param creators - Creators to read the niches from.
   * @returns The sorted list of distinct niches, in lowercase.
   */
  static getNiches(creators: CreatorInterface[]): string[] {
    const uniqueNiches = new Set(
      creators.map((creator: CreatorInterface): string => this.normalizeNiche(creator.niche)),
    )

    return [...uniqueNiches].sort((first: string, second: string): number =>
      first.localeCompare(second),
    )
  }

  /**
   * Niche written in the form used to compare and group niches.
   * @param niche - Niche as stored or typed.
   * @returns The niche trimmed and in lowercase.
   */
  private static normalizeNiche(niche: string): string {
    return niche.trim().toLowerCase()
  }
}
