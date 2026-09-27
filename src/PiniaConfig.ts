// Kevin Pabón

// external imports
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { watch } from 'vue'

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import type { OrderInterface } from '@/interfaces/OrderInterface'
import type { CollectionName } from '@/interfaces/StorageInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { seedBrands } from '@/seeders/BrandSeeder'
import { seedCreators } from '@/seeders/CreatorSeeder'
import { seedOrders } from '@/seeders/OrderSeeder'
import { seedUsers } from '@/seeders/UserSeeder'
import { StorageService } from '@/storage/StorageService'
import { useBrandStore } from '@/stores/BrandStore'
import { useCreatorStore } from '@/stores/CreatorStore'
import { useOrderStore } from '@/stores/OrderStore'
import { useUserStore } from '@/stores/UserStore'

/** Las cuatro colecciones de una siembra completa, con las referencias por id ya resueltas. */
export interface SeedData {
  users: UserInterface[]
  creators: CreatorInterface[]
  brands: BrandInterface[]
  orders: OrderInterface[]
}

// Se llaman generateSeed/persistSeed (no generate/persist) para no colisionar
// con los helpers genéricos hydrate<T>/persist<T> de más abajo, que ya usaban
// ese nombre antes de esta traducción.
/** Genera las cuatro colecciones; OrderSeeder recibe las otras tres para referenciarlas por id (ADR-0001). */
function generateSeed(): SeedData {
  const users = seedUsers()
  const creators = seedCreators()
  const brands = seedBrands()
  const orders = seedOrders(brands, creators, users)
  return { users, creators, brands, orders }
}

/** Escribe las cuatro colecciones en LocalStorage. */
function persistSeed(datos: SeedData): void {
  StorageService.write('users', datos.users)
  StorageService.write('creadores', datos.creators)
  StorageService.write('marcas', datos.brands)
  StorageService.write('pedidos', datos.orders)
}

/** Siembra si la "base de datos" está vacía. */
function ensureSeeded(): void {
  if (!StorageService.hasData('users') && !StorageService.hasData('pedidos')) {
    persistSeed(generateSeed())
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
  const datos = generateSeed()
  persistSeed(datos)
  useUserStore().users = datos.users
  useCreatorStore().creators = datos.creators
  useBrandStore().brands = datos.brands
  useOrderStore().orders = datos.orders
}

/**
 * Hidrata los stores de colección desde LocalStorage (sembrando antes si
 * está vacío) y conecta la persistencia automática de cada uno.
 */
export function initPinia(): void {
  ensureSeeded()

  const { users } = storeToRefs(useUserStore())
  const { creators } = storeToRefs(useCreatorStore())
  const { brands } = storeToRefs(useBrandStore())
  const { orders } = storeToRefs(useOrderStore())

  hydrate(users, 'users')
  hydrate(creators, 'creadores')
  hydrate(brands, 'marcas')
  hydrate(orders, 'pedidos')

  persist(users, 'users')
  persist(creators, 'creadores')
  persist(brands, 'marcas')
  persist(orders, 'pedidos')
}
