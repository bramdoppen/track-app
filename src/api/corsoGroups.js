import { db } from "@/functions/firebaseConfig.js";

const fetchCorsoGroups = () => {
	return db
		.collection("corsoGroups")
		.get()
		.then((querySnapshot) => {
      const arr = [];
			querySnapshot.forEach((doc) => {
				arr.push({ id: doc.id, name: doc.data().name });
			});
      return arr;
		});
};

export { fetchCorsoGroups };
