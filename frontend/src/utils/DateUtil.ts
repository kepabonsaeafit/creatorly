// Author: Felipe Gómez

export class DateUtil {
  private static readonly DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

  /**
   * Interprets a date in local time. Date-only values (`YYYY-MM-DD`, like
   * requestDate/deliveryDate) carry no time: `new Date('YYYY-MM-DD')`
   * interprets them as UTC midnight, and showing them in local time (e.g.
   * Bogotá, UTC-5) makes them appear a day earlier. A full timestamp (with
   * time, like createdAt/updatedAt) is interpreted as-is.
   */
  private static parseLocalDate(iso: string): Date {
    if (this.DATE_ONLY_REGEX.test(iso)) {
      const [year, month, day] = iso.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date(iso)
  }

  /**
   * Today's date in local time, in `YYYY-MM-DD` format.
   * @returns Today's date.
   */
  static todayIso(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Year and month of an ISO date as `YYYY-MM`, e.g. `2026-08-12` → `2026-08`.
   * It slices the text without going through Date: this avoids a date-only
   * value being interpreted as UTC midnight and moving to another month in
   * timezones west of UTC.
   * @param iso - Date in `YYYY-MM-DD` format.
   * @returns The first 7 characters of the date.
   */
  static monthKey(iso: string): string {
    return iso.slice(0, 7)
  }

  /**
   * Formats an ISO date (`YYYY-MM-DD`) as a readable short date, e.g. `Aug 12, 2026`.
   * @param iso - Date to format, or `null` if it is not set.
   * @returns The formatted date, or `Not set` for `null`.
   */
  static format(iso: string | null): string {
    if (!iso) return 'Not set'
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(this.parseLocalDate(iso))
  }

  /**
   * Month label from an ISO date, e.g. `2026-08-12` → `Aug 2026`.
   * @param iso - Date to read the month from.
   * @returns The month label.
   */
  static formatMonthLabel(iso: string): string {
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(
      this.parseLocalDate(iso),
    )
  }

  /**
   * Formats an ISO timestamp as a readable date and time, e.g. `Aug 12, 2026, 3:45 PM`.
   * @param iso - Timestamp to format.
   * @returns The formatted date and time.
   */
  static formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso),
    )
  }
}
