<template>
    <header>
        <div class="navbar"
            v-for="nav in navigations" :key="nav.name">
            <RouterLink v-if="!$store.state.user.isLogin" class="nav" :to="nav.href">
                {{ nav.name }}
            </RouterLink>
        </div>
        <div class="navbar" v-if="$store.state.user.isLogin">
            <div type="button" class="nav" @click="logout">
                Logout
            </div>
            <RouterLink class="nav id" to="/profile">
                {{ $store.state.user.userId + '님' }}💚
            </RouterLink>
        </div>
    </header>
</template>

<script>
import { logoutUser } from '../api/index';

export default ({
    data() {
        return {
            navigations: [
                {
                    name: 'Login',
                    href: '/login'
                },
                {
                    name: 'Join',
                    href: '/join'
                },
                
            ],
        }
    },
    methods: {
        async logout(){
            try {
                await logoutUser();
                await this.$store.dispatch('user/logout');
                this.$router.push({name: 'Main'});
            }catch(err){
                console.log(err);
            }
        }
    }
})
</script>

<style scoped>
 header {
     display: flex;
     justify-content: flex-end;
     margin-right: 10px;
    }
.nav {
    text-decoration: none;
    margin: 0 10px;
    color:gray;
}
.id {
    color:rgb(132, 218, 132);
}
</style>