export default {
    namespaced: true,
    state: () => {
        return {
            userId: null,
            isLogin: false,
            modalStatus: false,
        }
    },
    getters: {},
    mutations: {
        updateState(state, payload){
            state.userId = payload.userData;
            state.isLogin = true;
        },
        deleteState(state){
            state.userId = null,
            state.isLogin = false;
        },
        showModal(state){
            state.modalStatus = !state.modalStatus;
        }
        
    },
    actions: {
        async login({ commit }, userData){
            commit('updateState', {
                userData
            })
        },
        async logout({ commit }){
            commit('deleteState');
            commit('todo/deleteTodos', null, {root:true});
        },
        async leave({ commit }){
            commit('deleteState');
        }
    },
}