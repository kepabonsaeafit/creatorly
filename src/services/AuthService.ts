// Kevin Pabón

/**
 * AuthService no sigue el patrón `throw new Error(...)` del resto de services
 * (UserService, CreatorService, BrandService, OrderService). login() devuelve
 * { ok, error } porque "credenciales inválidas" no es un dato malformado del
 * programador (como un presupuesto negativo) sino una respuesta legítima y
 * esperada de un formulario de login: la view necesita mostrar el error sin
 * un try/catch. Las validaciones de forma de los otros services SÍ
 * lanzan, porque ahí un dato inválido es un error de programación (DTO mal
 * construido), no una interacción normal del usuario.
 */

// internal imports
import type { LoginDTO } from '@/dtos/LoginDTO'
import type { LoginResult } from '@/interfaces/LoginResultInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'
import { StorageService } from '@/storage/StorageService'
import { useSessionStore } from '@/stores/SessionStore'

export class AuthService {
  static login(credentials: LoginDTO): LoginResult {
    const user = UserService.findByCredentials(credentials)
    if (!user) return { ok: false, error: 'Invalid credentials' }
    useSessionStore().userId = user.id
    StorageService.setSession(user.id)
    return { ok: true }
  }

  static logout(): void {
    useSessionStore().userId = null
    StorageService.clearSession()
  }

  static getCurrentUser(): UserInterface | undefined {
    return useSessionStore().current
  }

  /** Rol del usuario de la sesión activa; usado por NavBar para decidir qué links mostrar. */
  static isAdmin(): boolean {
    return useSessionStore().isAdmin
  }
}
