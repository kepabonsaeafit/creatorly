// Gerónimo Montes

/**
 * Único punto donde se llama a los cuatro seeders. `PiniaConfig` lo usa para la
 * siembra del primer arranque y el botón de "restablecer datos demo" lo usa para
 * volver al estado inicial, de modo que ambos caminos siembran exactamente igual.
 */

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { PedidoInterface } from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { seedCreadores } from '@/seeders/CreadorSeeder'
import { seedMarcas } from '@/seeders/MarcaSeeder'
import { seedPedidos } from '@/seeders/PedidoSeeder'
import { seedUsers } from '@/seeders/UserSeeder'
import { AuthService } from '@/services/AuthService'
import { StorageService } from '@/services/StorageService'
import { useCreadorStore } from '@/stores/CreadorStore'
import { useMarcaStore } from '@/stores/MarcaStore'
import { usePedidoStore } from '@/stores/PedidoStore'
import { useUserStore } from '@/stores/UserStore'

/** Las cuatro colecciones de una siembra completa, con las referencias por id ya resueltas. */
export interface DatosSiembra {
  users: UserInterface[]
  creadores: CreadorInterface[]
  marcas: MarcaInterface[]
  pedidos: PedidoInterface[]
}

export class DemoDataService {
  /** Genera las cuatro colecciones; PedidoSeeder recibe las otras tres para referenciarlas por id (ADR-0001). */
  static generar(): DatosSiembra {
    const users = seedUsers()
    const creadores = seedCreadores()
    const marcas = seedMarcas()
    const pedidos = seedPedidos(marcas, creadores, users)
    return { users, creadores, marcas, pedidos }
  }

  /** Escribe las cuatro colecciones en LocalStorage. */
  static persistir(datos: DatosSiembra): void {
    StorageService.write('users', datos.users)
    StorageService.write('creadores', datos.creadores)
    StorageService.write('marcas', datos.marcas)
    StorageService.write('pedidos', datos.pedidos)
  }

  /**
   * Limpia LocalStorage y vuelve a sembrar. Escribe en los stores además de en
   * LocalStorage para no depender de que el watcher de `PiniaConfig.persist`
   * alcance a correr, y cierra la sesión porque la siembra genera users nuevos:
   * el id de la sesión anterior ya no existe.
   */
  static reset(): void {
    StorageService.clearAll()
    const datos = this.generar()
    this.persistir(datos)
    useUserStore().users = datos.users
    useCreadorStore().creadores = datos.creadores
    useMarcaStore().marcas = datos.marcas
    usePedidoStore().pedidos = datos.pedidos
    AuthService.logout()
  }
}
