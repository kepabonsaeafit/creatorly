<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, ref } from 'vue'

// internal imports
import type { CreateOrderDTO } from '@/dtos/CreateOrderDTO'
import type { OrderStatus } from '@/interfaces/OrderInterface'
import { BrandService } from '@/services/BrandService'
import { CreatorService } from '@/services/CreatorService'
import { UserService } from '@/services/UserService'
import { todayIso } from '@/utils/formatDate'
import { STATUS_LABELS, toSelectOptions } from '@/utils/labels'

interface Props {
  initial?: Partial<CreateOrderDTO>
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

const emit = defineEmits<{ submit: [orderData: CreateOrderDTO] }>()

// selectors
const brandId = ref(props.initial.brandId ?? '')
const creatorId = ref(props.initial.creatorId ?? '')
const userId = ref(props.initial.userId ?? '')
const status = ref<OrderStatus>(props.initial.status ?? 'requested')

// state
const description = ref(props.initial.description ?? '')
const budget = ref(props.initial.budget ?? 0)
const requestDate = ref(props.initial.requestDate ?? todayIso())
const deliveryDate = ref(props.initial.deliveryDate ?? '')

// computed variables
const brands = computed(() => BrandService.getAll())
const creators = computed(() => CreatorService.getAll())
const coordinators = computed(() => UserService.getCoordinators())
const statusOptions = computed(() => toSelectOptions(STATUS_LABELS))

// functions
function onSubmit(): void {
  emit('submit', {
    description: description.value.trim(),
    budget: Number(budget.value),
    brandId: brandId.value,
    creatorId: creatorId.value || null,
    userId: userId.value,
    requestDate: requestDate.value,
    deliveryDate: deliveryDate.value || null,
    status: status.value,
  })
}
</script>

<template>
  <form class="order-form" @submit.prevent="onSubmit">
    <div class="order-form__field">
      <label class="order-form__label" for="description">Descripción</label>
      <input
        id="description"
        v-model="description"
        class="order-form__input"
        type="text"
        required
      />
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="budget">Presupuesto</label>
      <input
        id="budget"
        v-model.number="budget"
        class="order-form__input"
        type="number"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="brand">Marca</label>
      <select id="brand" v-model="brandId" class="order-form__input" required>
        <option value="" disabled>Selecciona una marca</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="creator">Creador</label>
      <select id="creator" v-model="creatorId" class="order-form__input">
        <option value="">Sin asignar</option>
        <option v-for="creator in creators" :key="creator.id" :value="creator.id">
          {{ creator.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="coordinator">Coordinador</label>
      <select id="coordinator" v-model="userId" class="order-form__input" required>
        <option value="" disabled>Selecciona un coordinador</option>
        <option v-for="coordinator in coordinators" :key="coordinator.id" :value="coordinator.id">
          {{ coordinator.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="request-date">Fecha de solicitud</label>
      <input
        id="request-date"
        v-model="requestDate"
        class="order-form__input"
        type="date"
        required
      />
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="delivery-date">Fecha de entrega</label>
      <input id="delivery-date" v-model="deliveryDate" class="order-form__input" type="date" />
    </div>

    <div v-if="editMode" class="order-form__field">
      <label class="order-form__label" for="status">Estado</label>
      <select id="status" v-model="status" class="order-form__input">
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <p v-if="error" class="order-form__error">{{ error }}</p>

    <button class="order-form__submit" type="submit" :disabled="saving">
      {{ saving ? 'Guardando…' : editMode ? 'Guardar cambios' : 'Crear pedido' }}
    </button>
  </form>
</template>

<style scoped>
.order-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.order-form__field {
  display: grid;
  gap: 0.35rem;
}

.order-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.order-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.order-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.order-form__submit {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--brand-white);
  font-weight: 600;
  cursor: pointer;
}

.order-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
