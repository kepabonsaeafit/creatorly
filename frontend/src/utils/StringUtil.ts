// Author: Kevin Pabón

export class StringUtil {
  /**
   * Case-insensitive search of a text inside another, ignoring the spaces
   * around the search. An empty search matches everything.
   * @param text - Text to look into.
   * @param search - Text to look for.
   * @returns `true` if the search is empty or `text` contains it.
   */
  static contains(text: string, search: string): boolean {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) return true

    return text.toLowerCase().includes(normalizedSearch)
  }

  /**
   * Uppercases the first letter of a text and leaves the rest unchanged.
   * @param text - Text to capitalize.
   * @returns The text with its first letter in uppercase (an empty text stays empty).
   */
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
