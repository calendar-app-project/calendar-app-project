import { createRouter,createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Login.vue';
import Join from '../views/Join.vue';
import Profile from '../views/Profile.vue';

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
        },
        {
            path: '/join',
            name: 'Join',
            component: Join
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        }
    ]
})