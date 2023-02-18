// injectDB injects this connection to the database
const { ObjectId } = require('mongodb');

let userCollection;

module.exports = class UsersDao {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			userCollection = await connection.collection('users');
			console.log('Connected to MongoDB users');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in usersDAO: ${err}`
			);
		}
	}
	static async getUserById(UserId) {
		// console.log('UserId', UserId);
		// return await collection.findOne({ _id: new ObjectId(UserId) });
		return await userCollection.findOne({ _id: new ObjectId(UserId) });
	}

	static async createUser(userData) {
		userData.created_at = new Date();
		userData.login_attempts = 0;
		await userCollection.insertOne({ ...userData });
	}

	static async getUserByUsername(username) {
		return await userCollection.findOne({ username });
	}

	static async updateUserById(UserId, userData) {
		try {
			const updateResponse = await userCollection.updateOne(
				{ _id: new ObjectId(UserId) },
				{ $set: { ...userData } }
			);
			return updateResponse;
		} catch (err) {
			console.log('Error in updateUserById: ', err);
			return { error: err };
		}
	}

	static async savePet(userId, petId) {
		console.log('userId', userId);
		console.log('petId', petId);
		try {
			const updateResponse = await userCollection.updateOne(
				{ _id: new ObjectId(userId) },
				{ $push: { pets: petId } }
			);
			return updateResponse;
		} catch (err) {
			console.log('Error in savePet: ', err);
			return { error: err };
		}
	}

	static async deleteSavedPet(userId, petId) {
		console.log('userId', userId);
		console.log('petId', petId);
		try {
			const updateResponse = await userCollection.updateOne(
				{ _id: new ObjectId(userId) },
				{ $pull: { pets: petId } }
			);
			return console.log('updateResponse', updateResponse);
		} catch (err) {
			console.log('Error in deleteSavedPet: ', err);
			return { error: err };
		}
	}
};
