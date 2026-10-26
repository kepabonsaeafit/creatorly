// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CreatorService } from '../../services/CreatorService'

export default defineEventHandler((event): CreatorInterface => {
  const id = Number(getRouterParam(event, 'id'))

  return CreatorService.findOne(id)
})
