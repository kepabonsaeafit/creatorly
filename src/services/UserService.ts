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
  private static validate(userData: CreateUserDTO): void {
    if (!userData.name || typeof userData.name !== 'string') {
      throw new Error('User: name is required')
    }
    if (!isValidEmail(userData.email ?? '')) {
      throw new Error('User: email has an invalid format')
    }
    if (!userData.password || typeof userData.password !== 'string') {
      throw new Error('User: password is required')
    }
    if (!ROLES.includes(userData.role)) {
      throw new Error(`User: role must be one of ${ROLES.join(' | ')}`)
    }
  }

  static getAll(): UserInterface[] {
    return useUserStore().users
  }

  /** Usuarios con rol coordinador, para el select de coordinador de OrderForm. */
  static getCoordinators(): UserInterface[] {
    return this.getAll().filter((user) => user.role === 'coordinator')
  }

  /** Devuelve undefined si no existe, a propósito: el llamador decide cómo manejar la ausencia. */
  static getById(id: string): UserInterface | undefined {
    return useUserStore().users.find((user) => user.id === id)
  }

  static findByCredentials(credentials: LoginDTO): UserInterface | undefined {
    const normalizedEmail = normalizeEmail(credentials.email ?? '')
    return useUserStore().users.find(
      (user) => user.email === normalizedEmail && user.password === credentials.password,
    )
  }

  static create(userData: CreateUserDTO): UserInterface {
    const normalizedData: CreateUserDTO = {
      ...userData,
      role: userData.role ?? 'coordinator',
      email: normalizeEmail(userData.email),
    }
    this.validate(normalizedData)
    const now = new Date().toISOString()
    const newUser: UserInterface = {
      ...normalizedData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    useUserStore().users.push(newUser)
    return newUser
  }

  static update(id: string, changes: Partial<CreateUserDTO>): UserInterface | undefined {
    const users = useUserStore().users
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return undefined
    const merged: CreateUserDTO = {
      name: changes.name ?? users[index].name,
      email: changes.email ?? users[index].email,
      password: changes.password ?? users[index].password,
      role: changes.role ?? users[index].role,
    }
    this.validate(merged)
    const updated: UserInterface = {
      ...users[index],
      ...merged,
      email: normalizeEmail(merged.email),
      updatedAt: new Date().toISOString(),
    }
    users[index] = updated
    return updated
  }

  static remove(id: string): boolean {
    const users = useUserStore().users
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  }

  /**
   * Aplica un UserFilterDTO sobre una lista de usuarios y ordena el
   * resultado por nombre. Usado por UsersIndexView.
   */
  static filter(users: UserInterface[], filter: UserFilterDTO): UserInterface[] {
    return users
      .filter((user) => {
        if (filter.role && user.role !== filter.role) return false
        if (filter.text) {
          const text = filter.text.trim().toLowerCase()
          if (
            text &&
            !user.name.toLowerCase().includes(text) &&
            !user.email.toLowerCase().includes(text)
          ) {
            return false
          }
        }
        return true
      })
      .sort((first, second) => first.name.localeCompare(second.name))
  }

  /**
   * La siembra trae un solo admin: si se quitara el rol a sí mismo perdería el
   * acceso a esta página y no habría forma de devolvérselo desde la interfaz.
   */
  static validateOwnRoleChange(
    currentUserId: string | undefined,
    id: string,
    newRole: UserRole,
  ): void {
    if (id === currentUserId && newRole !== 'admin') {
      throw new Error('User: you cannot remove the admin role while it is your own session')
    }
  }

  static validateDeletion(currentUserId: string | undefined, id: string): void {
    if (id === currentUserId) {
      throw new Error('User: you cannot delete the user you are logged in as')
    }
  }
}
