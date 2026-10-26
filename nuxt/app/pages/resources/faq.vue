<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { ref } from 'vue'

// internal imports
import { FAQS } from '~/data/FaqData'
import RenderingBadgeComponent from '~/components/RenderingBadgeComponent.vue'

// reactive variables
// id of the open question, or null when every question is collapsed: only one
// answer stays open at a time
const openId = ref<string | null>(null)

// functions
function toggle(id: string): void {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <main class="faq">
    <RenderingBadgeComponent rendering="CSR" />
    <h1>Frequently asked questions</h1>
    <p class="faq__lead">
      What brands ask the agency most often. Select a question to read the answer.
    </p>

    <ul class="faq__list">
      <li v-for="faq in FAQS" :key="faq.id" class="faq__item">
        <button
          type="button"
          class="faq__question"
          :aria-expanded="openId === faq.id"
          @click="toggle(faq.id)"
        >
          <span>{{ faq.question }}</span>
          <span class="faq__sign" aria-hidden="true">{{ openId === faq.id ? '−' : '+' }}</span>
        </button>

        <p v-if="openId === faq.id" class="faq__answer">{{ faq.answer }}</p>
      </li>
    </ul>

    <NuxtLink to="/resources" class="faq__back">← Back to resources</NuxtLink>
  </main>
</template>

<style scoped>
.faq {
  padding: 1rem 0;
  max-width: 70ch;
}

.faq__lead {
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.faq__list {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
}

.faq__item {
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
  overflow: hidden;
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.1rem 1.25rem;
  border: none;
  background: transparent;
  color: var(--color-heading);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.faq__question:hover {
  color: var(--color-primary);
}

.faq__sign {
  flex-shrink: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
}

.faq__answer {
  padding: 0 1.25rem 1.25rem;
  color: var(--color-text);
  line-height: 1.7;
}

.faq__back {
  display: inline-block;
  margin-top: 2rem;
  color: var(--color-primary);
  font-size: 0.9rem;
}
</style>
