// Author: Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'
import { StorageService } from '@/storage/StorageService'

export const useSessionStore = defineStore('session', () => {
  const userId = ref<string | null>(StorageService.getSession()?.userId ?? null)

  const current = computed<UserInterface | undefined>(() =>
    userId.value ? UserService.getById(userId.value) : undefined,
  )

  const isLoggedIn = computed<boolean>(() => current.value !== undefined)

  // Inline, not delegated to an AuthService helper: AuthService already
  // imports this store for login/logout, so delegating here would create an
  // import cycle SessionStore -> AuthService -> SessionStore.
  const isAdmin = computed<boolean>(() => current.value?.role === 'admin')

  return { userId, current, isLoggedIn, isAdmin }
})
