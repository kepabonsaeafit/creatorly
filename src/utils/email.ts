// Kevin Pabón

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Verifica el formato de un email. Usado por las validaciones de User y Marca. */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/** Normaliza un email a su forma canónica: sin espacios y en minúsculas. */
export function normalizeEmail(email: string): string {
  return String(email ?? '')
    .trim()
    .toLowerCase()
}
