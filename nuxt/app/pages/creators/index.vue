<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import CreatorCardComponent from '~/components/CreatorCardComponent.vue'
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'

// reactive variables
const { data: creators } = await useFetch<CreatorInterface[]>('/api/creators')
</script>

<template>
  <main class="creators">
    <span class="creators__badge">SSR</span>
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

.creators__badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
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
