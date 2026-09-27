// Author: Kevin Pabón

// internal imports
import type { CreateBrandDTO } from '@/dtos/CreateBrandDTO'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { useBrandStore } from '@/stores/BrandStore'
import { isValidEmail, normalizeEmail } from '@/utils/email'
import { generateId } from '@/utils/generateId'

export class BrandService {
  private static validate(brandData: CreateBrandDTO): void {
    if (!brandData.name || typeof brandData.name !== 'string') {
      throw new Error('Brand: name is required')
    }
    if (!brandData.industry || typeof brandData.industry !== 'string') {
      throw new Error('Brand: industry is required')
    }
    if (!brandData.contactName || typeof brandData.contactName !== 'string') {
      throw new Error('Brand: contact name is required')
    }
    if (!isValidEmail(brandData.contactEmail ?? '')) {
      throw new Error('Brand: contact email has an invalid format')
    }
  }

  /**
   * Gets every brand in the store.
   * @returns All brands.
   */
  static getAll(): BrandInterface[] {
    return useBrandStore().brands
  }

  /**
   * Finds a brand by id.
   * @param id - Id of the brand to look up.
   * @returns The matching brand, or `undefined` if not found.
   */
  static getById(id: string): BrandInterface | undefined {
    return useBrandStore().brands.find((brand) => brand.id === id)
  }

  /**
   * Validates and creates a new brand.
   * @param brandData - Data required to create the brand.
   * @returns The created brand, with its id and timestamps.
   * @throws {Error} If any required field is missing or the email is invalid.
   */
  static create(brandData: CreateBrandDTO): BrandInterface {
    const normalizedData: CreateBrandDTO = {
      ...brandData,
      contactEmail: normalizeEmail(brandData.contactEmail),
    }
    this.validate(normalizedData)
    const now = new Date().toISOString()
    const newBrand: BrandInterface = {
      ...normalizedData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    useBrandStore().brands.push(newBrand)
    return newBrand
  }

  /**
   * Validates and applies partial changes to a brand.
   * @param id - Id of the brand to update.
   * @param changes - Partial fields to change.
   * @returns The updated brand, or `undefined` if not found.
   * @throws {Error} If the merged data fails validation.
   */
  static update(id: string, changes: Partial<CreateBrandDTO>): BrandInterface | undefined {
    const brands = useBrandStore().brands
    const index = brands.findIndex((brand) => brand.id === id)
    if (index === -1) return undefined
    const merged: CreateBrandDTO = {
      name: changes.name ?? brands[index].name,
      industry: changes.industry ?? brands[index].industry,
      contactName: changes.contactName ?? brands[index].contactName,
      contactEmail: changes.contactEmail ?? brands[index].contactEmail,
    }
    this.validate(merged)
    const updated: BrandInterface = {
      ...brands[index],
      ...merged,
      contactEmail: normalizeEmail(merged.contactEmail),
      updatedAt: new Date().toISOString(),
    }
    brands[index] = updated
    return updated
  }

  /**
   * Removes a brand by id.
   * @param id - Id of the brand to remove.
   * @returns `true` if it was removed, `false` if not found.
   */
  static remove(id: string): boolean {
    const brands = useBrandStore().brands
    const index = brands.findIndex((brand) => brand.id === id)
    if (index === -1) return false
    brands.splice(index, 1)
    return true
  }
}
