// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxt/test-utils'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  icon: {},

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-02-05',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
