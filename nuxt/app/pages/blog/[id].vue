<script setup lang="ts">
// Author: Gerónimo Montes

// external imports
import { computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// internal imports
import { ARTICLES } from '~/data/ArticleData'
import { ArticleUtil } from '~/utils/ArticleUtil'
import { DateUtil } from '~/utils/DateUtil'

// an unknown id never reaches the template: validate rejects the route first
// and Nuxt answers with its 404 page
definePageMeta({
  validate: (route: RouteLocationNormalized): boolean =>
    ArticleUtil.findById(ARTICLES, String(route.params.id)) !== undefined,
})

// non-reactive variables
const route = useRoute()

// computed variables
const article = computed(() => ArticleUtil.findById(ARTICLES, String(route.params.id)))

// hooks
useHead({ title: () => article.value?.title ?? 'Blog' })
</script>

<template>
  <NuxtLink to="/blog" class="btn btn-outline-secondary btn-sm mb-4">← All articles</NuxtLink>

  <article v-if="article" class="row justify-content-center">
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
