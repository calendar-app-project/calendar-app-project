//가장 먼저 실행되는 js, vue 인스턴스 생성
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
//import Bootstrap from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
 import { faUserCircle } from '@fortawesome/free-solid-svg-icons' 
 import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' 
 library.add(faUserCircle)


createApp(App)
.use(router)
//.use(Bootstrap)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
