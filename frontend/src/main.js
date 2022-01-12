//가장 먼저 실행되는 js, vue 인스턴스 생성
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store/index.js'

import { library } from '@fortawesome/fontawesome-svg-core'
 import { faUserCircle, faChevronRight, faChevronLeft, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons' 
 import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' 
 library.add(faUserCircle, faChevronRight, faChevronLeft, faXmark, faPlus)

createApp(App)
.use(router)
.use(store)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
