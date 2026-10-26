<script setup lang="ts">
// Author: Gerónimo Montes

// internal imports
import { ARTICLES } from '~/data/ArticleData'
import { DateUtil } from '~/utils/DateUtil'
</script>

<template>
  <main class="blog">
    <span class="blog__badge">SSG</span>
    <h1>Blog</h1>
    <p class="blog__lead">
      Articles about running a UGC creator agency. These pages are rendered to static HTML at build
      time.
    </p>

    <ul class="blog__list">
      <li v-for="article in ARTICLES" :key="article.id" class="blog__item">
        <NuxtLink :to="`/blog/${article.id}`" class="blog__link">
          <h2 class="blog__title">{{ article.title }}</h2>
          <p class="blog__summary">{{ article.summary }}</p>
          <p class="blog__meta">
            {{ DateUtil.format(article.date) }} · {{ article.readingMinutes }} min read
          </p>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.blog {
  padding: 1rem 0;
}

.blog__badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
}

.blog__lead {
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.blog__list {
  display: grid;
  gap: 1.25rem;
  list-style: none;
  padding: 0;
}

.blog__link {
  display: block;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
  transition: border-color 0.2s ease;
}

.blog__link:hover {
  border-color: var(--color-primary);
}

.blog__title {
  margin-bottom: 0.4rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-heading);
}

.blog__summary {
  margin-bottom: 0.6rem;
  color: var(--color-text);
}

.blog__meta {
  color: var(--color-text);
  opacity: 0.65;
  font-size: 0.85rem;
}
</style>
