// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CREATORS } from '../../data/CreatorData'

export default defineEventHandler((): CreatorInterface[] => CREATORS)
