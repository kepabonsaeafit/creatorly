<script setup lang="ts">
// Gerónimo Montes

// external imports
import { computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'

// internal imports
import CreadoresTable from '@/components/CreadoresTable.vue'
import type { CreadorFiltroDTO } from '@/dtos/CreadorFiltroDTO'
import { CreadorService } from '@/services/CreadorService'

const toast = useToast()

// selectors
const filtro = reactive<CreadorFiltroDTO>({ nicho: undefined, disponible: undefined, texto: '' })

// computed variables
const nichos = computed(() => CreadorService.getNichos())

const creadores = computed(() => {
  const todos = CreadorService.getAll()
  return CreadorService.filtrar(todos, filtro).sort((primero, segundo) =>
    primero.nombre.localeCompare(segundo.nombre),
  )
})

// functions
function onEliminar(id: string): void {
  const eliminado = CreadorService.remove(id)
  if (eliminado) {
    toast.success('Creador eliminado correctamente')
  } else {
    toast.error('No fue posible eliminar el creador')
  }
}

function limpiarFiltros(): void {
  filtro.nicho = undefined
  filtro.disponible = undefined
  filtro.texto = ''
}
</script>

<template>
  <main class="Panel creadores">
    <div class="creadores__header">
      <h1>Creadores</h1>
      <RouterLink class="creadores__crear" :to="{ name: 'creadores.create' }">
        Nuevo creador
      </RouterLink>
    </div>

    <div class="creadores__filtros">
      <input
        v-model="filtro.texto"
        class="creadores__filtro-input"
        type="search"
        placeholder="Buscar por nombre…"
      />

      <select v-model="filtro.nicho" class="creadores__filtro-input">
        <option :value="undefined">Todos los nichos</option>
        <option v-for="opcion in nichos" :key="opcion" :value="opcion">{{ opcion }}</option>
      </select>

      <select v-model="filtro.disponible" class="creadores__filtro-input">
        <option :value="undefined">Toda disponibilidad</option>
        <option :value="true">Disponibles</option>
        <option :value="false">No disponibles</option>
      </select>

      <button type="button" class="creadores__limpiar" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </div>

    <CreadoresTable :creadores="creadores" accionable @eliminar="onEliminar" />
  </main>
</template>

<style scoped>
.creadores__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.creadores__crear {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
}

.creadores__filtros {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.creadores__filtro-input {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.creadores__limpiar {
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
</style>
