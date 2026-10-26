// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CreatorService } from '../../services/CreatorService'

export default defineEventHandler((): CreatorInterface[] => {
  return CreatorService.findAll()
})
