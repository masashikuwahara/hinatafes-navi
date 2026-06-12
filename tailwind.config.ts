import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],

  theme: {
    extend: {
      colors: {
        hinata: {
          sky: '#7cc7e8',
          skySoft: '#e8f7fc',
          skyPale: '#f6fcff',
          yellow: '#fff3b0',
          yellowSoft: '#fff9d8',
          green: '#7bdcb5',
          pink: '#f6a7c1',
          purple: '#b9a7f6',
          orange: '#f6b26b',
          red: '#ef4444',
          navy: '#1f3347',
          text: '#263747',
          muted: '#64748b',
          border: '#d7edf6',
        },
      },

      fontFamily: {
        sans: [
          'Yu Gothic',
          'YuGothic',
          'Hiragino Sans',
          'Hiragino Kaku Gothic ProN',
          'Meiryo',
          'system-ui',
          'sans-serif',
        ],
      },

      borderRadius: {
        app: '1rem',
        card: '1rem',
        button: '0.875rem',
      },

      boxShadow: {
        card: '0 8px 24px rgba(31, 51, 71, 0.08)',
        soft: '0 4px 16px rgba(31, 51, 71, 0.06)',
      },
    },
  },

  plugins: [],
}