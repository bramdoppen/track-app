import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
    corsoGroup: null,
    printerStartCol: 1,
  },
  mutations: {
    userLogin(state, user) {
			state.user = user;
			state.corsoGroup = user.corsoGroup;
		},
    changeStartCol(state, payload) {
			state.printerStartCol = payload;
		},
  },
  actions: {
		userLogin({commit}, user) {
			commit('userLogin', user)
		},
  },
  modules: {
  },
	plugins: [createPersistedState()],
})
