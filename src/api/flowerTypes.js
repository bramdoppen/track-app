import { db } from "@/functions/firebaseConfig.js";

const fetchFlowerTypes = () => {
	return db
		.collection("flowerTypes")
		.get()
		.then((querySnapshot) => {
			const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, name: doc.data().name, boxAmount: doc.data().boxAmount });
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
				return doc.data();
			} else {
				console.log("No such document!");
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
