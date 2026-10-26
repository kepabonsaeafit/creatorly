// Author: Kevin Pabón

// internal imports
import type { ArticleInterface } from '~/interfaces/ArticleInterface'

export class ArticleUtil {
  /**
   * Finds a blog article by its id. Used by the article page, both to reject
   * unknown ids and to show the article.
   * @param articles - Articles to look into.
   * @param id - Id taken from the route.
   * @returns The article, or `undefined` if no article has that id.
   */
  static findById(articles: ArticleInterface[], id: string): ArticleInterface | undefined {
    return articles.find((article: ArticleInterface): boolean => article.id === id)
  }
}
