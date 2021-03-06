import { fb, db } from "@/functions/firebaseConfig.js";
import store from "@/store";

const fetchAllBoxes = () => {
	let request = db.collection("boxes").where("belongsToCorsoGroup.id", "==", store.state.corsoGroup.id)

	return request.get()
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
	return db.collection("boxes").add({
		state: null,
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
		updatedOn: currDate,
		updatedBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
		updateLog: [
			{
				id: 1,
				message: "Label aangemaakt",
				fromState: null,
				toState: null,
				updatedOn: currDate,
				updatedBy: {
					id: currUser.uid,
					name: currUser.displayName,
				},
			},
		],
	});
};

const updateFlowerType = function(kratId, fromType, newType) {
	const currDate = new Date();
	const currUser = store.state.user;

	// Build update message
	const newUpdate = {
		message: `Bloemtype veranderd. Van ${fromType.name} naar ${newType.name}`,
		updatedOn: currDate,
		updatedBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
	};
	
	const updatedFields = {
		flowerType: {
			id:	newType.id,
			name:	newType.name,
			boxAmount:	newType.boxAmount,
			colorHex:	newType.colorHex,
		},
		updatedOn: currDate,
		updatedBy: {
			id: currUser.uid,
			name: currUser.displayName,
		},
		updateLog: fb.firestore.FieldValue.arrayUnion(newUpdate),
	}

	return db
		.collection("boxes")
		.doc(kratId)
		.update(updatedFields);
}


const updateBoxState = function(kratId, prevState, newState, constructionPart, amountLeftInBox, customMessage) {
	const currDate = new Date();
	const currUser = store.state.user;
	const places = store.state.places;


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
		} else if(prevState === null) {
			return `Statuswijziging, van "Label aangemaakt" naar ${places[newState]}`;
		} else {
			return `Statuswijziging, van ${places[prevState]} naar ${places[newState]}`;
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
		message: customMessage ? customMessage : getUpdatedMessage(),
		fromState: prevState,
		toState: newState,
		amountLeftInBox: amountLeftInBox ? amountLeftInBox : null,
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
	if(amountLeftInBox !== null) {
		updatedFields.amountInBox = amountLeftInBox
	}

	return db
		.collection("boxes")
		.doc(kratId)
		.update(updatedFields);
};
export { createBox, updateBoxState, fetchAllBoxes, fetchSingleBox, updateFlowerType};
