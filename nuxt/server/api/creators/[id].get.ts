// Author: Felipe Gómez

// external imports
import type { H3Event } from 'h3'

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CreatorService } from '../../services/CreatorService'

export default defineEventHandler((event: H3Event): CreatorInterface => {
  const id = Number(getRouterParam(event, 'id'))

  return CreatorService.findOne(id)
})
