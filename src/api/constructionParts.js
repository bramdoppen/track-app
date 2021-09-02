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
    totalSurface: item.totalSurface,
		calculatedTotalAmountBoxes: item.calculatedTotalAmountBoxes,
		calculatedTotalAmountFlowers: item.calculatedTotalAmountFlowers,
    calculatedFlowers: item.calculatedFlowers,
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
    totalSurface: item.totalSurface,
    assignedBoxes: [],
    processedBoxes: [],
		processedTotalAmountFlowers: 0,
		calculatedTotalAmountBoxes: item.calculatedTotalAmountBoxes,
		calculatedTotalAmountFlowers: item.calculatedTotalAmountFlowers,
    calculatedFlowers: item.calculatedFlowers,
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

export { fetchAll, fetchSingle, createItem, updateItem, deleteItem };
