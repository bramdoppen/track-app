import { fb, db } from "@/functions/firebaseConfig.js";

const addNewUserToDb = (user) => {
	return db
		.collection("users")
		.doc(user.uid)
		.set({
			email: user.email,
			corsoGroup: user.corsoGroup,
			displayName: user.displayName,
			uid: user.uid,
			isAdmin: false,
			isActivated: false,
			permissionLevel: 0,
		});
};

const getUserFromDb = (userId) => {
	return db
		.collection("users")
		.doc(userId)
		.get();
};

const registerUser = (user) => {
	return fb
		.auth()
		.createUserWithEmailAndPassword(user.email, user.password)
		.then((userResponse) => {
			user.uid = userResponse.user.uid;
			userResponse.user.corsoGroup = user.corsoGroup;
			addNewUserToDb(user);
			return userResponse.user;
		});
};

const loginUser = (user) => {
	return fb
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((userResponse) => {
			let fullUser = {};
			// check if there is a record of this user(email) in database and get values.
			return getUserFromDb(userResponse.user.uid)
				.then((doc) => {
					if (doc.exists) {
						fullUser = doc.data();
						fullUser.uid = userResponse.user.uid;
					} else {
						throw { message: "(ERR:doc does not exist): Er gaat iets mis met het ophalen van de gebruikersdata" };
					}
					return fullUser;
				})
				.catch(() => {
					throw { message: "(ERR: catch): Er gaat iets mis met het ophalen van de gebruikersdata" };
				});
		})
		.then((userResponse) => {
			return userResponse;
		});
};

const logoutUser = () => {
	return fb
		.auth()
		.signOut()
		.catch(() => {
			throw { message: "(ERR: catch): Er gaat iets mis met het uitloggen" };
		});
};

export { loginUser, logoutUser, getUserFromDb, registerUser };
