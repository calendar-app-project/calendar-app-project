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
        updateUserState(state, payload){
            state.userId = payload.userData;
            state.isLogin = true;
        },
        deleteUserState(state){
            state.userId = null,
            state.isLogin = false;
        },
        showSuccessModal(state){
            state.modalStatus = !state.modalStatus;
        }
        
    },
    actions: {
        async login({ commit }, userData){
            commit('updateUserState', {
                userData
            })
        },
        async logout({ commit }){
            commit('deleteUserState');
            commit('todo/deleteTodosPerMth', null, {root:true});
        },
        async leave({ commit }){
            commit('deleteUserState');
            commit('todo/deleteTodosPerMth', null, {root:true});
        }
    },
}