<template>
    <header>
        <nav class="navbar navbar-expand navbar-light bg-light">
            <div class="container-fluid">
                <div v-if="isLogin" class="collapse navbar-collapse" id="navbarSupportedContent">
                <a class="navbar-brand">{{ userId+'님의 Calendar'}}</a>
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" aria-current="page" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/profile">Profile</router-link>
                    </li>
                    <li class="nav-item">
                        <div class="nav-link" @click="logout">Logout</div>
                    </li>
                </ul>
                <form class="search d-flex" v-if="this.$route.path==='/'">
                    <input class="searchInput form-control me-2" v-model="searchTitle" type="search" placeholder="Search">
                    <button class="searchBtn btn btn-sm btn-outline-success" type="submit" @click.prevent="search">Search</button>
                </form>
                </div>
                <div v-else class="collapse navbar-collapse" id="navbarSupportedContent">
                <a class="navbar-brand">Calendar</a>
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" aria-current="page" to="/">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" aria-current="page" to="/join">Join</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <SearchItem v-show="showSearchResult" style="width:15%; float: right; max-height: 560px"
        :result="result" :showSearchResult="showSearchResult" @close-card="showSearchResult=false"/>
    </header>
</template>

<script>
import { logoutUser,searchTodo } from '../api/index';
import SearchItem from './SearchItem.vue';
import { mapState } from 'vuex';


export default ({
    components:{
        SearchItem,
    },
    data() {
        return {
            searchTitle: null,
            searchSuccess: false,
            result:[],
            showSearchResult: false
        }
    }, 
    computed: {
        ...mapState('todo',['todos']),
        isLogin() {
            return this.$store.state.user.isLogin
        },
        userId() {
            return this.$store.state.user.userId
        },
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
        },
        async search(){
            const id = this.$store.state.user.userId;
            if(this.searchTitle){
                const res = await searchTodo(id, this.searchTitle);
                if(res.data.resultData.searchTodo){
                    this.result = res.data.array;
                    this.showSearchResult = true;
                }
                else{
                    window.alert('검색 결과가 없습니다.');
                }
            }
        },
    }  
})
</script>

<style scoped>

header {
    position: fixed;
     width: 100%;
     top: 0;
     right: 0;
}
.nav-link {
    cursor: pointer;
}
</style>