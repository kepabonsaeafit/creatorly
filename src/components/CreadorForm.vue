<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import type { CreateCreadorDTO } from '@/dtos/CreateCreadorDTO'

interface Props {
  initial?: Partial<CreateCreadorDTO>
  modoEdicion?: boolean
  guardando?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  initial: () => ({}),
  modoEdicion: false,
  guardando: false,
  error: '',
})

const emit = defineEmits<{ submit: [datos: CreateCreadorDTO] }>()

// selectors
const nombre = ref(props.initial.nombre ?? '')
const nicho = ref(props.initial.nicho ?? '')
const tipoContenido = ref(props.initial.tipoContenido ?? '')
const tarifa = ref(props.initial.tarifa ?? 0)
const disponible = ref(props.initial.disponible ?? true)

// functions
function onSubmit(): void {
  emit('submit', {
    nombre: nombre.value.trim(),
    nicho: nicho.value.trim(),
    tipoContenido: tipoContenido.value.trim(),
    tarifa: Number(tarifa.value),
    disponible: disponible.value,
  })
}
</script>

<template>
  <form class="creador-form" @submit.prevent="onSubmit">
    <div class="creador-form__field">
      <label class="creador-form__label" for="nombre">Nombre</label>
      <input id="nombre" v-model="nombre" class="creador-form__input" type="text" required />
    </div>

    <div class="creador-form__field">
      <label class="creador-form__label" for="nicho">Nicho</label>
      <input
        id="nicho"
        v-model="nicho"
        class="creador-form__input"
        type="text"
        placeholder="belleza, gaming, moda…"
        required
      />
    </div>

    <div class="creador-form__field">
      <label class="creador-form__label" for="tipo-contenido">Tipo de contenido</label>
      <input
        id="tipo-contenido"
        v-model="tipoContenido"
        class="creador-form__input"
        type="text"
        placeholder="TikTok, YouTube, Instagram…"
        required
      />
    </div>

    <div class="creador-form__field">
      <label class="creador-form__label" for="tarifa">Tarifa</label>
      <input
        id="tarifa"
        v-model.number="tarifa"
        class="creador-form__input"
        type="number"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="creador-form__check">
      <input id="disponible" v-model="disponible" type="checkbox" />
      <label for="disponible">Disponible para nuevos pedidos</label>
    </div>

    <p v-if="error" class="creador-form__error">{{ error }}</p>

    <button class="creador-form__submit" type="submit" :disabled="guardando">
      {{ guardando ? 'Guardando…' : modoEdicion ? 'Guardar cambios' : 'Crear creador' }}
    </button>
  </form>
</template>

<style scoped>
.creador-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.creador-form__field {
  display: grid;
  gap: 0.35rem;
}

.creador-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.creador-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.creador-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.creador-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.creador-form__submit {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.creador-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
