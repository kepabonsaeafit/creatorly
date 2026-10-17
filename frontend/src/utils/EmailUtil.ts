// Author: Kevin Pabón

export class EmailUtil {
  /**
   * Normalizes an email to its canonical form: trimmed and lowercase.
   * @param email - Email as typed by the user.
   * @returns The normalized email.
   */
  static normalize(email: string): string {
    return String(email ?? '')
      .trim()
      .toLowerCase()
  }
}
