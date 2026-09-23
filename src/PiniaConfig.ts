// Kevin Pabón

// external imports
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { watch } from 'vue'

// internal imports
import type { CreadorInterface } from '@/interfaces/CreadorInterface'
import type { MarcaInterface } from '@/interfaces/MarcaInterface'
import type { PedidoInterface } from '@/interfaces/PedidoInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { seedCreadores } from '@/seeders/CreadorSeeder'
import { seedMarcas } from '@/seeders/MarcaSeeder'
import { seedPedidos } from '@/seeders/PedidoSeeder'
import { seedUsers } from '@/seeders/UserSeeder'
import type { CollectionName } from '@/storage/StorageService'
import { StorageService } from '@/storage/StorageService'
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

/** Genera las cuatro colecciones; PedidoSeeder recibe las otras tres para referenciarlas por id (ADR-0001). */
function generar(): DatosSiembra {
  const users = seedUsers()
  const creadores = seedCreadores()
  const marcas = seedMarcas()
  const pedidos = seedPedidos(marcas, creadores, users)
  return { users, creadores, marcas, pedidos }
}

/** Escribe las cuatro colecciones en LocalStorage. */
function persistir(datos: DatosSiembra): void {
  StorageService.write('users', datos.users)
  StorageService.write('creadores', datos.creadores)
  StorageService.write('marcas', datos.marcas)
  StorageService.write('pedidos', datos.pedidos)
}

/** Siembra si la "base de datos" está vacía. */
function ensureSeeded(): void {
  if (!StorageService.hasData('users') && !StorageService.hasData('pedidos')) {
    persistir(generar())
  }
}

/** Carga el estado inicial de un store de colección desde LocalStorage. */
function hydrate<T>(items: Ref<T[]>, collection: CollectionName): void {
  items.value = StorageService.read<T>(collection)
}

/** Persiste cada cambio del store de colección en LocalStorage. */
function persist<T>(items: Ref<T[]>, collection: CollectionName): void {
  watch(items, (value) => StorageService.write(collection, value), { deep: true })
}

/**
 * Limpia LocalStorage y vuelve a sembrar. Escribe en los stores además de en
 * LocalStorage para no depender de que el watcher de `persist` alcance a
 * correr. Quien la llama debe cerrar la sesión: la siembra genera users
 * nuevos, así que el id de la sesión anterior deja de existir.
 */
export function resetDemoData(): void {
  StorageService.clearAll()
  const datos = generar()
  persistir(datos)
  useUserStore().users = datos.users
  useCreadorStore().creadores = datos.creadores
  useMarcaStore().marcas = datos.marcas
  usePedidoStore().pedidos = datos.pedidos
}

/**
 * Hidrata los stores de colección desde LocalStorage (sembrando antes si
 * está vacío) y conecta la persistencia automática de cada uno.
 */
export function initPinia(): void {
  ensureSeeded()

  const { users } = storeToRefs(useUserStore())
  const { creadores } = storeToRefs(useCreadorStore())
  const { marcas } = storeToRefs(useMarcaStore())
  const { pedidos } = storeToRefs(usePedidoStore())

  hydrate(users, 'users')
  hydrate(creadores, 'creadores')
  hydrate(marcas, 'marcas')
  hydrate(pedidos, 'pedidos')

  persist(users, 'users')
  persist(creadores, 'creadores')
  persist(marcas, 'marcas')
  persist(pedidos, 'pedidos')
}
