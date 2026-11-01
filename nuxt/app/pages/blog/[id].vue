<script setup lang="ts">
// Author: Gerónimo Montes

// internal imports
import type { ArticleInterface } from '~/interfaces/ArticleInterface'
import { articles } from '~/data/ArticleData'
import { DateUtil } from '~/utils/DateUtil'

// non-reactive variables
const route = useRoute()
const article = findArticle(String(route.params.id))

// functions
function findArticle(id: string): ArticleInterface {
  const found = articles.find((candidate: ArticleInterface): boolean => candidate.id === id)
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'Article: not found', fatal: true })
  }

  return found
}

// hooks
useHead({ title: article.title })
</script>

<template>
  <NuxtLink to="/blog" class="btn btn-outline-secondary btn-sm mb-4">← All articles</NuxtLink>

  <article class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <h1 class="h2 fw-bold">{{ article.title }}</h1>
      <p class="text-body-secondary">
        <small>
          {{ article.author }} · {{ DateUtil.format(article.date) }} ·
          {{ article.readingMinutes }} min read
        </small>
      </p>
      <p class="lead">{{ article.summary }}</p>
      <hr />
      <p v-for="(paragraph, index) in article.paragraphs" :key="index">{{ paragraph }}</p>
    </div>
  </article>
</template>
