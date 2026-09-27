// Author: Kevin Pabón

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

  /**
   * Gets every user in the store.
   * @returns All users.
   */
  static getAll(): UserInterface[] {
    return useUserStore().users
  }

  /**
   * Users with the coordinator role, for OrderForm's coordinator select.
   * @returns The users with the coordinator role.
   */
  static getCoordinators(): UserInterface[] {
    return this.getAll().filter((user) => user.role === 'coordinator')
  }

  /**
   * Finds a user by id. Returns `undefined` on purpose if it does not exist:
   * the caller decides how to handle the absence.
   * @param id - Id of the user to look up.
   * @returns The matching user, or `undefined` if not found.
   */
  static getById(id: string): UserInterface | undefined {
    return useUserStore().users.find((user) => user.id === id)
  }

  /**
   * Finds a user by email and password.
   * @param credentials - Email and password to match.
   * @returns The matching user, or `undefined` if not found.
   */
  static findByCredentials(credentials: LoginDTO): UserInterface | undefined {
    const normalizedEmail = normalizeEmail(credentials.email ?? '')
    return useUserStore().users.find(
      (user) => user.email === normalizedEmail && user.password === credentials.password,
    )
  }

  /**
   * Validates and creates a new user.
   * @param userData - Data required to create the user.
   * @returns The created user, with its id and timestamps.
   * @throws {Error} If any required field is missing or invalid.
   */
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

  /**
   * Validates and applies partial changes to a user.
   * @param id - Id of the user to update.
   * @param changes - Partial fields to change.
   * @returns The updated user, or `undefined` if not found.
   * @throws {Error} If the merged data fails validation.
   */
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

  /**
   * Removes a user by id.
   * @param id - Id of the user to remove.
   * @returns `true` if it was removed, `false` if not found.
   */
  static remove(id: string): boolean {
    const users = useUserStore().users
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  }

  /**
   * Applies a UserFilterDTO over a list of users and sorts the result by
   * name. Used by UsersIndexView.
   * @param users - Users to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted users.
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
   * The seed brings a single admin: if they removed their own role they would
   * lose access to this page, with no way to give it back from the interface.
   * @param currentUserId - Id of the active session's user.
   * @param id - Id of the user being edited.
   * @param newRole - Role that would be assigned.
   * @throws {Error} If the user is changing their own admin role away from admin.
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

  /**
   * Validates that a user is not deleting their own active session.
   * @param currentUserId - Id of the active session's user.
   * @param id - Id of the user to delete.
   * @throws {Error} If the id matches the active session's user.
   */
  static validateDeletion(currentUserId: string | undefined, id: string): void {
    if (id === currentUserId) {
      throw new Error('User: you cannot delete the user you are logged in as')
    }
  }
}
