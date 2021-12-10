import { createStore } from 'vuex';
import user from './user.js';
import todo from './todo.js';

import createPersistedState from 'vuex-persistedstate';

export default createStore({
    modules: {
        user,
        todo
    },
    plugins: [
        createPersistedState()
    ]
})