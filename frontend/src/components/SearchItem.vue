<template>
<div>  <!--searchResult로 변경할 것-->
    <div class="card card-body" v-for="search in todos" :key="search.post_id" @click="find(search)">
        <p class="title">{{ search.title }}</p> 
        <p class="date">{{ search.year+'년 '+ search.month+'월 '+search.date+'일'}}</p>
     </div>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default ({
    computed: {
        ...mapState('todo',['todos', 'searchResult']),
    },
    methods: {
        ...mapMutations('todo',['setSearchedData']),
        find(searchTodo){
            this.setSearchedData({
                searchedPostId: searchTodo.post_id,
                searchedYear: searchTodo.year,
                searchedMonth: searchTodo.month
                });
            location.reload();
        }
    }
})
</script>

<style scoped>
.title {
    font-size: 17px;
    margin-bottom: 0;
}
.date {
    font-size: 13px;
    margin-bottom: 0;
}
.card{
    cursor: pointer;
}

</style>