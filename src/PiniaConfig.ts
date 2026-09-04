// Kevin Pabón

// external imports
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { watch } from 'vue'

// internal imports
import { seedCreadores } from '@/seeders/CreadorSeeder'
import { seedMarcas } from '@/seeders/MarcaSeeder'
import { seedPedidos } from '@/seeders/PedidoSeeder'
import { seedUsers } from '@/seeders/UserSeeder'
import type { CollectionName } from '@/services/StorageService'
import { StorageService } from '@/services/StorageService'
import { useCreadorStore } from '@/stores/CreadorStore'
import { useMarcaStore } from '@/stores/MarcaStore'
import { usePedidoStore } from '@/stores/PedidoStore'
import { useUserStore } from '@/stores/UserStore'

/**
 * Siembra si la "base de datos" está vacía. Calco del guard de
 * services/seed.js (hasData('users') || hasData('pedidos')) invertido
 * para usarse como condición de entrada en vez de salida.
 */
function ensureSeeded(): void {
  if (!StorageService.hasData('users') && !StorageService.hasData('pedidos')) {
    const users = seedUsers()
    const creadores = seedCreadores()
    const marcas = seedMarcas()
    const pedidos = seedPedidos(marcas, creadores, users)
    StorageService.write('users', users)
    StorageService.write('creadores', creadores)
    StorageService.write('marcas', marcas)
    StorageService.write('pedidos', pedidos)
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
