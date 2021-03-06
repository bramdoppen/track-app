import { createStore } from "vuex";
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
			5: "Reservering Reparatie",
			6: "Verkocht",
		},
		currAction: null,
		currActionName: null,
		currConstructionGroup: null,
		s: null,
		sellReason: null,
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
		userSetActivation(state) {
			state.user.isActivated = true;
		},
		userLogOut(state) {
			state.user = null;
			state.corsoGroup = null;
		},
		userPreferenceChange(state, obj) {
			state.user.preferences[obj.type] = obj.val;
		},
		changeStartCol(state, payload) {
			state.printerStartCol = payload;
		},
		changeCurrentAction(state, payload) {
			state.currAction = payload;
			if (payload > -1) {
				state.currActionName = state.places[payload];
			} else {
				state.currActionName = null;
			}
		},
		changeConstructionPart(state, payload) {
			if (payload) {
				state.currConstructionPart = {
					name: payload.name,
					id: payload.id,
				};
			}
		},
		changeSellReason(state, payload) {
			state.sellReason = payload;
		},
	},
	actions: {
		userLogin({ commit }, user) {
			commit("userLogin", user);
		},
		userSetActivation({ commit }) {
			commit("userSetActivation");
		},
		userLogOut({ commit }) {
			commit("userLogOut");
		},
		userPreferenceChange({ commit }, obj) {
			commit("userPreferenceChange", obj);
		},
	},
	modules: {},
	plugins: [createPersistedState()],
});
