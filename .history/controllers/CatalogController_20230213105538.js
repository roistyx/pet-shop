const CatalogDAO = require('../models/CatalogDAO');

// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addPet(req, res) {
		try {
			const petObject = {
				pet_id: req.body.pet_id,
				specie: req.body.specie,
				breed: req.body.breed,
				sex: req.body.sex,
				age: req.body.age,
				weight: req.body.weight,
				height: req.body.height,
				color: req.body.color,
				hypoallergenic: req.body.hypoallergenic,
				name: req.body.name,
				bio: req.body.bio,
				profilePic: req.body.profilePic,
				adoptionStatus: req.body.adoptionStatus,
			};
			petObject.petCreatedByUsername = req.currentUser.username;
			// console.log('req.body.currentUser.username', req.currentUser);

			const insertedPet = await CatalogDAO.createPet(petObject);
			console.log('pet created', petObject);
			return res.status(200).json({
				success: true,
				message: 'pet created',
				petObj: insertedPet,
			});
		} catch (err) {
			console.log('Error in CatalogController.addPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async updatePet(req, res) {
		let petObject = {
			pet_id: req.body.pet_id,
			specie: req.body.specie,
			breed: req.body.breed,
			sex: req.body.sex,
			age: req.body.age,
			weight: req.body.weight,
			height: req.body.height,
			color: req.body.color,
			hypoallergenic: req.body.hypoallergenic,
			name: req.body.name,
			bio: req.body.bio,
			profilePic: req.body.profilePic,
			adoptionStatus: req.body.adoptionStatus,
		};
		try {
			const petId = req.params.id;

			const isPetExist = await CatalogDAO.getPetById(petId);
			if (!isPetExist)
				return {
					success: false,
					message: 'pet does not exist',
				};
			const updatedPet = await CatalogDAO.updatePetById(petId, petObject);
			console.log('petObject', petObject);
			return res.status(200).json({
				success: true,
				message: 'Pet Updated',
				petObj: updatedPet,
			});
		} catch (err) {
			console.log('Error in CatalogController.updatePet: ', err);
			return res.status(400).json({
				success: false,

				message: 'Could not update pet',
			});
		}
	}

	static async petListByUserId(req, res) {
		try {
			const petListById = await CatalogDAO.getUserPets(
				req.currentUser.username
			);
			console.log('petList', petListById);
			return res.status(200).json({
				success: true,
				message: 'pet list',
				petList: petList,
			});
		} catch (err) {
			console.log('Error in CatalogController.PetList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
	static async getPetById(req, res) {
		try {
			const petId = req.params.id;
			const isPetExist = await CatalogDAO.getPetById(petId);
			if (!isPetExist)
				return {
					success: false,
					message: 'pet does not exist',
				};
			const pet = await CatalogDAO.getPetById(petId);
			console.log('pet', pet);
			return res.status(200).json({
				success: true,
				message: 'pet',
				pet: pet,
			});
		} catch (err) {
			console.log('Error in CatalogController.getPetById: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async petCatalog(req, res) {
		console.log('req.currentUser', req.currentUser);
		try {
			const petList = await CatalogDAO.getPetCatalog();
			console.log('petList', petList);
			return res.status(200).json({
				success: true,
				message: 'pet list',
				petList: petList,
			});
		} catch (err) {
			console.log('Error in CatalogController.petList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get pet list',
			});
		}
	}

	static async searchPet(req, res) {
		const criterion = req.query;
		console.log('criterion', criterion);
		// try {
		// 	const petList = await CatalogDAO.searchPetByTerm(criterion);
		// 	console.log('petList', petList);
		// 	return res.status(200).json({
		// 		success: true,
		// 		message: 'pet list',
		// 		petList: petList,
		// 	});
		// } catch (err) {
		// 	console.log('Error in CatalogController.searchPet: ', err);
		// 	return res.status(500).json({
		// 		success: false,
		// 		message: 'Unknown error',
		// 	});
		// }
	}

	static async deletePet(req, res) {
		try {
			const petId = req.params.id;

			const isPetExist = await CatalogDAO.getPetById(petId);
			if (!isPetExist)
				return {
					success: false,
					message: 'pet does not exist',
				};
			const deletePetById = await CatalogDAO.deletePetById(petId);
			console.log('deletePetById', deletePetById);
			return res.status(200).json({
				success: true,
				message: 'pet deleted',
				petObj: deletePetById,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'could not delete pet',
			});
		}
	}
};
