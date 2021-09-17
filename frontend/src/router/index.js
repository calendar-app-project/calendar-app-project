import { createRouter,createWebHistory } from 'vue-router';
import Main from '../view/Main.vue';
import Login from '../view/Login.vue';

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ]
})