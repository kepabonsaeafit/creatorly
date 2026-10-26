<script setup lang="ts">
// Author: Gerónimo Montes

// internal imports
import RenderingBadgeComponent from '~/components/RenderingBadgeComponent.vue'

/** A resource of the section, shown as a card. */
interface ResourceCard {
  to: string
  title: string
  description: string
}

// non-reactive variables
const RESOURCES: ResourceCard[] = [
  {
    to: '/resources/budget-calculator',
    title: 'Budget calculator',
    description:
      'Work out the budget of an order from the creator rate, the number of pieces, the usage rights and the agency commission.',
  },
  {
    to: '/resources/faq',
    title: 'Frequently asked questions',
    description:
      'What brands ask most often about UGC, timelines, revisions and who owns the content once it is delivered.',
  },
]
</script>

<template>
  <main class="resources">
    <RenderingBadgeComponent rendering="CSR" />
    <h1>Resources</h1>
    <p class="resources__lead">
      Tools and answers for brands working with the agency. This section is rendered only in the
      browser.
    </p>

    <div class="resources__cards">
      <NuxtLink
        v-for="resource in RESOURCES"
        :key="resource.to"
        :to="resource.to"
        class="resources__card"
      >
        <h2 class="resources__card-title">{{ resource.title }}</h2>
        <p class="resources__card-text">{{ resource.description }}</p>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.resources {
  padding: 1rem 0;
}

.resources__lead {
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.resources__cards {
  display: grid;
  gap: 1.5rem;
}

.resources__card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
  transition: border-color 0.2s ease;
}

.resources__card:hover {
  border-color: var(--color-primary);
}

.resources__card-title {
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.resources__card-text {
  color: var(--color-text);
}

@media (min-width: 1024px) {
  .resources__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
