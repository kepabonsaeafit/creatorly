// Author: Kevin Pabón

// internal imports
import type { OrderStatus } from '@/interfaces/OrderInterface'
import type { UserRole } from '@/interfaces/UserInterface'

/** Texto visible y color de marca (nombre de variable CSS) de un valor de enum. */
interface LabelEntry {
  text: string
  /** Nombre de variable CSS de src/assets/base.css, sin resolver (ADR-0003). */
  color: string
}

/** Opción lista para un <select>, derivada de un mapa de labels. */
export interface SelectOption<Value extends string> {
  value: Value
  label: string
}

/**
 * Etiqueta y color de cada OrderStatus, en el mismo orden de STATUSES.
 * El color reusa la misma variable que ya pintaba cada estado en
 * OrdersTable.vue: solo delivered/approved tenían un acento propio
 * (--color-success); el resto usa el texto por defecto del badge
 * (--color-text). Ningún color cambia.
 */
export const STATUS_LABELS: Record<OrderStatus, LabelEntry> = {
  requested: { text: 'Requested', color: '--color-text' },
  assigned: { text: 'Assigned', color: '--color-text' },
  in_production: { text: 'In production', color: '--color-text' },
  delivered: { text: 'Delivered', color: '--color-success' },
  approved: { text: 'Approved', color: '--color-success' },
}

/**
 * Etiqueta y color de cada UserRole. El color reusa la misma variable que ya
 * pintaba el badge de rol en UsersTable.vue: solo admin tenía un acento
 * propio (--color-primary); coordinator usa el texto por defecto
 * (--color-text). Ningún color cambia.
 */
export const ROLE_LABELS: Record<UserRole, LabelEntry> = {
  admin: { text: 'Administrator', color: '--color-primary' },
  coordinator: { text: 'Coordinator', color: '--color-text' },
}

/** Etiqueta legible de un OrderStatus, reusada por la tabla de Pedidos y los gráficos de Reportes. */
export function formatStatus(status: OrderStatus): string {
  return STATUS_LABELS[status].text
}

/** Etiqueta legible de un UserRole, reusada por la tabla de Usuarios y el NavBar. */
export function formatRole(role: UserRole): string {
  return ROLE_LABELS[role].text
}

/** Arma las opciones de un <select> a partir de un mapa de labels, en el orden de sus claves. */
export function toSelectOptions<Value extends string>(
  labels: Record<Value, LabelEntry>,
): SelectOption<Value>[] {
  return (Object.keys(labels) as Value[]).map((value) => ({
    value,
    label: labels[value].text,
  }))
}
