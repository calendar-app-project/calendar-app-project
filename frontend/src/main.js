//가장 먼저 실행되는 js, vue 인스턴스 생성
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

createApp(App)
.use(router)
.mount('#app')
