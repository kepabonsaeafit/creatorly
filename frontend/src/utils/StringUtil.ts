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
}
