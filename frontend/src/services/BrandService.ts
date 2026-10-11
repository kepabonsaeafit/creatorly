// Author: Kevin Pabón
// Author: Felipe Gómez

// external imports
import axios from 'axios'

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreateBrandDTO } from '@/dtos/Brands/CreateBrandDTO'

export class BrandService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/brands`

  /**
   * Gets every brand from the API.
   * @returns All brands.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getAll(): Promise<BrandInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds a brand by id.
   * @param id - Id of the brand to look up.
   * @returns The matching brand.
   * @throws {AxiosError} If the API rejects the request (404 if no brand has that id).
   */
  static async getById(id: number): Promise<BrandInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    return data
  }

  /**
   * Creates a new brand. The backend validates it.
   * @param brandData - Data required to create the brand.
   * @returns The created brand, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async create(brandData: CreateBrandDTO): Promise<BrandInterface> {
    const { data } = await axios.post(this.API_URL, brandData)

    return data
  }
}
