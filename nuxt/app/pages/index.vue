<script setup lang="ts">
// Author: Kevin Pabón

/** A section of the site shown as a card on the home page. */
interface HomeSection {
  to: string
  title: string
  description: string
  rendering: string
}

// non-reactive variables
const sections: HomeSection[] = [
  {
    to: '/blog',
    title: 'Blog',
    description:
      'Articles about running a UGC creator agency, generated as static pages at build time.',
    rendering: 'SSG',
  },
  {
    to: '/creators',
    title: 'Creators',
    description:
      "The UGC talent in the agency catalog, served by Nuxt's server layer on every request.",
    rendering: 'SSR',
  },
  {
    to: '/resources',
    title: 'Resources',
    description:
      'A budget calculator for orders and frequently asked questions, rendered in the browser.',
    rendering: 'CSR',
  },
]
</script>

<template>
  <section class="py-4 mb-4">
    <h1 class="display-5 fw-bold">Creatorly</h1>
    <p class="lead text-body-secondary mb-0">
      A small Nuxt version of the internal dashboard of a UGC creator agency.
    </p>
  </section>

  <div class="row g-4">
    <div v-for="section in sections" :key="section.to" class="col-12 col-md-4 d-flex">
      <div class="card w-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h2 class="h5 card-title mb-0">{{ section.title }}</h2>
            <span class="badge text-bg-secondary">{{ section.rendering }}</span>
          </div>
          <p class="card-text text-body-secondary flex-grow-1">{{ section.description }}</p>
          <NuxtLink :to="section.to" class="btn btn-primary align-self-start">
            Open {{ section.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
