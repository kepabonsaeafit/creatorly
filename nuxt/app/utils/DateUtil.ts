// Author: Felipe Gómez

export class DateUtil {
  // a YYYY-MM-DD date is read as UTC midnight, so it is also shown in UTC;
  // otherwise Bogotá (UTC-5) would show it one day earlier
  private static readonly FORMATTER = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  })

  static format(iso: string): string {
    return DateUtil.FORMATTER.format(new Date(iso))
  }
}
