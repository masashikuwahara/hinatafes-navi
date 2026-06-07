import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },
      title: 'ひなたフェス2026 現地ナビ',
      titleTemplate: '%s | ひなたフェス2026 現地ナビ',
      meta: [
        {
          name: 'description',
          content:
            'ひなたフェス2026の現地参加をサポートする、非公式のスマホ向け現地ナビアプリです。',
        },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
