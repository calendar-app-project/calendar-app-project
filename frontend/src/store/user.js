export default {
    namespaced: true,
    state: () => {
        return {
            userId: null,
            isLogin: false
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
        },
        async leave({ commit }){
            commit('deleteState');
        }
    },
}