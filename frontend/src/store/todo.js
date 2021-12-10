import { getTodo } from "../api";

export default {
    namespaced: true,
    state: () => {
        return {
            modalStatus: false,
            date:{},
            clickedDate:0,
            todos:[],
        }
    },
    getters: {
        filterTodos :state => {
            return state.todos.filter(todo => todo.date === state.clickedDate)
        },
    },
    mutations: {
        showModal(state){
            state.modalStatus = !state.modalStatus;
        },
        updateDate(state, payload){
            state.date = {
               year: payload.year,
               month: payload.month
            };
        },
        updateClickedDate(state, payload) {
            state.clickedDate = payload;
        },
        updateTodos(state, payload) {
            //state.todos.push(...payload);
            
            for(let i = 0; i<payload.length; i++){
                state.todos.push(payload[i]);
            }/*
            const { postId, title, month, date, startTime, endTime, memo } = payload;
            state.todos = {
                postId,
                month,
                date,
                title,
                startTime,
                endTime,
                memo
            }*/
        },
        deleteClickedDateState(state){
            state.clickedDate = null;
        },
        deleteTodos(state){
            state.todos =[];
        }
        
    },
    actions: {
        async getSchedule({state, commit, rootState}){
            try{
                const id = rootState.user.userId;
                const res = await getTodo(id, state.date.year, state.date.month);
                if(res.data.array){
                    await commit('updateTodos', res.data.array);
                    console.log('get res:', res);
                }
            }catch(err){
                console.log(err);
            }
        }
    }
}