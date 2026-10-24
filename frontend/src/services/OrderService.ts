// Author: Kevin Pabón

// external imports
import axios from 'axios'

// internal imports
import type { CreateOrderDTO } from '@/dtos/Orders/CreateOrderDTO'
import type { OrderInterface } from '@/interfaces/OrderInterface'

export class OrderService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/orders`

  /**
   * Gets every order from the API.
   * @returns All orders.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async getAll(): Promise<OrderInterface[]> {
    const { data } = await axios.get(this.API_URL)

    return data
  }

  /**
   * Finds an order by id.
   * @param id - Id of the order to look up.
   * @returns The matching order.
   * @throws {AxiosError} If the API rejects the request (404 if no order has that id).
   */
  static async getById(id: number): Promise<OrderInterface> {
    const { data } = await axios.get(`${this.API_URL}/${id}`)

    return data
  }

  /**
   * Creates a new order. The backend validates it, including that the
   * referenced brand, creator and coordinator exist.
   * @param orderData - Data required to create the order.
   * @returns The created order, with its id and timestamps.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async create(orderData: CreateOrderDTO): Promise<OrderInterface> {
    const { data } = await axios.post(this.API_URL, orderData)

    return data
  }

  /**
   * Applies partial changes to an order. The backend validates them.
   * @param id - Id of the order to update.
   * @param changes - Partial fields to change.
   * @returns The updated order.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async update(id: number, changes: Partial<CreateOrderDTO>): Promise<OrderInterface> {
    const { data } = await axios.patch(`${this.API_URL}/${id}`, changes)

    return data
  }

  /**
   * Removes an order by id.
   * @param id - Id of the order to remove.
   * @throws {AxiosError} If the API rejects the request.
   */
  static async remove(id: number): Promise<void> {
    await axios.delete(`${this.API_URL}/${id}`)
  }
}
