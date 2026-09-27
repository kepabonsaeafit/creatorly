// Kevin Pabón

/** Confirmación estándar antes de eliminar un registro, con el nombre de la entidad en el mensaje. */
export function confirmarEliminacion(entidad: string): boolean {
  return confirm(`¿Eliminar este ${entidad}? Esta acción no se puede deshacer.`)
}
