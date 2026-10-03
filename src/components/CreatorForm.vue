<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import type { CreateCreatorDTO } from '@/dtos/Creators/CreateCreatorDTO'

// props
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

// emits
const emit = defineEmits<{ submit: [creatorData: CreateCreatorDTO] }>()

// reactive variables
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
  <form class="creator-form" @submit.prevent="onSubmit">
    <div class="creator-form__field">
      <label class="creator-form__label" for="name">Name</label>
      <input id="name" v-model="name" class="creator-form__input" type="text" required />
    </div>

    <div class="creator-form__field">
      <label class="creator-form__label" for="niche">Niche</label>
      <input
        id="niche"
        v-model="niche"
        class="creator-form__input"
        type="text"
        placeholder="beauty, gaming, fashion…"
        required
      />
    </div>

    <div class="creator-form__field">
      <label class="creator-form__label" for="content-type">Content type</label>
      <input
        id="content-type"
        v-model="contentType"
        class="creator-form__input"
        type="text"
        placeholder="TikTok, YouTube, Instagram…"
        required
      />
    </div>

    <div class="creator-form__field">
      <label class="creator-form__label" for="rate">Rate</label>
      <input
        id="rate"
        v-model.number="rate"
        class="creator-form__input"
        type="number"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="creator-form__check">
      <input id="available" v-model="available" type="checkbox" />
      <label for="available">Available for new orders</label>
    </div>

    <p v-if="error" class="creator-form__error">{{ error }}</p>

    <button class="creator-form__submit" type="submit" :disabled="saving">
      {{ saving ? 'Saving…' : editMode ? 'Save changes' : 'Create creator' }}
    </button>
  </form>
</template>

<style scoped>
.creator-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.creator-form__field {
  display: grid;
  gap: 0.35rem;
}

.creator-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.creator-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.creator-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
}

.creator-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.creator-form__submit {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
  cursor: pointer;
}

.creator-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
