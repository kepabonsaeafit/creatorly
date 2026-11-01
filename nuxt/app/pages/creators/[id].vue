<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import { ColorUtil } from '~/utils/ColorUtil'
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CurrencyUtil } from '~/utils/CurrencyUtil'
import { LabelUtil } from '~/utils/LabelUtil'

// non-reactive variables
const route = useRoute()
const creator = await fetchCreator(Number(route.params.id))

// functions
async function fetchCreator(id: number): Promise<CreatorInterface> {
  const { data } = await useFetch<CreatorInterface>(`/api/creators/${id}`)
  if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Creator: not found', fatal: true })
  }

  return data.value
}

// hooks
useHead({ title: creator.name })
</script>

<template>
  <NuxtLink to="/creators" class="btn btn-outline-secondary btn-sm mb-4">← All creators</NuxtLink>

  <div class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
            <h1 class="h2 fw-bold mb-0">{{ creator.name }}</h1>
            <span :class="`badge text-bg-${ColorUtil.availability(creator.available)}`">
              {{ LabelUtil.availability(creator.available) }}
            </span>
          </div>

          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Niche</span>
              <span class="fw-semibold text-capitalize">{{ creator.niche }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Content type</span>
              <span class="fw-semibold">{{ creator.contentType }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Rate per piece</span>
              <span class="fw-semibold">{{ CurrencyUtil.format(creator.rate) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
