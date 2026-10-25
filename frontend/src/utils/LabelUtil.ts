// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'
import type { SelectOptionInterface } from '@/interfaces/SelectOptionInterface'
import type { UserRole } from '@/interfaces/UserInterface'

/** Visible text and brand color (CSS variable name) of an enum value. */
interface LabelEntry {
  text: string
  /** CSS variable name from src/assets/base.css, unresolved (ADR-0003). */
  color: string
}

/** Any entity with an id and a name, such as a brand, a creator or a user. */
interface NamedEntity {
  id: number
  name: string
}

export class LabelUtil {
  /**
   * Label and color of each OrderStatus, in the same order as STATUSES.
   * The color reuses the same variable that already painted each status in
   * OrdersTableComponent.vue: only delivered/approved had their own accent
   * (--color-success); the rest use the badge's default text color
   * (--color-text). No color changes.
   */
  static readonly ORDER_STATUS: Record<OrderStatus, LabelEntry> = {
    requested: { text: 'Requested', color: '--color-text' },
    assigned: { text: 'Assigned', color: '--color-text' },
    in_production: { text: 'In production', color: '--color-text' },
    delivered: { text: 'Delivered', color: '--color-success' },
    approved: { text: 'Approved', color: '--color-success' },
  }

  /**
   * Label and color of each UserRole. The color reuses the same variable that
   * already painted the role badge in UsersTableComponent.vue: only admin had its own
   * accent (--color-primary); coordinator uses the default text color
   * (--color-text). No color changes.
   */
  static readonly USER_ROLE: Record<UserRole, LabelEntry> = {
    admin: { text: 'Administrator', color: '--color-primary' },
    coordinator: { text: 'Coordinator', color: '--color-text' },
  }

  /**
   * Readable label of an OrderStatus, reused by the Orders table and the Reports charts.
   * @param status - Status to label.
   * @returns The visible text of the status.
   */
  static formatStatus(status: OrderStatus): string {
    return this.ORDER_STATUS[status].text
  }

  /**
   * Readable label of a UserRole, reused by the Users table and the NavBarComponent.
   * @param role - Role to label.
   * @returns The visible text of the role.
   */
  static formatRole(role: UserRole): string {
    return this.USER_ROLE[role].text
  }

  /**
   * Builds a <select>'s options from a label map, in the order of its keys.
   * @param labels - Label map to read the options from.
   * @returns The options, with the key as value and the text as label.
   */
  static toSelectOptions<Value extends string>(
    labels: Record<Value, LabelEntry>,
  ): SelectOptionInterface<Value>[] {
    return (Object.keys(labels) as Value[]).map((value: Value): SelectOptionInterface<Value> => ({
      value,
      label: labels[value].text,
    }))
  }

  /**
   * Builds a <select>'s options from entities already fetched from the API
   * (brands, creators, coordinators), in the order they come.
   * @param entities - Entities to read the options from.
   * @returns The options, with the id as value and the name as label.
   */
  static toEntityOptions(entities: NamedEntity[]): SelectOptionInterface<number>[] {
    return entities.map((entity: NamedEntity): SelectOptionInterface<number> => ({
      value: entity.id,
      label: entity.name,
    }))
  }
}
