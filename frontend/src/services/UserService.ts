// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateUserDTO } from '@/dtos/Users/CreateUserDTO'
import type { UserInterface } from '@/interfaces/UserInterface'

export class UserService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`

  /**
   * Gets every user from the API.
   * @returns All users.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getAll(): Promise<UserInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds a user by id.
   * @param id - Id of the user to look up.
   * @returns The matching user.
   * @throws {AxiosError} If the API rejects the request (404 if no user has that id).
   */
  static async getById(id: number): Promise<UserInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    return data
  }

  /**
   * Creates a new user. The backend validates it.
   * @param userData - Data required to create the user.
   * @returns The created user, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async create(userData: CreateUserDTO): Promise<UserInterface> {
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
  static async update(id: number, changes: Partial<CreateUserDTO>): Promise<UserInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, changes)

    return data
  }

  /**
   * Removes a user by id. The backend rejects deleting the logged-in user
   * and users that still have orders.
   * @param id - Id of the user to remove.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async remove(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }
}
