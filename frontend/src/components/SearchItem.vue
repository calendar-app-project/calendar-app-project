<template>
<div> 
    <div class="card card-body" v-for="searchTodo in result" :key="searchTodo.post_id" @click="find(searchTodo)">
        <p class="title">{{ searchTodo.title }}</p> 
        <p class="date">{{ searchTodo.year+'년 '+ searchTodo.month+'월 '+searchTodo.date+'일'}}</p>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default ({
    props:['result'],
    computed: {
        ...mapState('todo',['todos','date','searchData']),
    },
    methods: {
        find(searchTodo){
            this.$store.dispatch('todo/setSearchSchedule', searchTodo);
            if(!(this.searchData.year === this.date.year 
                 && this.searchData.month === this.date.month)){
                location.reload();
            }
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