<script setup lang="ts">
// Author: Gerónimo Montes

/** A tool of the section, shown as a card. */
interface ToolCard {
  to: string
  title: string
  description: string
}

// non-reactive variables
const tools: ToolCard[] = [
  {
    to: '/other/calculator',
    title: 'Calculator',
    description: 'Add, subtract, multiply and divide two numbers.',
  },
  {
    to: '/other/faq',
    title: 'Frequently asked questions',
    description:
      'What brands ask most often about UGC, timelines, revisions and who owns the content once it is delivered.',
  },
]

// hooks
useHead({ title: 'Other' })
</script>

<template>
  <header class="mb-4">
    <span class="badge text-bg-secondary mb-2">CSR</span>
    <h1 class="h2 fw-bold mb-1">Other</h1>
    <p class="text-body-secondary mb-0">
      A calculator and the frequently asked questions, rendered only in the browser.
    </p>
  </header>

  <div class="row g-4">
    <div v-for="tool in tools" :key="tool.to" class="col-12 col-md-6 d-flex">
      <div class="card w-100">
        <div class="card-body d-flex flex-column">
          <h2 class="h5 card-title">{{ tool.title }}</h2>
          <p class="card-text text-body-secondary flex-grow-1">{{ tool.description }}</p>
          <NuxtLink :to="tool.to" class="btn btn-primary align-self-start">Open</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
