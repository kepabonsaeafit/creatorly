<script setup lang="ts">
// Author: Gerónimo Montes

// internal imports
import { articles } from '~/data/ArticleData'
import { DateUtil } from '~/utils/DateUtil'

// hooks
useHead({ title: 'Blog' })
</script>

<template>
  <header class="mb-4">
    <span class="badge text-bg-secondary mb-2">SSG</span>
    <h1 class="h2 fw-bold mb-1">Blog</h1>
    <p class="text-body-secondary mb-0">
      Articles about running a UGC creator agency, rendered to static HTML at build time.
    </p>
  </header>

  <div class="list-group">
    <NuxtLink
      v-for="article in articles"
      :key="article.id"
      :to="`/blog/${article.id}`"
      class="list-group-item list-group-item-action py-3"
    >
      <h2 class="h5 mb-1">{{ article.title }}</h2>
      <p class="mb-1 text-body-secondary">{{ article.summary }}</p>
      <small class="text-body-secondary">
        {{ article.author }} · {{ DateUtil.format(article.date) }} ·
        {{ article.readingMinutes }} min read
      </small>
    </NuxtLink>
  </div>
</template>
