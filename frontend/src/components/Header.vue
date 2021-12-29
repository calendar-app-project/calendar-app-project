<template>
    <header>
        <nav class="navbar navbar-expand navbar-light bg-light">
            <div class="container-fluid">
                <div v-if="isLogin" class="collapse navbar-collapse" id="navbarSupportedContent">
                <a class="navbar-brand">{{ userId+'님의 Calendar'}}</a>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
                <form class="search d-flex">
                    <input class="searchInput form-control me-2" v-model="searchTitle" type="search" placeholder="Search">
                    <button class="searchBtn btn btn-sm btn-outline-success" type="submit" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" @click.prevent="search">Search</button>
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
        <SearchItem style="width:15%; float: right; max-height: 560px" class="collapse overflow-auto" id="collapseExample"/>
    </header>
</template>

<script>
import { logoutUser } from '../api/index';
import SearchItem from './SearchItem.vue';
import { mapState, mapMutations } from 'vuex';

export default ({
    components:{
        SearchItem,
    },
    data() {
        return {
            searchTitle:'',
            searchSuccess: false,
        }
    },
    computed: {
        ...mapState('todo',['todos', 'searchResult']),
        isLogin() {
            return this.$store.state.user.isLogin
        },
        userId() {
            return this.$store.state.user.userId
        },
    },
    methods: {
        ...mapMutations('todo', ['setSearchedData']),
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
            //await this.$store.dispatch('todo/searchSchedule');
            //if(this.searchResult){
                this.searchSuccess=!this.searchSuccess;
           // }else {
            //    console.log('결과 없음');
            //    return false;
          //  }
          console.log(this.searchSuccess)
        }
    }
})
</script>

<style lang="scss" scoped>
@import "../scss/main.scss";

 header {
    position: fixed;
     width: 100%;
     top: 0;
     right: 0;
}
.navbar-brand {
    white-space:normal;
}

.form-control {
    padding: 10px;
    width: 130px;
}
.label {
    font-size: 10px;
}
.nav-item {
    text-decoration: none;
    margin-left: 7px;
    color:gray;
}
.nav-link {
    cursor: pointer;
}

.id {
    color:rgb(132, 218, 132);
}
</style>