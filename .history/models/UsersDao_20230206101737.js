// injectDB injects this connection to the database

let collection;

module.exports = class UsersDao {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			collection = await connection.collection('users');
			console.log('Connected to MongoDB');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in usersDAO: ${err}`
			);
		}
	}

	static async createUser(userData) {
		userData.created_at = new Date();
		userData.login_attempts = 0;
		await collection.insertOne({ ...userData });
	}

	static async getUserByUsername(username) {
		return await collection.findOne({ username });
	}
};
