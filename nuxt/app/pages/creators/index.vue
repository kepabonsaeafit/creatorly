<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CreatorUtil } from '~/utils/CreatorUtil'
import { CurrencyUtil } from '~/utils/CurrencyUtil'

// reactive variables
const { data: creators } = await useFetch<CreatorInterface[]>('/api/creators')

// hooks
useHead({ title: 'Creators' })
</script>

<template>
  <header class="mb-4">
    <span class="badge text-bg-secondary mb-2">SSR</span>
    <h1 class="h2 fw-bold mb-1">Creators</h1>
    <p class="text-body-secondary mb-0">
      The UGC talent in the agency catalog, rendered on the server on every request.
    </p>
  </header>

  <div class="row g-4">
    <div v-for="creator in creators" :key="creator.id" class="col-12 col-md-6 col-xl-4 d-flex">
      <div class="card w-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h2 class="h5 card-title mb-0">{{ creator.name }}</h2>
            <span :class="`badge text-bg-${CreatorUtil.getAvailabilityColor(creator.available)}`">
              {{ CreatorUtil.getAvailabilityLabel(creator.available) }}
            </span>
          </div>
          <p class="card-text text-body-secondary text-capitalize">
            {{ creator.niche }} · {{ creator.contentType }}
          </p>
          <p class="fw-semibold mt-auto">{{ CurrencyUtil.format(creator.rate) }} / piece</p>
          <NuxtLink :to="`/creators/${creator.id}`" class="btn btn-primary btn-sm align-self-start">
            View creator
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
