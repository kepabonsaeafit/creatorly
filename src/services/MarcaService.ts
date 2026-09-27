// Kevin Pabón

// internal imports
import type { CreateMarcaDTO } from '@/dtos/CreateMarcaDTO'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import { useMarcaStore } from '@/stores/MarcaStore'
import { isValidEmail, normalizeEmail } from '@/utils/email'
import { generateId } from '@/utils/generateId'

export class MarcaService {
  private static validate(datos: CreateMarcaDTO): void {
    if (!datos.nombre || typeof datos.nombre !== 'string') {
      throw new Error('Marca: el nombre es obligatorio')
    }
    if (!datos.industria || typeof datos.industria !== 'string') {
      throw new Error('Marca: la industria es obligatoria')
    }
    if (!datos.contactoNombre || typeof datos.contactoNombre !== 'string') {
      throw new Error('Marca: el nombre del contacto es obligatorio')
    }
    if (!isValidEmail(datos.contactoEmail ?? '')) {
      throw new Error('Marca: el email del contacto no tiene un formato válido')
    }
  }

  static getAll(): MarcaInterface[] {
    return useMarcaStore().marcas
  }

  static getById(id: string): MarcaInterface | undefined {
    return useMarcaStore().marcas.find((marca) => marca.id === id)
  }

  static create(datos: CreateMarcaDTO): MarcaInterface {
    const normalizado: CreateMarcaDTO = {
      ...datos,
      contactoEmail: normalizeEmail(datos.contactoEmail),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevaMarca: MarcaInterface = {
      ...normalizado,
      id: generateId(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useMarcaStore().marcas.push(nuevaMarca)
    return nuevaMarca
  }

  static update(id: string, cambios: Partial<CreateMarcaDTO>): MarcaInterface | undefined {
    const marcas = useMarcaStore().marcas
    const indice = marcas.findIndex((marca) => marca.id === id)
    if (indice === -1) return undefined
    const combinado: CreateMarcaDTO = {
      nombre: cambios.nombre ?? marcas[indice].nombre,
      industria: cambios.industria ?? marcas[indice].industria,
      contactoNombre: cambios.contactoNombre ?? marcas[indice].contactoNombre,
      contactoEmail: cambios.contactoEmail ?? marcas[indice].contactoEmail,
    }
    this.validate(combinado)
    const actualizado: MarcaInterface = {
      ...marcas[indice],
      ...combinado,
      contactoEmail: normalizeEmail(combinado.contactoEmail),
      updatedAt: new Date().toISOString(),
    }
    marcas[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const marcas = useMarcaStore().marcas
    const indice = marcas.findIndex((marca) => marca.id === id)
    if (indice === -1) return false
    marcas.splice(indice, 1)
    return true
  }
}
