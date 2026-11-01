<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import { faqs } from '~/data/FaqData'

// reactive variables
// id of the open question, or null when every question is collapsed: only one
// answer stays open at a time
const openId = ref<string | null>(null)

// functions
function toggle(id: string): void {
  openId.value = openId.value === id ? null : id
}

// hooks
useHead({ title: 'FAQ' })
</script>

<template>
  <NuxtLink to="/other" class="btn btn-outline-secondary btn-sm mb-4"> ← Other </NuxtLink>

  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Frequently asked questions</h1>
    <p class="text-body-secondary mb-0">
      What brands ask the agency most often. Select a question to read the answer.
    </p>
  </header>

  <div class="accordion">
    <div v-for="faq in faqs" :key="faq.id" class="accordion-item">
      <h2 class="accordion-header">
        <button
          type="button"
          class="accordion-button"
          :class="{ collapsed: openId !== faq.id }"
          :aria-expanded="openId === faq.id"
          @click="toggle(faq.id)"
        >
          {{ faq.question }}
        </button>
      </h2>
      <div v-if="openId === faq.id" class="accordion-collapse show">
        <div class="accordion-body">{{ faq.answer }}</div>
      </div>
    </div>
  </div>
</template>
