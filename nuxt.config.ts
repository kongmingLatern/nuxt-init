// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@ant-design-vue/nuxt',
  ],
  css: [
    'ant-design-vue/dist/reset.css',
  ],
  build: {
    transpile: ['ant-design-vue'],
  },
  plugins: [
    '~/plugins/axios.ts',
    '~/plugins/antd.ts',
  ],
  build: {
    transpile: ['ant-design-vue']
  },
})
