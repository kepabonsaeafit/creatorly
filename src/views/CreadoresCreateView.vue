<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import CreadorForm from '@/components/CreadorForm.vue'
import type { CreateCreadorDTO } from '@/dtos/CreateCreadorDTO'
import { CreadorService } from '@/services/CreadorService'

const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// functions
function onSubmit(datos: CreateCreadorDTO): void {
  error.value = ''
  guardando.value = true
  try {
    CreadorService.create(datos)
    toast.success('Creador creado correctamente')
    router.push({ name: 'creadores' })
  } catch (excepcion) {
    error.value = excepcion instanceof Error ? excepcion.message : 'No fue posible crear el creador'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>Nuevo creador</h1>
    <CreadorForm :guardando="guardando" :error="error" @submit="onSubmit" />
  </main>
</template>
