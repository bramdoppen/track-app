import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    user: null,
    corsoGroup: null,
    printerStartCol: 1,
    places: {
			0: "In magazijn",
			1: "Op spijkertafel",
			2: "Gespijkerd",
			3: "Op steiger",
			4: "Afgerond",
		},
    currAction: null,
		currActionName: null,
		currConstructionGroup: null,
		currConstructionPart: {
			name: null,
			id: null,
		},
  },
  mutations: {
    userLogin(state, user) {
			state.user = user;
			state.corsoGroup = user.corsoGroup;
		},
    changeStartCol(state, payload) {
			state.printerStartCol = payload;
		},
    changeCurrentAction(state, payload) {
			state.currAction = payload;
			state.currActionName = state.places[payload];
		},
    changeConstructionPart(state, payload) {
			state.currConstructionPart = payload;
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
