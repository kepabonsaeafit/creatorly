// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import type { UserFilterDTO } from '@/dtos/Users/UserFilterDTO'
import type { UserInterface } from '@/interfaces/UserInterface'

export class UserService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`

  /**
   * Gets every user from the API.
   * @returns All users.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async getAll(): Promise<UserInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds a user by id.
   * @param id - Id of the user to look up.
   * @returns The matching user, or `null` if none has that id.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async getById(id: number): Promise<UserInterface | null> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    // the API answers an empty body (not JSON null) when no user has that id
    return data || null
  }

  /**
   * Creates a new user. The backend validates it.
   * @param userData - Data required to create the user.
   * @returns The created user, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async create(userData: CreateUserDTO): Promise<UserInterface> {
    const { data } = await axios.post(this.API_URL, userData)

    return data
  }

  /**
   * Applies partial changes to a user. The backend validates them, including
   * the rules that an admin cannot drop their own admin role.
   * @param id - Id of the user to update.
   * @param changes - Partial fields to change.
   * @returns The updated user.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async update(id: number, changes: Partial<CreateUserDTO>): Promise<UserInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, changes)

    return data
  }

  /**
   * Removes a user by id. The backend rejects deleting the logged-in user
   * and users that still have orders.
   * @param id - Id of the user to remove.
   * @throws {AxiosError} If the API rejects the request.
   */
  public static async remove(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }

  /**
   * Users with the coordinator role, for OrderForm's coordinator select.
   * @param users - Users already fetched from the API.
   * @returns The users with the coordinator role.
   */
  public static getCoordinators(users: UserInterface[]): UserInterface[] {
    return users.filter((user) => user.role === 'coordinator')
  }

  /**
   * Applies a UserFilterDTO over a list of users already fetched from the API
   * and sorts the result by name. Used by UsersIndexView.
   * @param users - Users to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted users.
   */
  public static filter(users: UserInterface[], filter: UserFilterDTO): UserInterface[] {
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
}
