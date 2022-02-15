import { getTodo, deleteTodo, editTodo, addTodo } from "../api";

export default {
    namespaced: true,
    state: () => {
        return {
            today:{},
            clickedDate:0,
            todos:[],
            searchData:{
                postId:0,
                year:0,
                month:0
            }
        }
    },
    getters: {
        filterTodos :state => {
            return state.todos.filter(todo => todo.date === state.clickedDate)
        },
    },
    mutations: {
        setDate(state, payload){
            state.today = {
               year: payload.year,
               month: payload.month
            };
        },
        setClickedDate(state, payload) {
            state.clickedDate = payload;
        },
        deleteTodosPerMth(state){
            state.todos =[];
        },
        setTodos(state, payload){
            payload.forEach(todo => state.todos.push(todo));
        },
        removeTodo(state, id){
            state.todos = state.todos.filter(todo => todo.post_id !== id);
        },
        updateTodo(state, {postId, editData}){
            const idx = state.todos.findIndex((el) => el.post_id === postId);
            state.todos.splice(idx,1,editData);
        },
        addTodo(state, userData){
            state.todos.push(userData);
        },
        setSearchData(state, payload) {
            state.searchData.postId = payload.post_id;
            state.searchData.year = payload.year;
            state.searchData.month = payload.month;
        },
        resetSearchData(state) {
            state.searchData.postId = 0;
            state.searchData.year = 0;
            state.searchData.month = 0;
        }
    },
    actions: {
        async getSchedule({state, commit, rootState}){
            try{
                const id = rootState.user.userId;
                const res = await getTodo(id, state.today.year, state.today.month);
                if(res.data.resultData.showSchedule){
                    await commit('setTodos', res.data.array);
                }
            }catch(err){
                console.log(err);
            }
        },
        async deleteSchedule({commit}, postId){
            try{
                const res = await deleteTodo(postId);
                if(res.data.resultData.deleteTodo){
                    await commit('removeTodo',postId);
                }
            }catch(err){
                console.log(err);
            }
        },
        async editSchedule({commit}, payload){
            try {
                const res = await editTodo(payload.post_id, payload);
                if(res.data.resultData.editTodo){
                    await commit('updateTodo', {
                        editData: res.data.editData
                    });
                }
            }catch(err){
                console.log(err);
            }
        },
        async addSchedule({commit}, payload){
            try{
                const { id, userData } = payload;
                const res = await addTodo(id, userData);
                if(res.data.resultData){
                    await commit('addTodo', res.data.addData);
                }
            }catch(err){
                console.log(err);
            }
        },
        setSearchSchedule({commit}, payload){
            try {
                commit('setSearchData', payload);
                setTimeout(() => {
                    commit('resetSearchData');
                }, 3000);
            }catch(err){
                console.log(err);
            }
        }
    }
}