<template>
  <div class="Modal">
    <div class="todoModal" v-show="!showFormModal && !showDetailModal">
      <template class="content">
          <p>{{ clickedDate + '일' }}</p>
          <div class="todoList" v-if="filterTodos">
            <div class="todo" v-for="(todo,idx) in filterTodos" :key="idx" @click="showDetail(todo)">
              {{ todo.title }}
            </div>
          </div>
          <div class="btn">
            <div class="btn-add" @click="goToForm()">
                  <font-awesome-icon icon="plus" type="button"/>
            </div>
          </div>
      </template>
    </div>
    <TodoForm v-if="showFormModal"/>
    <TodoDetail v-if="showDetailModal" :todoInfo="todoInfo"/>
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
      }
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
  font-size: 22px;
  padding-top: 0;
}
.btn {
  position: absolute;
  top: 330px;
  left: 260px;
}
.todoList > .todo {
  margin: 6px;
  font-size: 15px;
  text-align: left;
}

</style>