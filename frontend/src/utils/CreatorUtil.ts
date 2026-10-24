// Author: Kevin Pabón

// internal imports
import type { CreatorFilterDTO } from '@/dtos/Creators/CreatorFilterDTO'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import { StringUtil } from '@/utils/StringUtil'

export class CreatorUtil {
  /**
   * Applies a CreatorFilterDTO over a list of creators already fetched from
   * the API and sorts the result by name. The niche is compared ignoring case
   * and the spaces around it. Used by CreatorsIndexView.
   * @param creators - Creators to filter.
   * @param filter - Filter criteria.
   * @returns The filtered, name-sorted creators.
   */
  static filter(creators: CreatorInterface[], filter: CreatorFilterDTO): CreatorInterface[] {
    const wantedNiche = filter.niche ? this.normalizeNiche(filter.niche) : ''

    return creators
      .filter((creator: CreatorInterface): boolean => {
        if (wantedNiche && this.normalizeNiche(creator.niche) !== wantedNiche) return false
        if (filter.available !== undefined && creator.available !== filter.available) return false
        if (filter.text && !StringUtil.contains(creator.name, filter.text)) return false

        return true
      })
      .sort((first: CreatorInterface, second: CreatorInterface): number =>
        first.name.localeCompare(second.name),
      )
  }

  /**
   * Distinct niches present in a list of creators, sorted, to populate the filter.
   * Niches are trimmed and lowercased before comparing, so rows saved with a
   * different case count as one niche.
   * @param creators - Creators to read the niches from.
   * @returns The sorted list of distinct niches, in lowercase.
   */
  static getNiches(creators: CreatorInterface[]): string[] {
    const uniqueNiches = new Set(
      creators.map((creator: CreatorInterface): string => this.normalizeNiche(creator.niche)),
    )

    return [...uniqueNiches].sort((first: string, second: string): number =>
      first.localeCompare(second),
    )
  }

  /**
   * Niche written in the form used to compare and group niches.
   * @param niche - Niche as stored or typed.
   * @returns The niche trimmed and in lowercase.
   */
  private static normalizeNiche(niche: string): string {
    return niche.trim().toLowerCase()
  }
}
