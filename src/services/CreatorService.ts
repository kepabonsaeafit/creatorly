// Kevin Pabón

// internal imports
import type { CreateCreatorDTO } from '@/dtos/CreateCreatorDTO'
import type { CreatorFilterDTO } from '@/dtos/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { useCreatorStore } from '@/stores/CreatorStore'
import { generateId } from '@/utils/generateId'

export class CreatorService {
  private static validate(creatorData: CreateCreatorDTO): void {
    if (!creatorData.name || typeof creatorData.name !== 'string') {
      throw new Error('Creador: el nombre es obligatorio')
    }
    if (!creatorData.niche || typeof creatorData.niche !== 'string') {
      throw new Error('Creador: el nicho es obligatorio')
    }
    if (!creatorData.contentType || typeof creatorData.contentType !== 'string') {
      throw new Error('Creador: el tipo de contenido es obligatorio')
    }
    if (
      typeof creatorData.rate !== 'number' ||
      Number.isNaN(creatorData.rate) ||
      creatorData.rate < 0
    ) {
      throw new Error('Creador: la tarifa debe ser un número >= 0')
    }
  }

  static getAll(): CreatorInterface[] {
    return useCreatorStore().creators
  }

  static getById(id: string): CreatorInterface | undefined {
    return useCreatorStore().creators.find((creator) => creator.id === id)
  }

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

  static remove(id: string): boolean {
    const creators = useCreatorStore().creators
    const index = creators.findIndex((creator) => creator.id === id)
    if (index === -1) return false
    creators.splice(index, 1)
    return true
  }

  /**
   * Aplica un CreatorFilterDTO sobre una lista de creadores y ordena el
   * resultado por nombre. Usado por CreatorsIndexView.
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

  /** Nichos distintos presentes en el catálogo, ordenados, para poblar el filtro. */
  static getNiches(): string[] {
    const uniqueNiches = new Set(this.getAll().map((creator) => creator.niche))
    return [...uniqueNiches].sort((first, second) => first.localeCompare(second))
  }
}
