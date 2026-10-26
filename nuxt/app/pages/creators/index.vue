<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import CreatorCardComponent from '~/components/CreatorCardComponent.vue'
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import RenderingBadgeComponent from '~/components/RenderingBadgeComponent.vue'

// reactive variables
const { data: creators } = await useFetch<CreatorInterface[]>('/api/creators')
</script>

<template>
  <main class="creators">
    <RenderingBadgeComponent rendering="SSR" />
    <h1>Creators</h1>
    <p class="creators__lead">
      The UGC talent in the agency catalog. This page is rendered on the server on every request.
    </p>

    <ul v-if="creators" class="creators__grid">
      <li v-for="creator in creators" :key="creator.id" class="creators__item">
        <CreatorCardComponent :creator="creator" />
      </li>
    </ul>
  </main>
</template>

<style scoped>
.creators {
  padding: 1rem 0;
}

.creators__lead {
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.creators__grid {
  display: grid;
  gap: 1.25rem;
  list-style: none;
  padding: 0;
}

@media (min-width: 768px) {
  .creators__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .creators__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
