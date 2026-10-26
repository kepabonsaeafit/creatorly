<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CurrencyUtil } from '~/utils/CurrencyUtil'

// non-reactive variables
const route = useRoute()

// reactive variables
const { data: creator, error } = await useFetch<CreatorInterface>(
  `/api/creators/${String(route.params.id)}`,
)

if (error.value || !creator.value) {
  throw createError({ status: 404, statusText: 'Creator: not found', fatal: true })
}
</script>

<template>
  <main class="creator-detail">
    <NuxtLink to="/creators" class="creator-detail__back">← Back to creators</NuxtLink>

    <article v-if="creator" class="creator-detail__card">
      <div class="creator-detail__header">
        <span class="creator-detail__badge">SSR</span>
        <span
          class="creator-detail__status"
          :class="
            creator.available ? 'creator-detail__status--available' : 'creator-detail__status--busy'
          "
        >
          {{ creator.available ? 'Available' : 'Not available' }}
        </span>
      </div>

      <h1 class="creator-detail__name">{{ creator.name }}</h1>

      <dl class="creator-detail__list">
        <div class="creator-detail__row">
          <dt class="creator-detail__term">Niche</dt>
          <dd class="creator-detail__value creator-detail__value--niche">{{ creator.niche }}</dd>
        </div>

        <div class="creator-detail__row">
          <dt class="creator-detail__term">Content type</dt>
          <dd class="creator-detail__value">{{ creator.contentType }}</dd>
        </div>

        <div class="creator-detail__row">
          <dt class="creator-detail__term">Rate per piece</dt>
          <dd class="creator-detail__value creator-detail__value--rate">
            {{ CurrencyUtil.format(creator.rate) }}
          </dd>
        </div>
      </dl>
    </article>
  </main>
</template>

<style scoped>
.creator-detail {
  padding: 1rem 0;
  max-width: 60ch;
}

.creator-detail__back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: 0.9rem;
}

.creator-detail__card {
  padding: 1.75rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
}

.creator-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.creator-detail__badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
}

.creator-detail__status {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.creator-detail__status--available {
  background: var(--color-success);
  color: var(--brand-white);
}

.creator-detail__status--busy {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.creator-detail__name {
  margin-bottom: 1.5rem;
}

.creator-detail__list {
  display: grid;
  gap: 0.85rem;
}

.creator-detail__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-border);
}

.creator-detail__row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.creator-detail__term {
  color: var(--color-text);
  opacity: 0.75;
}

.creator-detail__value {
  font-weight: 600;
  color: var(--color-heading);
}

.creator-detail__value--niche {
  text-transform: capitalize;
}

.creator-detail__value--rate {
  color: var(--color-primary);
}
</style>
