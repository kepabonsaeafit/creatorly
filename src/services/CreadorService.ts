// Kevin Pabón

// internal imports
import type { CreateCreadorDTO } from '@/dtos/CreateCreadorDTO'
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import { useCreadorStore } from '@/stores/CreadorStore'

function validate(datos: CreateCreadorDTO): void {
  if (!datos.nombre || typeof datos.nombre !== 'string') {
    throw new Error('Creador: el nombre es obligatorio')
  }
  if (!datos.nicho || typeof datos.nicho !== 'string') {
    throw new Error('Creador: el nicho es obligatorio')
  }
  if (!datos.tipoContenido || typeof datos.tipoContenido !== 'string') {
    throw new Error('Creador: el tipo de contenido es obligatorio')
  }
  if (typeof datos.tarifa !== 'number' || Number.isNaN(datos.tarifa) || datos.tarifa < 0) {
    throw new Error('Creador: la tarifa debe ser un número >= 0')
  }
}

export class CreadorService {
  static getAll(): CreadorInterface[] {
    return useCreadorStore().creadores
  }

  static getById(id: string): CreadorInterface | undefined {
    return useCreadorStore().creadores.find((creador) => creador.id === id)
  }

  static create(datos: CreateCreadorDTO): CreadorInterface {
    const normalizado: CreateCreadorDTO = { ...datos, disponible: datos.disponible ?? true }
    validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoCreador: CreadorInterface = {
      ...normalizado,
      disponible: Boolean(normalizado.disponible),
      id: crypto.randomUUID(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useCreadorStore().creadores.push(nuevoCreador)
    return nuevoCreador
  }

  static update(id: string, cambios: Partial<CreateCreadorDTO>): CreadorInterface | undefined {
    const creadores = useCreadorStore().creadores
    const indice = creadores.findIndex((creador) => creador.id === id)
    if (indice === -1) return undefined
    const combinado: CreateCreadorDTO = {
      nombre: cambios.nombre ?? creadores[indice].nombre,
      nicho: cambios.nicho ?? creadores[indice].nicho,
      tipoContenido: cambios.tipoContenido ?? creadores[indice].tipoContenido,
      tarifa: cambios.tarifa ?? creadores[indice].tarifa,
      disponible: cambios.disponible ?? creadores[indice].disponible,
    }
    validate(combinado)
    const actualizado: CreadorInterface = {
      ...creadores[indice],
      ...combinado,
      disponible: Boolean(combinado.disponible),
      updatedAt: new Date().toISOString(),
    }
    creadores[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const creadores = useCreadorStore().creadores
    const indice = creadores.findIndex((creador) => creador.id === id)
    if (indice === -1) return false
    creadores.splice(indice, 1)
    return true
  }
}
