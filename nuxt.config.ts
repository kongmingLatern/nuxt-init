// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@element-plus/nuxt',
  ],
  plugins: ['~/plugins/element.ts', '~/plugins/axios.ts'],
  elementPlus: {
    importStyle: 'scss',
    themes: ['dark'],
  },
})
