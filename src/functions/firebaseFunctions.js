import { db } from "./firebaseConfig.js";


// const createKrat = function(flower) {
// 	const currUser = store.state.user;
// 	const currDate = new Date();
// 	const currGroup = store.state.currentCorsoGroup;
// 	return db.collection("boxes").add({
// 		state: 0,
// 		flowerType: flower,
// 		belongsToConstructionPart: null,
// 		belongsToCorsoGroup: {
// 			id: currGroup.id,
// 			name: currGroup.name,
// 		},
// 		createdOn: currDate,
// 		createdBy: {
// 			id: currUser.id,
// 			name: currUser.name,
// 		},
// 		updatedOn: null,
// 		updatedBy: null,
// 		updateLog: [
// 			{
// 				id: 1,
// 				message: "Created",
// 				fromState: 0,
// 				toState: 0,
// 				updatedOn: currDate,
// 				updatedBy: {
// 					id: currUser.id,
// 					name: currUser.name,
// 				},
// 			},
// 		],
// 	});
// };

// const updateKratState = function(kratId, prevState, newState, constructionPart) {
// 	const currDate = new Date();
// 	const currUser = store.state.user;

// 	// Get updated message
// 	const getUpdatedMessage = () => {
// 		if (newState == 4) {
// 			return "Afgerond";
// 		} else if (newState == 3) {
// 			if (constructionPart && constructionPart.id) {
// 				return `Bij wagenonderdeel: ${constructionPart.name}`;
// 			} else {
// 				return `Bij wagenonderdeel (onbekend onderdeel)`;
// 			}
// 		} else {
// 			return `Statuswijziging, van ${prevState} naar ${newState}`;
// 		}
// 	};

// 	// Get constructionpart
// 	const getConstructionPart = () => {
// 		if (constructionPart && constructionPart.id && newState < 4) {
// 			return {
// 				id: constructionPart.id,
// 				name: constructionPart.name,
// 			};
// 		} else {
// 			return null;
// 		}
// 	};

// 	// Build update message
// 	const newUpdate = {
// 		message: getUpdatedMessage(),
// 		fromState: prevState,
// 		toState: newState,
// 		updatedOn: currDate,
// 		updatedBy: {
// 			id: currUser.id,
// 			name: currUser.name,
// 		},
// 	};

// 	return db
// 		.collection("boxes")
// 		.doc(kratId)
// 		.update({
// 			state: newState,
// 			belongsToConstructionPart: getConstructionPart(),
// 			updatedOn: currDate,
// 			updatedBy: {
// 				id: currUser.id,
// 				name: currUser.name,
// 			},
// 			updateLog: fb.firestore.FieldValue.arrayUnion(newUpdate),
// 		});
// };

const getAllFromDoc = function(doc) {
	return db.collection(doc).get();
};

// const userSignOut = (router) => {
// 	// Even extra vragen of de user wil uitloggen.
// 	const confirmDialog = window.confirm("Weet je zeker dat je uit wil loggen?");
// 	if (confirmDialog) {
// 		fb.auth()
// 			.signOut()
// 			.then(function() {
// 				window.localStorage.setItem("isLoggedIn", false);
// 				store.commit("userLoggedIn", {
// 					newState: false,
// 				});
// 				router.push({ name: "login" });
// 			})
// 			.catch(function(error) {
// 				console.log(error);
// 			});
// 	}
// };

export { getAllFromDoc };
