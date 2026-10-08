// Author: Kevin Pabón

// external imports
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

// internal imports
import { AuthService } from '@/services/AuthService'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    admin?: boolean
  }
}

/**
 * Same 3 branches as before, now asynchronous: after a reload the session
 * only exists as a token in LocalStorage, so the guard asks AuthService to
 * restore it (GET /api/auth/profile) before deciding.
 * @param to - Route being navigated to.
 * @returns `true` to allow, or the route to redirect to.
 */
export async function accessControlGuard(
  to: RouteLocationNormalized,
): Promise<boolean | RouteLocationRaw> {
  const isLoggedIn = await AuthService.restoreSession()

  if (to.meta.public) {
    return isLoggedIn ? { name: 'home' } : true
  }
  if (!isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.admin && !AuthService.isAdmin()) {
    return { name: 'home' }
  }

  return true
}
