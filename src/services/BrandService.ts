// Kevin Pabón

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

  static getAll(): BrandInterface[] {
    return useBrandStore().brands
  }

  static getById(id: string): BrandInterface | undefined {
    return useBrandStore().brands.find((brand) => brand.id === id)
  }

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

  static remove(id: string): boolean {
    const brands = useBrandStore().brands
    const index = brands.findIndex((brand) => brand.id === id)
    if (index === -1) return false
    brands.splice(index, 1)
    return true
  }
}
