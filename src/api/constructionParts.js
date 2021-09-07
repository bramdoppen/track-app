import { db } from "@/functions/firebaseConfig.js";
import store from "@/store";

const fetchAll = () => {
	return db
		.collection("constructionParts")
		.get()
		.then((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, data: doc.data() });
			});
			return arr;
		});
};

const fetchSingle = (id) => {
	return db
		.collection("constructionParts")
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

const updateItem = (id, item) => {
  const currUser = store.state.user;
	const currDate = new Date();
	return db.collection("constructionParts").doc(id).update({
    name: item.name,
    description: item.description,
    totalSurface: item.totalSurface,
    calculatedFlowers: item.calculatedFlowers,
		calculatedTotalAmountBoxes: item.calculatedTotalAmountBoxes,
		calculatedTotalAmountFlowers: item.calculatedTotalAmountFlowers,
    correctionFlowers: item.correctionFlowers,
		correctionTotalAmountBoxes: item.correctionTotalAmountBoxes,
		correctionTotalAmountFlowers: item.correctionTotalAmountFlowers,
    updatedOn: currDate,
    updatedBy: {
      id: currUser.uid,
      name: currUser.displayName,
    },
  });
};

const updateMagicLink = (id, item) => {
  const currUser = store.state.user;
	const currDate = new Date();
	const correctionFlowersAsIndication = item.correctionFlowers.map(corr => {return {indication: true, ...corr}});
	return db.collection("constructionParts").doc(id).set({
    correctionFlowers: correctionFlowersAsIndication,
		correctionTotalAmountBoxes: item.correctionTotalAmountBoxes,
		correctionTotalAmountFlowers: item.correctionTotalAmountFlowers,
    updatedOn: currDate,
    updatedBy: {
      id: currUser.uid,
      name: currUser.displayName,
    },
  }, {merge: true});
};

const completePart = (id) => {
  const currUser = store.state.user;
	const currDate = new Date();
	return db.collection("constructionParts").doc(id).update({
    isCompleted: true,
    updatedOn: currDate,
    updatedBy: {
      id: currUser.uid,
      name: currUser.displayName,
    },
  });
};

const createItem = function(item) {
	const currUser = store.state.user;
	const currDate = new Date();
	const currGroup = store.state.corsoGroup || store.state.user.corsoGroup;
	return db.collection("constructionParts").add({
    name: item.name,
    description: item.description,
    totalSurface: item.totalSurface,
    assignedBoxes: [],
    processedBoxes: [],
		processedTotalAmountFlowers: 0,
		magicLink: item.magicLink,
		calculatedFlowers: item.calculatedFlowers,
		calculatedTotalAmountBoxes: item.calculatedTotalAmountBoxes,
		calculatedTotalAmountFlowers: item.calculatedTotalAmountFlowers,
    correctionFlowers: item.correctionFlowers,
		correctionTotalAmountBoxes: item.correctionTotalAmountBoxes,
		correctionTotalAmountFlowers: item.correctionTotalAmountFlowers,
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
	});
};

const deleteItem = function(id, item) {
	console.log(item.assignedBoxes.length == 0 && item.processedTotalAmountFlowers == 0)
	if(item.assignedBoxes.length == 0 && item.processedTotalAmountFlowers == 0) {
		return db.collection("constructionParts").doc(id).delete();
	}
}

export { fetchAll, fetchSingle, createItem, updateItem, updateMagicLink, completePart, deleteItem };
