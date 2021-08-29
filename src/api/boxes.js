import { fb, db } from "@/functions/firebaseConfig.js";
import store from "@/store";

const addBox = () => {
	return db
		.collection("boxes")
		.get()
		.then((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, name: doc.data().name });
			});
			return arr;
		});
};

const fetchAllBoxes = (limit) => {
	const pageLimit = limit ? limit : 100;
	return db
		.collection("boxes").limit(pageLimit)
		.get()
		.then((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, data: doc.data() });
			});
			return arr;
		});
};

const fetchSingleBox = (id) => {
	return db
		.collection("boxes")
		.doc(id)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return doc.data();
			} else {
				console.log("No such document!");
			}
		});
};

const createBox = function(flower) {
	const currUser = store.state.user;
	const currDate = new Date();
	const currGroup = store.state.corsoGroup || store.state.user.corsoGroup;
	console.log(flower)
	return db.collection("boxes").add({
		state: 0,
		amountInBox: flower.boxAmount,
		flowerType: flower,
		belongsToConstructionPart: null,
		belongsToCorsoGroup: {
			id: currGroup.id,
			name: currGroup.name,
		},
		createdOn: currDate,
		createdBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
		updatedOn: null,
		updatedBy: null,
		updateLog: [
			{
				id: 1,
				message: "Created",
				fromState: 0,
				toState: 0,
				updatedOn: currDate,
				updatedBy: {
					id: currUser.uid,
					name: currUser.displayName,
				},
			},
		],
	});
};

const updateBoxState = function(kratId, prevState, newState, constructionPart, amountLeftInBox) {
	const currDate = new Date();
	const currUser = store.state.user;

	// Get updated message
	const getUpdatedMessage = () => {
		if (newState == 4) {
			return "Afgerond";
		} else if (newState == 3) {
			if (constructionPart && constructionPart.id) {
				return `Bij wagenonderdeel: ${constructionPart.name}`;
			} else {
				return `Bij wagenonderdeel (onbekend onderdeel)`;
			}
		} else {
			return `Statuswijziging, van ${prevState} naar ${newState}`;
		}
	};

	// Get constructionpart
	const getConstructionPart = () => {
		if (constructionPart && constructionPart.id && newState < 4) {
			return {
				id: constructionPart.id,
				name: constructionPart.name,
			};
		} else {
			return null;
		}
	};

	// Build update message
	const newUpdate = {
		message: getUpdatedMessage(),
		fromState: prevState,
		toState: newState,
		amountLeftInBox: amountLeftInBox,
		updatedOn: currDate,
		updatedBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
	};

	const updatedFields = {
		state: newState,
		belongsToConstructionPart: getConstructionPart(),
		updatedOn: currDate,
		updatedBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
		updateLog: fb.firestore.FieldValue.arrayUnion(newUpdate),
	}

	// Only set amountleftinbox when specified
	if(amountLeftInBox) {
		updatedFields.amountInBox = amountLeftInBox
	}

	return db
		.collection("boxes")
		.doc(kratId)
		.update(updatedFields);
};
export { createBox, addBox, updateBoxState, fetchAllBoxes, fetchSingleBox};
