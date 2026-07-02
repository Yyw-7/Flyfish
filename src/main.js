import '@/assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as echarts from 'echarts'

async function bootstrap() {
  // MSW：开发环境下启动 mock service worker
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
      },
      onUnhandledRequest: 'bypass',
      quiet: true
    })
    console.log('🔧 MSW Mock Service Worker 已启动')
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.config.globalProperties.$echarts = echarts

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')
}

bootstrap()
