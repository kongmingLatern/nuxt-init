// Ant Design Vue 插件配置
import { defineNuxtPlugin } from '#app'
import { message, notification, Modal } from 'ant-design-vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 导出默认插件
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Antd)
  return {
    provide: {
      message,
      notification,
      modal: Modal
    }
  }
}) 