// Kevin Pabón

// internal imports
import type { CreateBrandDTO } from '@/dtos/CreateBrandDTO'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import { useBrandStore } from '@/stores/BrandStore'
import { isValidEmail, normalizeEmail } from '@/utils/email'
import { generateId } from '@/utils/generateId'

export class BrandService {
  private static validate(datos: CreateBrandDTO): void {
    if (!datos.name || typeof datos.name !== 'string') {
      throw new Error('Marca: el nombre es obligatorio')
    }
    if (!datos.industry || typeof datos.industry !== 'string') {
      throw new Error('Marca: la industria es obligatoria')
    }
    if (!datos.contactName || typeof datos.contactName !== 'string') {
      throw new Error('Marca: el nombre del contacto es obligatorio')
    }
    if (!isValidEmail(datos.contactEmail ?? '')) {
      throw new Error('Marca: el email del contacto no tiene un formato válido')
    }
  }

  static getAll(): BrandInterface[] {
    return useBrandStore().brands
  }

  static getById(id: string): BrandInterface | undefined {
    return useBrandStore().brands.find((marca) => marca.id === id)
  }

  static create(datos: CreateBrandDTO): BrandInterface {
    const normalizado: CreateBrandDTO = {
      ...datos,
      contactEmail: normalizeEmail(datos.contactEmail),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevaMarca: BrandInterface = {
      ...normalizado,
      id: generateId(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useBrandStore().brands.push(nuevaMarca)
    return nuevaMarca
  }

  static update(id: string, cambios: Partial<CreateBrandDTO>): BrandInterface | undefined {
    const marcas = useBrandStore().brands
    const indice = marcas.findIndex((marca) => marca.id === id)
    if (indice === -1) return undefined
    const combinado: CreateBrandDTO = {
      name: cambios.name ?? marcas[indice].name,
      industry: cambios.industry ?? marcas[indice].industry,
      contactName: cambios.contactName ?? marcas[indice].contactName,
      contactEmail: cambios.contactEmail ?? marcas[indice].contactEmail,
    }
    this.validate(combinado)
    const actualizado: BrandInterface = {
      ...marcas[indice],
      ...combinado,
      contactEmail: normalizeEmail(combinado.contactEmail),
      updatedAt: new Date().toISOString(),
    }
    marcas[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const marcas = useBrandStore().brands
    const indice = marcas.findIndex((marca) => marca.id === id)
    if (indice === -1) return false
    marcas.splice(indice, 1)
    return true
  }
}
