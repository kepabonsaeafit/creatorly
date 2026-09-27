// Kevin Pabón

// internal imports
import type { CreateCreatorDTO } from '@/dtos/CreateCreatorDTO'
import type { CreatorFilterDTO } from '@/dtos/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { useCreatorStore } from '@/stores/CreatorStore'
import { generateId } from '@/utils/generateId'

export class CreatorService {
  private static validate(datos: CreateCreatorDTO): void {
    if (!datos.name || typeof datos.name !== 'string') {
      throw new Error('Creador: el nombre es obligatorio')
    }
    if (!datos.niche || typeof datos.niche !== 'string') {
      throw new Error('Creador: el nicho es obligatorio')
    }
    if (!datos.contentType || typeof datos.contentType !== 'string') {
      throw new Error('Creador: el tipo de contenido es obligatorio')
    }
    if (typeof datos.rate !== 'number' || Number.isNaN(datos.rate) || datos.rate < 0) {
      throw new Error('Creador: la tarifa debe ser un número >= 0')
    }
  }

  static getAll(): CreatorInterface[] {
    return useCreatorStore().creators
  }

  static getById(id: string): CreatorInterface | undefined {
    return useCreatorStore().creators.find((creador) => creador.id === id)
  }

  static create(datos: CreateCreatorDTO): CreatorInterface {
    const normalizado: CreateCreatorDTO = { ...datos, available: datos.available ?? true }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoCreador: CreatorInterface = {
      ...normalizado,
      available: Boolean(normalizado.available),
      id: generateId(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useCreatorStore().creators.push(nuevoCreador)
    return nuevoCreador
  }

  static update(id: string, cambios: Partial<CreateCreatorDTO>): CreatorInterface | undefined {
    const creadores = useCreatorStore().creators
    const indice = creadores.findIndex((creador) => creador.id === id)
    if (indice === -1) return undefined
    const combinado: CreateCreatorDTO = {
      name: cambios.name ?? creadores[indice].name,
      niche: cambios.niche ?? creadores[indice].niche,
      contentType: cambios.contentType ?? creadores[indice].contentType,
      rate: cambios.rate ?? creadores[indice].rate,
      available: cambios.available ?? creadores[indice].available,
    }
    this.validate(combinado)
    const actualizado: CreatorInterface = {
      ...creadores[indice],
      ...combinado,
      available: Boolean(combinado.available),
      updatedAt: new Date().toISOString(),
    }
    creadores[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const creadores = useCreatorStore().creators
    const indice = creadores.findIndex((creador) => creador.id === id)
    if (indice === -1) return false
    creadores.splice(indice, 1)
    return true
  }

  /**
   * Aplica un CreatorFilterDTO sobre una lista de creadores y ordena el
   * resultado por nombre. Usado por CreatorsIndexView.
   */
  static filter(creadores: CreatorInterface[], filtro: CreatorFilterDTO): CreatorInterface[] {
    return creadores
      .filter((creador) => {
        if (filtro.niche && creador.niche !== filtro.niche) return false
        if (filtro.available !== undefined && creador.available !== filtro.available) return false
        if (filtro.text) {
          const texto = filtro.text.trim().toLowerCase()
          if (texto && !creador.name.toLowerCase().includes(texto)) return false
        }
        return true
      })
      .sort((primero, segundo) => primero.name.localeCompare(segundo.name))
  }

  /** Nichos distintos presentes en el catálogo, ordenados, para poblar el filtro. */
  static getNiches(): string[] {
    const unicos = new Set(this.getAll().map((creador) => creador.niche))
    return [...unicos].sort((primero, segundo) => primero.localeCompare(segundo))
  }
}
