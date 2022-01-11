<template>
  <div class="Modal">
    <div class="todoModal" v-show="!showFormModal && !showDetailModal">
      <template class="content">
          <p>{{ clickedDate + '일' }}</p>
          <div class="todoList" v-if="filterTodos">
            <div class="todo" v-for="(todo,idx) in filterTodos" :key="idx">
              <!--<input class="form-check-input" type="checkbox" id="flexCheck">-->
              <span @click="showDetail(todo)">{{ todo.title }}</span>
            </div>
          </div>
          <div class="btn">
            <div class="btn-add" @click="goToForm()">
                  <font-awesome-icon icon="plus" type="button"/>
            </div>
          </div>
      </template>
    </div>
    <TodoForm v-if="showFormModal" @close-modal="showFormModal=false"/>
    <TodoDetail v-if="showDetailModal" @close-modal="showDetailModal=false" :todoInfo="todoInfo"/>
  </div>
</template>

<script>
import TodoForm from './TodoForm.vue';
import TodoDetail from './TodoDetail.vue';
import { mapState, mapGetters } from "vuex";

export default ({
  components: {
    TodoForm,
    TodoDetail
  },
  data() {
      return {
        showFormModal: false,
        showDetailModal: false,
        todoInfo:{},
      }
    },
  computed: {
    ...mapState('todo', ['clickedDate','todos']),
    ...mapGetters('todo', ['filterTodos']),
    },
  methods: {
    goToForm(){
        this.showFormModal = !this.showFormModal;
      },
    showDetail(todo){
        this.showDetailModal = !this.showDetailModal;
        this.todoInfo = todo;
      },
    }
});
</script>

<style scoped>
.todoModal {
  height: 370px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}
.content > p{
  font-size: 25px;
  padding-top: 0;
}
.btn {
  position: absolute;
  top: 330px;
  left: 260px;
}
.todoList > .todo {
  margin: 10px;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
}
.form-check-input {
  margin-right: 7px;
}

</style>