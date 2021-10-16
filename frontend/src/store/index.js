import { createStore } from 'vuex';
import user from './user.js';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    modules: {
        user
    },
    plugins: [
        createPersistedState()
    ]
})