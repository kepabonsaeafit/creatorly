// Author: Kevin Pabón

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Checks an email's format. Used by the User and Brand validations. */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/** Normalizes an email to its canonical form: trimmed and lowercase. */
export function normalizeEmail(email: string): string {
  return String(email ?? '')
    .trim()
    .toLowerCase()
}
