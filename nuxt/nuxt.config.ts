// Author: Kevin Pabón

// internal imports
import { ARTICLES } from './app/data/ArticleData'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
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
    '/resources': { ssr: false },
    '/resources/**': { ssr: false },
  },
  nitro: {
    prerender: {
      // only the routes listed here are prerendered, not the links found in them
      crawlLinks: false,
      routes: ['/blog', ...ARTICLES.map((article) => `/blog/${article.id}`)],
    },
  },
  app: {
    head: {
      title: 'Creatorly',
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },
})
