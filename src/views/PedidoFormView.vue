<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="Panel">
    <h1>{{ route.params.id ? 'Editar pedido' : 'Crear pedido' }}</h1>
    <p>Formulario de creación/edición de pedidos (por asignar).</p>
  </main>
</template>
