// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { creators } from '../../data/CreatorData'

export default defineEventHandler((): CreatorInterface[] => creators)
