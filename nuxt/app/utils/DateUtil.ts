// Author: Felipe Gómez

export class DateUtil {
  private static readonly DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

  /**
   * Interprets a date in local time. Date-only values (`YYYY-MM-DD`) carry no
   * time: `new Date('YYYY-MM-DD')` interprets them as UTC midnight, and showing
   * them in local time (e.g. Bogotá, UTC-5) makes them appear a day earlier.
   */
  private static parseLocalDate(iso: string): Date {
    if (this.DATE_ONLY_REGEX.test(iso)) {
      const year = Number(iso.slice(0, 4))
      const month = Number(iso.slice(5, 7))
      const day = Number(iso.slice(8, 10))
      return new Date(year, month - 1, day)
    }
    return new Date(iso)
  }

  /**
   * Formats an ISO date (`YYYY-MM-DD`) as a readable short date, e.g. `Oct 6, 2026`.
   * @param iso - Date to format.
   * @returns The formatted date.
   */
  static format(iso: string): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(this.parseLocalDate(iso))
  }
}
