// Author: Kevin Pabón

// external imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { StorageService } from '@/storage/StorageService'

/**
 * The only store left in the frontend (ADR-0005): it holds the session token
 * and the current user. It keeps no logic; AuthService reads and writes it.
 */
export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(StorageService.getToken())
  const currentUser = ref<UserInterface | null>(null)

  return { token, currentUser }
})
