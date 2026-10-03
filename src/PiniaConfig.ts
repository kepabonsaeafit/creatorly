// Author: Kevin Pabón

// external imports
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { watch } from 'vue'

// internal imports
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import type { OrderInterface } from '@/interfaces/OrderInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { seedBrands } from '@/seeders/BrandSeeder'
import { seedCreators } from '@/seeders/CreatorSeeder'
import { seedOrders } from '@/seeders/OrderSeeder'
import { seedUsers } from '@/seeders/UserSeeder'
import { type CollectionName, StorageService } from '@/storage/StorageService'
import { useBrandStore } from '@/stores/BrandStore'
import { useCreatorStore } from '@/stores/CreatorStore'
import { useOrderStore } from '@/stores/OrderStore'
import { useUserStore } from '@/stores/UserStore'

/** The four collections of a full seed, with id references already resolved. */
export interface SeedData {
  users: UserInterface[]
  creators: CreatorInterface[]
  brands: BrandInterface[]
  orders: OrderInterface[]
}

// Named generateSeed/persistSeed (not generate/persist) to avoid colliding
// with the generic hydrate<T>/persist<T> helpers below, which already used
// that name before this translation.
/** Generates the four collections; OrderSeeder receives the other three to reference them by id (ADR-0001). */
function generateSeed(): SeedData {
  const users = seedUsers()
  const creators = seedCreators()
  const brands = seedBrands()
  const orders = seedOrders(brands, creators, users)
  return { users, creators, brands, orders }
}

/** Writes the four collections to LocalStorage. */
function persistSeed(seedData: SeedData): void {
  StorageService.write('users', seedData.users)
  StorageService.write('creators', seedData.creators)
  StorageService.write('brands', seedData.brands)
  StorageService.write('orders', seedData.orders)
}

/** Seeds if the "database" is empty. */
function ensureSeeded(): void {
  if (!StorageService.hasData('users') && !StorageService.hasData('orders')) {
    persistSeed(generateSeed())
  }
}

/** Loads a collection store's initial state from LocalStorage. */
function hydrate<T>(items: Ref<T[]>, collection: CollectionName): void {
  items.value = StorageService.read<T>(collection)
}

/** Persists every change of the collection store to LocalStorage. */
function persist<T>(items: Ref<T[]>, collection: CollectionName): void {
  watch(items, (value) => StorageService.write(collection, value), { deep: true })
}

/**
 * Clears LocalStorage and seeds again. Writes to the stores in addition to
 * LocalStorage so it does not depend on the `persist` watcher having a
 * chance to run. The caller must log out: seeding generates new users,
 * so the previous session's id stops existing.
 */
export function resetDemoData(): void {
  StorageService.clearAll()
  const seedData = generateSeed()
  persistSeed(seedData)
  useUserStore().users = seedData.users
  useCreatorStore().creators = seedData.creators
  useBrandStore().brands = seedData.brands
  useOrderStore().orders = seedData.orders
}

/**
 * Hydrates the collection stores from LocalStorage (seeding first if
 * empty) and wires each one's automatic persistence.
 */
export function initPinia(): void {
  ensureSeeded()

  const { users } = storeToRefs(useUserStore())
  const { creators } = storeToRefs(useCreatorStore())
  const { brands } = storeToRefs(useBrandStore())
  const { orders } = storeToRefs(useOrderStore())

  hydrate(users, 'users')
  hydrate(creators, 'creators')
  hydrate(brands, 'brands')
  hydrate(orders, 'orders')

  persist(users, 'users')
  persist(creators, 'creators')
  persist(brands, 'brands')
  persist(orders, 'orders')
}
