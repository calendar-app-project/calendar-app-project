//가장 먼저 실행되는 js, vue 인스턴스 생성
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
//import Bootstrap from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

createApp(App)
.use(router)
//.use(Bootstrap)
.mount('#app')
