import VueLazyload from 'vue3-lazy'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'animate.css'

// 1. 创建 pinia 实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 2. 创建应用实例
const app = createApp(App)

// 3. 按顺序使用插件（确保 pinia 在 router 之前）
app.use(VueLazyload, {
  loading: '',
  error: '',
})
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 4. 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 5. 挂载应用
app.mount('#app')

// 6. 导出 pinia 实例供其他文件使用
export { pinia }
