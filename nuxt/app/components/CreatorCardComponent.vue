<script setup lang="ts">
// Author: Felipe Gómez

// internal imports
import type { CreatorInterface } from '#shared/interfaces/CreatorInterface'
import { CurrencyUtil } from '~/utils/CurrencyUtil'

// props
defineProps<{ creator: CreatorInterface }>()
</script>

<template>
  <NuxtLink :to="`/creators/${creator.id}`" class="creator-card">
    <div class="creator-card__header">
      <h2 class="creator-card__name">{{ creator.name }}</h2>
      <span
        class="creator-card__status"
        :class="
          creator.available ? 'creator-card__status--available' : 'creator-card__status--busy'
        "
      >
        {{ creator.available ? 'Available' : 'Not available' }}
      </span>
    </div>

    <p class="creator-card__meta">
      <span class="creator-card__niche">{{ creator.niche }}</span>
      <span>·</span>
      <span>{{ creator.contentType }}</span>
    </p>

    <p class="creator-card__rate">{{ CurrencyUtil.format(creator.rate) }} / piece</p>
  </NuxtLink>
</template>

<style scoped>
.creator-card {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
  transition: border-color 0.2s ease;
}

.creator-card:hover {
  border-color: var(--color-primary);
}

.creator-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.creator-card__name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-heading);
}

.creator-card__status {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.creator-card__status--available {
  background: var(--color-success);
  color: var(--brand-white);
}

.creator-card__status--busy {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.creator-card__meta {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

.creator-card__niche {
  text-transform: capitalize;
}

.creator-card__rate {
  font-weight: 600;
  color: var(--color-primary);
}
</style>
