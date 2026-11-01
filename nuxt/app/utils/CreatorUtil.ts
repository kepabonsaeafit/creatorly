// Author: Kevin Pabón

export class CreatorUtil {
  /**
   * Label shown for the availability of a creator.
   * @param available - Whether the creator can take new orders.
   * @returns `Available` or `Not available`.
   */
  static getAvailabilityLabel(available: boolean): string {
    return available ? 'Available' : 'Not available'
  }

  /**
   * Bootstrap color of the availability badge of a creator.
   * @param available - Whether the creator can take new orders.
   * @returns `success` when available, `secondary` otherwise.
   */
  static getAvailabilityColor(available: boolean): string {
    return available ? 'success' : 'secondary'
  }
}
