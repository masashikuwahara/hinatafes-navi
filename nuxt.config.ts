import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css',
        'leaflet/dist/leaflet.css',
  ],
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
        {
          name: 'google-site-verification',
          content: 'dgN96_4bDes1EkWctdSfcV04ySWa5zsXnT_F4Aki23Y',
        },
        {
          name: 'theme-color',
          content: '#7cc7e8',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '48x48',
          href: '/favicon-48x48.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
