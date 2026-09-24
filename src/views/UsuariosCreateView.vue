<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// internal imports
import UsuarioForm from '@/components/UsuarioForm.vue'
import type { CreateUserDTO } from '@/dtos/CreateUserDTO'
import { UserService } from '@/services/UserService'

const router = useRouter()
const toast = useToast()

// selectors
const error = ref('')
const guardando = ref(false)

// functions
function onSubmit(datos: CreateUserDTO): void {
  error.value = ''
  guardando.value = true
  try {
    UserService.create(datos)
    toast.success('Usuario creado correctamente')
    router.push({ name: 'usuarios' })
  } catch (excepcion) {
    error.value = excepcion instanceof Error ? excepcion.message : 'No fue posible crear el usuario'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <main class="Panel">
    <h1>Nuevo usuario</h1>
    <UsuarioForm :guardando="guardando" :error="error" @submit="onSubmit" />
  </main>
</template>
