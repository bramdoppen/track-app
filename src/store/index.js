import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    corsoGroup: null,
  },
  mutations: {
    userLogin(state, user) {
			state.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				permissions: user.permissions,
			};
		},
		setCorsoGroup(state, corsoGroup) {
			state.corsoGroup = {
				id: corsoGroup.id,
				name: corsoGroup.name,
			};
		},
  },
  actions: {
  },
  modules: {
  }
})
