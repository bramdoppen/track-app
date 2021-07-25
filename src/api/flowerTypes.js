import { db } from "@/functions/firebaseConfig.js";

const fetchFlowerTypes = () => {
	return db
		.collection("flowerTypes")
		.get()
		.then((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, name: doc.data().name });
			});
			return arr;
		});
};

const fetchSingleFlowerType = (id) => {
	return db
		.collection("flowerTypes")
		.doc(id)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return { id: doc.id, name: doc.data().name };
			}
		});
};

const setFlowerType = (id, flower) => {
	return db.collection("flowerTypes").doc(id).set(
		flower,
		{ merge: true },
	);
};

export { fetchFlowerTypes, fetchSingleFlowerType, setFlowerType };
