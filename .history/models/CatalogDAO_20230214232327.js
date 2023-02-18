// injectDB injects this connection to the database
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

let petCollection;

const myObj = {
	success: true,
	message: 'pet list',
	petList: [
		{
			_id: '63ebf26c369e218edb6bc844',
			pet_id: '2435wrfsfg',
			specie: 'Cat',
			breed: 'Happy',
			sex: 'Male',
			age: '345',
			weight: '30',
			height: '24',
			color: 'black',
			hypoallergenic: 'yes',
			name: 'Rexi',
			bio: 'ugly dog no-one wants',
			profilePic: 'fwef32r23.jpg',
			adoptionStatus: 'adopt',
			created_by: '63eb7ea4b07ff4bb9032269c',
			currentOwner: ['63eb7ea4b07ff4bb9032269c', 'adopt'],
			petCreatedByUsername: 'dream@example.com',
			created_at: '2023-02-14T20:43:24.585Z',
		},
	],
};

console.log('myObj', myObj.petList[0]._id);

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
		console.log('petObject', petObject);
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
		return await petCollection.findOne({
			_id: new ObjectId(petId),
		});
	}

	static async getPetCatalog(searchQuery) {
		return await petCollection.find(searchQuery).toArray();
	}

	static async getUserPets(owner) {
		const userId = new ObjectId(owner);
		// const caca = petCollection.createIndex();
		const results = await petCollection
			.find({ currentOwner: 'not adopt' })
			.toArray();

		console.log('results', results);
		// return await petCollection.aggregate({ $eq: 'cacame' }).toArray();
		return results;
	}

	static async deletePetById(petId) {
		try {
			console.log('petId', petId);
			const deleteResponse = await petCollection.deleteOne({
				_id: new ObjectId(petId),
			});
			return deleteResponse;
		} catch (err) {
			console.log('Error in deletePetById: ', err);
			return { error: err };
		}
	}
};
