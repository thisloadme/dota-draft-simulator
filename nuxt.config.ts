// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY
  },
})