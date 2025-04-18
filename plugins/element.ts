import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})
