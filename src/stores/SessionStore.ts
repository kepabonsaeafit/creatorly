// Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { StorageService } from '@/services/StorageService'
import { UserService } from '@/services/UserService'

export const useSessionStore = defineStore('session', () => {
  const userId = ref<string | null>(StorageService.getSession()?.userId ?? null)

  const current = computed<UserInterface | undefined>(() =>
    userId.value ? UserService.getById(userId.value) : undefined,
  )

  const isLoggedIn = computed<boolean>(() => current.value !== undefined)

  // Inline, no delegado a un helper de AuthService: AuthService ya importa
  // este store para login/logout, así que delegar aquí crearía un ciclo de
  // imports SessionStore -> AuthService -> SessionStore.
  const isAdmin = computed<boolean>(() => current.value?.rol === 'admin')

  return { userId, current, isLoggedIn, isAdmin }
})
