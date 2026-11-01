// Author: Kevin Pabón

// internal imports
import type { ArticleInterface } from './app/interfaces/ArticleInterface'
import { articles } from './app/data/ArticleData'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // a section's root is declared apart from its /** rule, so its rendering
  // mode does not depend on whether /** also matches the root
  routeRules: {
    // SSG: rendered to static HTML at build time
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    // SSR: rendered on the server on every request
    '/creators': { ssr: true },
    '/creators/**': { ssr: true },
    // CSR: rendered only in the browser
    '/other': { ssr: false },
    '/other/**': { ssr: false },
  },
  nitro: {
    prerender: {
      // only the routes listed here are prerendered, not the links found in them
      crawlLinks: false,
      routes: [
        '/blog',
        ...articles.map((article: ArticleInterface): string => `/blog/${article.id}`),
      ],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
          integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
          crossorigin: 'anonymous',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
          crossorigin: 'anonymous',
          defer: true,
        },
      ],
    },
  },
})
