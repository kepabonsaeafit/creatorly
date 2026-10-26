// Author: Gerónimo Montes

/**
 * A blog article about running a UGC creator agency. The id is a string
 * because it comes from the route param and is never converted.
 */
export interface ArticleInterface {
  id: string
  title: string
  summary: string
  author: string
  date: string
  readingMinutes: number
  paragraphs: string[]
}
