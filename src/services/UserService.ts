// Kevin Pabón

// internal imports
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import type { LoginDTO } from '@/dtos/LoginDTO'
import type { UserFilterDTO } from '@/dtos/UserFilterDTO'
import { ROLES, type UserInterface, type UserRole } from '@/interfaces/UserInterface'
import { useUserStore } from '@/stores/UserStore'
import { isValidEmail, normalizeEmail } from '@/utils/email'
import { generateId } from '@/utils/generateId'

export class UserService {
  private static validate(datos: CreateUserDTO): void {
    if (!datos.name || typeof datos.name !== 'string') {
      throw new Error('User: el nombre es obligatorio')
    }
    if (!isValidEmail(datos.email ?? '')) {
      throw new Error('User: el email no tiene un formato válido')
    }
    if (!datos.password || typeof datos.password !== 'string') {
      throw new Error('User: la contraseña es obligatoria')
    }
    if (!ROLES.includes(datos.role)) {
      throw new Error(`User: el rol debe ser uno de ${ROLES.join(' | ')}`)
    }
  }

  static getAll(): UserInterface[] {
    return useUserStore().users
  }

  /** Usuarios con rol coordinador, para el select de coordinador de OrderForm. */
  static getCoordinators(): UserInterface[] {
    return this.getAll().filter((usuario) => usuario.role === 'coordinador')
  }

  /** Devuelve undefined si no existe, a propósito: el llamador decide cómo manejar la ausencia. */
  static getById(id: string): UserInterface | undefined {
    return useUserStore().users.find((usuario) => usuario.id === id)
  }

  static findByCredentials(credenciales: LoginDTO): UserInterface | undefined {
    const emailNormalizado = normalizeEmail(credenciales.email ?? '')
    return useUserStore().users.find(
      (usuario) => usuario.email === emailNormalizado && usuario.password === credenciales.password,
    )
  }

  static create(datos: CreateUserDTO): UserInterface {
    const normalizado: CreateUserDTO = {
      ...datos,
      role: datos.role ?? 'coordinador',
      email: normalizeEmail(datos.email),
    }
    this.validate(normalizado)
    const ahora = new Date().toISOString()
    const nuevoUsuario: UserInterface = {
      ...normalizado,
      id: generateId(),
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
      name: cambios.name ?? usuarios[indice].name,
      email: cambios.email ?? usuarios[indice].email,
      password: cambios.password ?? usuarios[indice].password,
      role: cambios.role ?? usuarios[indice].role,
    }
    this.validate(combinado)
    const actualizado: UserInterface = {
      ...usuarios[indice],
      ...combinado,
      email: normalizeEmail(combinado.email),
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

  /**
   * Aplica un UserFilterDTO sobre una lista de usuarios y ordena el
   * resultado por nombre. Usado por UsersIndexView.
   */
  static filter(usuarios: UserInterface[], filtro: UserFilterDTO): UserInterface[] {
    return usuarios
      .filter((usuario) => {
        if (filtro.role && usuario.role !== filtro.role) return false
        if (filtro.text) {
          const texto = filtro.text.trim().toLowerCase()
          if (
            texto &&
            !usuario.name.toLowerCase().includes(texto) &&
            !usuario.email.toLowerCase().includes(texto)
          ) {
            return false
          }
        }
        return true
      })
      .sort((primero, segundo) => primero.name.localeCompare(segundo.name))
  }

  /**
   * La siembra trae un solo admin: si se quitara el rol a sí mismo perdería el
   * acceso a esta página y no habría forma de devolvérselo desde la interfaz.
   */
  static validateOwnRoleChange(
    usuarioActualId: string | undefined,
    id: string,
    rolNuevo: UserRole,
  ): void {
    if (id === usuarioActualId && rolNuevo !== 'admin') {
      throw new Error('User: no puedes quitarte el rol de admin mientras es tu propia sesión')
    }
  }

  static validateDeletion(usuarioActualId: string | undefined, id: string): void {
    if (id === usuarioActualId) {
      throw new Error('User: no puedes eliminar el usuario con el que iniciaste sesión')
    }
  }
}
