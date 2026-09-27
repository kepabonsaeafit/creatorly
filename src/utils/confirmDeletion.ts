// Kevin Pabón

/** Confirmación estándar antes de eliminar un registro, con el nombre de la entidad en el mensaje. */
export function confirmDeletion(entity: string): boolean {
  return confirm(`Delete this ${entity}? This action cannot be undone.`)
}
