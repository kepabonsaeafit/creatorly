// Author: Kevin Pabón

/** Standard confirmation before deleting a record, with the entity name in the message. */
export function confirmDeletion(entity: string): boolean {
  return confirm(`Delete this ${entity}? This action cannot be undone.`)
}
