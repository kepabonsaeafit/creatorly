<script setup lang="ts">
// Author: Gerónimo Montes

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

// hooks
useHead({ title: 'Resources' })
</script>

<template>
  <header class="mb-4">
    <span class="badge text-bg-secondary mb-2">CSR</span>
    <h1 class="h2 fw-bold mb-1">Resources</h1>
    <p class="text-body-secondary mb-0">
      Tools and answers for brands working with the agency, rendered only in the browser.
    </p>
  </header>

  <div class="row g-4">
    <div v-for="resource in RESOURCES" :key="resource.to" class="col-12 col-md-6 d-flex">
      <div class="card w-100">
        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title">{{ resource.title }}</h2>
          <p class="card-text text-body-secondary flex-grow-1">{{ resource.description }}</p>
          <NuxtLink :to="resource.to" class="btn btn-primary align-self-start">Open</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
