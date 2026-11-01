// Author: Felipe Gómez

// external imports
import type { H3Event } from 'h3'

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CREATORS } from '../../data/CreatorData'

export default defineEventHandler((event: H3Event): CreatorInterface => {
  const id = Number(getRouterParam(event, 'id'))
  const creator = CREATORS.find((candidate: CreatorInterface): boolean => candidate.id === id)
  if (!creator) {
    throw createError({ statusCode: 404, statusMessage: 'Creator: not found' })
  }

  return creator
})
