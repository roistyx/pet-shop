// injectDB injects this connection to the database

let collection;

module.exports = class CatalogDAO {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			collection = await connection.collection('catalog');
			console.log('Connected to MongoDB');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in usersDAO: ${err}`
			);
		}
	}

	static async createPet(userData) {
		console.log('Hello world');
		userData.created_at = new Date();
		userData.login_attempts = 0;
		await collection.insertOne({ ...userData });
	}

	static async getPetById(UserId) {
		return await collection.findOne({ _id: new ObjectId(UserId) });
	}
};
