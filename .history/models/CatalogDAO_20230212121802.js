// injectDB injects this connection to the database

let petCollection;

module.exports = class CatalogDAO {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			petCollection = await connection.collection('catalog');
			console.log('Connected to MongoDB catalog');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in catalogDAO: ${err}`
			);
		}
	}

	static async createPet(petObject) {
		petObject.created_at = new Date();
		await petCollection.insertOne({ ...petObject });
	}

	static async updatePetById(petId, petObject) {
		try {
			const updateResponse = await petCollection.updateOne(
				{ _id: new ObjectId(petId) },
				{ $set: { ...petObject } }
			);
			return updateResponse;
		} catch (err) {
			console.log('Error in updatePetById: ', err);
			return { error: err };
		}
	}

	static async getPetById(petId) {
		console.log('petId', petId);
		return await petCollection.findOne({ _id: new ObjectId(petId) });
	}

	static async getUserPets(username) {
		return await petCollection.find({ currentUser: username }).toArray();
	}
};
