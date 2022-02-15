<template>
<div>
    <div ref="card" class="card card-body" v-for="searchTodo in result" :key="searchTodo.post_id" @click="find(searchTodo)">
        <p class="title">{{ searchTodo.title }}</p> 
        <p class="date">{{ searchTodo.year+'년 '+ searchTodo.month+'월 '+searchTodo.date+'일'}}</p>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default ({
    props:['result', 'showSearchResult'],
    computed: {
        ...mapState('todo',['today','searchData']),
    },
    watch:{
        showSearchResult(){
            if(this.showSearchResult){
                window.addEventListener('click', this.onClick);
            }else{
                window.removeEventListener('click', this.onClick);
            } 
        }
    },
    methods: {
        onClick(e){
            if(e.target.parentNode !== this.$refs.card){ //card 외부 영역 클릭
                this.$emit('close-card');
            }
        },
        find(searchTodo){
            this.$store.dispatch('todo/setSearchSchedule', searchTodo);
            if(!(this.searchData.year === this.today.year 
                 && this.searchData.month === this.today.month)){
                location.reload();
            }
        }
    },
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