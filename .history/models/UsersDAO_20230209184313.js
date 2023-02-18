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
};
