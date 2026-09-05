<script setup lang="ts">
// Felipe Gómez

// external imports
import { computed, ref } from 'vue'

// internal imports
import type { CreatePedidoDTO } from '@/dtos/CreatePedidoDTO'
import type { EstadoPedido } from '@/interfaces/PedidoInterface'
import { CreadorService } from '@/services/CreadorService'
import { MarcaService } from '@/services/MarcaService'
import { UserService } from '@/services/UserService'
import { formatEstado } from '@/utils/formatEstado'

interface Props {
  initial?: Partial<CreatePedidoDTO>
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

const emit = defineEmits<{ submit: [datos: CreatePedidoDTO] }>()

const ESTADOS: EstadoPedido[] = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado']

// selectors
const descripcion = ref(props.initial.descripcion ?? '')
const presupuesto = ref(props.initial.presupuesto ?? 0)
const marcaId = ref(props.initial.marcaId ?? '')
const creadorId = ref(props.initial.creadorId ?? '')
const coordinadorId = ref(props.initial.coordinadorId ?? '')
const fechaSolicitud = ref(props.initial.fechaSolicitud ?? new Date().toISOString().slice(0, 10))
const fechaEntrega = ref(props.initial.fechaEntrega ?? '')
const estado = ref<EstadoPedido>(props.initial.estado ?? 'solicitado')

// computed variables
const marcas = computed(() => MarcaService.getAll())
const creadores = computed(() => CreadorService.getAll())
const coordinadores = computed(() =>
  UserService.getAll().filter((usuario) => usuario.rol === 'coordinador'),
)

// functions
function onSubmit(): void {
  emit('submit', {
    descripcion: descripcion.value.trim(),
    presupuesto: Number(presupuesto.value),
    marcaId: marcaId.value,
    creadorId: creadorId.value || null,
    coordinadorId: coordinadorId.value,
    fechaSolicitud: fechaSolicitud.value,
    fechaEntrega: fechaEntrega.value || null,
    estado: estado.value,
  })
}
</script>

<template>
  <form class="pedido-form" @submit.prevent="onSubmit">
    <div class="pedido-form__field">
      <label class="pedido-form__label" for="descripcion">Descripción</label>
      <input
        id="descripcion"
        v-model="descripcion"
        class="pedido-form__input"
        type="text"
        required
      />
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="presupuesto">Presupuesto</label>
      <input
        id="presupuesto"
        v-model.number="presupuesto"
        class="pedido-form__input"
        type="number"
        min="0"
        step="1"
        required
      />
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="marca">Marca</label>
      <select id="marca" v-model="marcaId" class="pedido-form__input" required>
        <option value="" disabled>Selecciona una marca</option>
        <option v-for="marca in marcas" :key="marca.id" :value="marca.id">
          {{ marca.nombre }}
        </option>
      </select>
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="creador">Creador</label>
      <select id="creador" v-model="creadorId" class="pedido-form__input">
        <option value="">Sin asignar</option>
        <option v-for="creador in creadores" :key="creador.id" :value="creador.id">
          {{ creador.nombre }}
        </option>
      </select>
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="coordinador">Coordinador</label>
      <select id="coordinador" v-model="coordinadorId" class="pedido-form__input" required>
        <option value="" disabled>Selecciona un coordinador</option>
        <option v-for="coordinador in coordinadores" :key="coordinador.id" :value="coordinador.id">
          {{ coordinador.nombre }}
        </option>
      </select>
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="fecha-solicitud">Fecha de solicitud</label>
      <input
        id="fecha-solicitud"
        v-model="fechaSolicitud"
        class="pedido-form__input"
        type="date"
        required
      />
    </div>

    <div class="pedido-form__field">
      <label class="pedido-form__label" for="fecha-entrega">Fecha de entrega</label>
      <input id="fecha-entrega" v-model="fechaEntrega" class="pedido-form__input" type="date" />
    </div>

    <div v-if="modoEdicion" class="pedido-form__field">
      <label class="pedido-form__label" for="estado">Estado</label>
      <select id="estado" v-model="estado" class="pedido-form__input">
        <option v-for="opcion in ESTADOS" :key="opcion" :value="opcion">
          {{ formatEstado(opcion) }}
        </option>
      </select>
    </div>

    <p v-if="error" class="pedido-form__error">{{ error }}</p>

    <button class="pedido-form__submit" type="submit" :disabled="guardando">
      {{ guardando ? 'Guardando…' : modoEdicion ? 'Guardar cambios' : 'Crear pedido' }}
    </button>
  </form>
</template>

<style scoped>
.pedido-form {
  display: grid;
  gap: 1rem;
  max-width: 480px;
}

.pedido-form__field {
  display: grid;
  gap: 0.35rem;
}

.pedido-form__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.pedido-form__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.pedido-form__error {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin: 0;
}

.pedido-form__submit {
  margin-top: 0.5rem;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.pedido-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
