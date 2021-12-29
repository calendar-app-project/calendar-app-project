import { getTodo, deleteTodo, editTodo, addTodo, searchTodo } from "../api";

export default {
    namespaced: true,
    state: () => {
        return {
            modalStatus: false,
            date:{},
            clickedDate:0,
            todos:[],
            searchResult:[],
            searchedData:{
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
        toggleModal(state){
            state.modalStatus = !state.modalStatus;
        },
        setDate(state, payload){
            state.date = {
               year: payload.year,
               month: payload.month
            };
        },
        setClickedDate(state, payload) {
            state.clickedDate = payload;
        },
        deleteClickedDate(state){
            state.clickedDate = null;
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
        setSearchResult(state,payload){
            payload.forEach(todo => state.searchResult.push(todo));
        },
        setSearchedData(state, {searchedPostId, searchedYear, searchedMonth}) {
            state.searchedData.postId = searchedPostId;
            state.searchedData.year = searchedYear;
            state.searchedData.month = searchedMonth;
        }
    },
    actions: {
        async getSchedule({state, commit, rootState}){
            try{
                const id = rootState.user.userId;
                const res = await getTodo(id, state.date.year, state.date.month);
                if(res.data.array){
                    await commit('setTodos', res.data.array);
                }
            }catch(err){
                console.log(err);
            }
        },
        async deleteSchedule({commit}, postId){
            try{
                const res = await deleteTodo(postId);
                if(res.data.resultData){
                    await commit('removeTodo',postId);
                }
            }catch(err){
                console.log(err);
            }
        },
        async editSchedule({commit}, payload){
            try {
                //const { postId, editData } = payload;
                const res = await editTodo(payload.post_id, payload);
                if(res.data.resultData){
                    await commit('updateTodo', {
                        postId: payload.post_id,
                        editData: payload
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
        async searchSchedule({commit, rootState}, payload){
            try{
                const id = rootState.user.userId;
                const res = await searchTodo(id, payload);
                if(res.data.searchResult){
                    await commit ('setSearchResult', res.data.searchResult);
                }
            }catch(err){
                console.log(err);
            }
        }
    }
}