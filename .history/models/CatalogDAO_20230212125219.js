// injectDB injects this connection to the database
const { ObjectId } = require('mongodb');

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
		const caca = `ObjectId("${petId.id}")`;
		console.log();
		try {
			const pet = await petCollection.findOne({
				_id: new ObjectId('63e52df1acbd9c0db9b94bac'),
			});
			return pet;
		} catch (err) {
			console.log('Error in getPetById: ', err);
			return { error: err };
		}
	}

	static async getUserPets(username) {
		return await petCollection.find({ currentUser: username }).toArray();
	}
};
