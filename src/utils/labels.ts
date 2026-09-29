// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'
import type { UserRole } from '@/interfaces/UserInterface'

/** Visible text and brand color (CSS variable name) of an enum value. */
interface LabelEntry {
  text: string
  /** CSS variable name from src/assets/base.css, unresolved (ADR-0003). */
  color: string
}

/** Option ready for a <select>, derived from a label map. */
export interface SelectOption<Value extends string> {
  value: Value
  label: string
}

/**
 * Label and color of each OrderStatus, in the same order as STATUSES.
 * The color reuses the same variable that already painted each status in
 * OrdersTable.vue: only delivered/approved had their own accent
 * (--color-success); the rest use the badge's default text color
 * (--color-text). No color changes.
 */
export const STATUS_LABELS: Record<OrderStatus, LabelEntry> = {
  requested: { text: 'Requested', color: '--color-text' },
  assigned: { text: 'Assigned', color: '--color-text' },
  in_production: { text: 'In production', color: '--color-text' },
  delivered: { text: 'Delivered', color: '--color-success' },
  approved: { text: 'Approved', color: '--color-success' },
}

/**
 * Label and color of each UserRole. The color reuses the same variable that
 * already painted the role badge in UsersTable.vue: only admin had its own
 * accent (--color-primary); coordinator uses the default text color
 * (--color-text). No color changes.
 */
export const ROLE_LABELS: Record<UserRole, LabelEntry> = {
  admin: { text: 'Administrator', color: '--color-primary' },
  coordinator: { text: 'Coordinator', color: '--color-text' },
}

/** Readable label of an OrderStatus, reused by the Orders table and the Reports charts. */
export function formatStatus(status: OrderStatus): string {
  return STATUS_LABELS[status].text
}

/** Readable label of a UserRole, reused by the Users table and the NavBar. */
export function formatRole(role: UserRole): string {
  return ROLE_LABELS[role].text
}

/** Builds a <select>'s options from a label map, in the order of its keys. */
export function toSelectOptions<Value extends string>(
  labels: Record<Value, LabelEntry>,
): SelectOption<Value>[] {
  return (Object.keys(labels) as Value[]).map((value) => ({
    value,
    label: labels[value].text,
  }))
}
