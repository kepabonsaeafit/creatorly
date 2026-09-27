<script setup lang="ts">
// Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import type { CreateCreatorDTO } from '@/dtos/CreateCreatorDTO'

interface Props {
  initial?: Partial<CreateCreatorDTO>
  editMode?: boolean
  saving?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  initial: () => ({}),
  editMode: false,
  saving: false,
  error: '',
})

const emit = defineEmits<{ submit: [creatorData: CreateCreatorDTO] }>()

// state
const name = ref(props.initial.name ?? '')
const niche = ref(props.initial.niche ?? '')
const contentType = ref(props.initial.contentType ?? '')
const rate = ref(props.initial.rate ?? 0)
const available = ref(props.initial.available ?? true)

// functions
function onSubmit(): void {
  emit('submit', {
    name: name.value.trim(),
    niche: niche.value.trim(),
    contentType: contentType.value.trim(),
    rate: Number(rate.value),
    available: available.value,
  })
}
</script>

<template>
  <form class="creador-form" @submit.prevent="onSubmit">
    <div class="creador-form__field">
      <label class="creador-form__label" for="nombre">Nombre</label>
      <input id="nombre" v-model="name" class="creador-form__input" type="text" required />
    </div>

    <div class="creador-form__field">
      <label class="creador-form__label" for="nicho">Nicho</label>
      <input
        id="nicho"
        v-model="niche"
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
        v-model="contentType"
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
        v-model.number="rate"
        class="creador-form__input"
        type="number"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="creador-form__check">
      <input id="disponible" v-model="available" type="checkbox" />
      <label for="disponible">Disponible para nuevos pedidos</label>
    </div>

    <p v-if="error" class="creador-form__error">{{ error }}</p>

    <button class="creador-form__submit" type="submit" :disabled="saving">
      {{ saving ? 'Guardando…' : editMode ? 'Guardar cambios' : 'Crear creador' }}
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
  color: var(--brand-white);
  font-weight: 600;
  cursor: pointer;
}

.creador-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
