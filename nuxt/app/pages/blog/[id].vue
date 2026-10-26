<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed } from 'vue'

// internal imports
import { ARTICLES } from '~/data/ArticleData'

// an unknown id never reaches the template: validate rejects the route first
// and Nuxt answers with its 404 page
definePageMeta({
  validate: (route) => ARTICLES.some((article) => article.id === String(route.params.id)),
})

// non-reactive variables
const route = useRoute()

// computed variables
const article = computed(() => ARTICLES.find((item) => item.id === String(route.params.id)))
</script>

<template>
  <main class="article">
    <article v-if="article">
      <NuxtLink to="/blog" class="article__back">← Back to the blog</NuxtLink>

      <h1 class="article__title">{{ article.title }}</h1>
      <p class="article__meta">
        {{ article.author }} · {{ article.date }} · {{ article.readingMinutes }} min read
      </p>
      <p class="article__summary">{{ article.summary }}</p>

      <p v-for="(paragraph, index) in article.paragraphs" :key="index" class="article__paragraph">
        {{ paragraph }}
      </p>
    </article>
  </main>
</template>

<style scoped>
.article {
  padding: 1rem 0;
  max-width: 70ch;
}

.article__back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: 0.9rem;
}

.article__title {
  margin-bottom: 0.5rem;
}

.article__meta {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  opacity: 0.65;
  font-size: 0.85rem;
}

.article__summary {
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 3px solid var(--color-primary);
  color: var(--color-heading);
  font-size: 1.05rem;
}

.article__paragraph {
  margin-bottom: 1.1rem;
  color: var(--color-text);
  line-height: 1.75;
}
</style>
