export default {
    namespaced: true,
    state: () => {
        return {
            userId: null,
            isLogin: false,
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