<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { computed, ref } from 'vue'

// internal imports
import type { CreateOrderDTO } from '@/dtos/Orders/CreateOrderDTO'
import type { BrandInterface } from '@/interfaces/BrandInterface'
import type { CreatorInterface } from '@/interfaces/CreatorInterface'
import type { OrderStatus } from '@/interfaces/OrderInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { UserService } from '@/services/UserService'
import { todayIso } from '@/utils/formatDate'
import { STATUS_LABELS, toSelectOptions } from '@/utils/labels'

// props
interface Props {
  initial?: Partial<CreateOrderDTO>
  /** Catalogs already fetched from the API by the view that renders the form. */
  brands: BrandInterface[]
  creators: CreatorInterface[]
  users: UserInterface[]
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
const emit = defineEmits<{ submit: [orderData: CreateOrderDTO] }>()

// selectors
const brandId = ref<number | null>(props.initial.brandId ?? null)
const creatorId = ref<number | null>(props.initial.creatorId ?? null)
const userId = ref<number | null>(props.initial.userId ?? null)
const status = ref<OrderStatus>(props.initial.status ?? 'requested')

// reactive variables
const description = ref(props.initial.description ?? '')
const budget = ref(props.initial.budget ?? 0)
const requestDate = ref(props.initial.requestDate ?? todayIso())
const deliveryDate = ref(props.initial.deliveryDate ?? '')

// computed variables
const coordinators = computed(() => UserService.getCoordinators(props.users))
const statusOptions = computed(() => toSelectOptions(STATUS_LABELS))

// functions
function onSubmit(): void {
  // Both selects are required, so the browser blocks the submit before this;
  // the guard is what narrows the type from 'number | null' to 'number'.
  if (brandId.value === null || userId.value === null) return

  emit('submit', {
    description: description.value.trim(),
    budget: Number(budget.value),
    brandId: brandId.value,
    creatorId: creatorId.value,
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
      <label class="order-form__label" for="description">Description</label>
      <input
        id="description"
        v-model="description"
        class="order-form__input"
        type="text"
        required
      />
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="budget">Budget</label>
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
      <label class="order-form__label" for="brand">Brand</label>
      <select id="brand" v-model="brandId" class="order-form__input" required>
        <option :value="null" disabled>Select a brand</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="creator">Creator</label>
      <select id="creator" v-model="creatorId" class="order-form__input">
        <option :value="null">Unassigned</option>
        <option v-for="creator in creators" :key="creator.id" :value="creator.id">
          {{ creator.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="coordinator">Coordinator</label>
      <select id="coordinator" v-model="userId" class="order-form__input" required>
        <option :value="null" disabled>Select a coordinator</option>
        <option v-for="coordinator in coordinators" :key="coordinator.id" :value="coordinator.id">
          {{ coordinator.name }}
        </option>
      </select>
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="request-date">Request date</label>
      <input
        id="request-date"
        v-model="requestDate"
        class="order-form__input"
        type="date"
        required
      />
    </div>

    <div class="order-form__field">
      <label class="order-form__label" for="delivery-date">Delivery date</label>
      <input id="delivery-date" v-model="deliveryDate" class="order-form__input" type="date" />
    </div>

    <div v-if="editMode" class="order-form__field">
      <label class="order-form__label" for="status">Status</label>
      <select id="status" v-model="status" class="order-form__input">
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <p v-if="error" class="order-form__error">{{ error }}</p>

    <button class="order-form__submit" type="submit" :disabled="saving">
      {{ saving ? 'Saving…' : editMode ? 'Save changes' : 'Create order' }}
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
