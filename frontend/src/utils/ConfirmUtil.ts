// Author: Kevin Pabón

export class ConfirmUtil {
  /**
   * Standard confirmation before deleting a record, with the entity name in the message.
   * @param entity - Name of the entity to delete, e.g. `order`.
   * @returns `true` if the user confirmed the deletion.
   */
  static confirmDeletion(entity: string): boolean {
    return confirm(`Delete this ${entity}? This action cannot be undone.`)
  }
}
