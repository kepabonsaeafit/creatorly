<script setup lang="ts">
// Author: Kevin Pabón

// internal imports
import RenderingBadgeComponent from '~/components/RenderingBadgeComponent.vue'

/** A section of the site shown as a card on the home page. */
interface HomeSection {
  to: string
  title: string
  description: string
  rendering: string
}

// non-reactive variables
const SECTIONS: HomeSection[] = [
  {
    to: '/blog',
    title: 'Blog',
    description: 'Articles about running a UGC creator agency.',
    rendering: 'SSG',
  },
  {
    to: '/creators',
    title: 'Creators',
    description: 'The UGC talent in the agency catalog.',
    rendering: 'SSR',
  },
  {
    to: '/resources',
    title: 'Resources',
    description: 'A budget calculator for orders and frequently asked questions.',
    rendering: 'CSR',
  },
]
</script>

<template>
  <main class="home">
    <h1>Creatorly</h1>
    <p class="home__lead">
      A small Nuxt version of the internal dashboard of a UGC creator agency.
    </p>

    <div class="home__sections">
      <NuxtLink v-for="section in SECTIONS" :key="section.to" :to="section.to" class="home__card">
        <RenderingBadgeComponent :rendering="section.rendering" />
        <h2 class="home__card-title">{{ section.title }}</h2>
        <p class="home__card-text">{{ section.description }}</p>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.home {
  padding: 1rem 0;
}

.home__lead {
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.home__sections {
  display: grid;
  gap: 1.5rem;
}

.home__card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
  transition: border-color 0.2s ease;
}

.home__card:hover {
  border-color: var(--color-primary);
}

.home__card-title {
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.home__card-text {
  color: var(--color-text);
}

@media (min-width: 1024px) {
  .home__sections {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
