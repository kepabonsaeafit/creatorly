// Kevin Pabón

// internal imports
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import type { LoginDTO } from '@/dtos/LoginDTO'
import type { RolUsuario, UserInterface } from '@/interfaces/UserInterface'
import { useUserStore } from '@/stores/UserStore'

const ROLES: RolUsuario[] = ['admin', 'coordinador']

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(datos: CreateUserDTO): void {
  if (!datos.nombre || typeof datos.nombre !== 'string') {
    throw new Error('User: el nombre es obligatorio')
  }
  if (!EMAIL_REGEX.test(datos.email ?? '')) {
    throw new Error('User: el email no tiene un formato válido')
  }
  if (!datos.password || typeof datos.password !== 'string') {
    throw new Error('User: la contraseña es obligatoria')
  }
  if (!ROLES.includes(datos.rol)) {
    throw new Error(`User: el rol debe ser uno de ${ROLES.join(' | ')}`)
  }
}

export class UserService {
  static getAll(): UserInterface[] {
    return useUserStore().users
  }

  /** Devuelve undefined si no existe (a propósito, ver decisión 1 del paso 4). */
  static getById(id: string): UserInterface | undefined {
    return useUserStore().users.find((usuario) => usuario.id === id)
  }

  static findByCredentials(credenciales: LoginDTO): UserInterface | undefined {
    const emailNormalizado = String(credenciales.email ?? '')
      .trim()
      .toLowerCase()
    return useUserStore().users.find(
      (usuario) => usuario.email === emailNormalizado && usuario.password === credenciales.password,
    )
  }

  static create(datos: CreateUserDTO): UserInterface {
    const normalizado: CreateUserDTO = {
      ...datos,
      rol: datos.rol ?? 'coordinador',
      email: String(datos.email).trim().toLowerCase(),
    }
    validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoUsuario: UserInterface = {
      ...normalizado,
      id: crypto.randomUUID(),
      createdAt: ahora,
      updatedAt: ahora,
    }
    useUserStore().users.push(nuevoUsuario)
    return nuevoUsuario
  }

  static update(id: string, cambios: Partial<CreateUserDTO>): UserInterface | undefined {
    const usuarios = useUserStore().users
    const indice = usuarios.findIndex((usuario) => usuario.id === id)
    if (indice === -1) return undefined
    const combinado: CreateUserDTO = {
      nombre: cambios.nombre ?? usuarios[indice].nombre,
      email: cambios.email ?? usuarios[indice].email,
      password: cambios.password ?? usuarios[indice].password,
      rol: cambios.rol ?? usuarios[indice].rol,
    }
    validate(combinado)
    const actualizado: UserInterface = {
      ...usuarios[indice],
      ...combinado,
      email: String(combinado.email).trim().toLowerCase(),
      updatedAt: new Date().toISOString(),
    }
    usuarios[indice] = actualizado
    return actualizado
  }

  static remove(id: string): boolean {
    const usuarios = useUserStore().users
    const indice = usuarios.findIndex((usuario) => usuario.id === id)
    if (indice === -1) return false
    usuarios.splice(indice, 1)
    return true
  }
}
