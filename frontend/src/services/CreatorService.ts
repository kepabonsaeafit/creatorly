// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'
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
}
