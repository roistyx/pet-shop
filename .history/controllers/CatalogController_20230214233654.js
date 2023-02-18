const CatalogDAO = require('../models/CatalogDAO');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });

// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addPet(req, res) {
		try {
			let owner;
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
				// adoptionStatus: req.body.adoptionStatus,
				created_by: req.currentUser._id,
				currentOwner: [
					// req.currentUser._id,
					// req.body.adoptionStatus,
					req.currentUser._id,
					,
					req.body.adoptionStatus,
					'some other owner',
					'not adopt',
				],
			};
			petObject.petCreatedByUsername = req.currentUser.username;

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
	static async petListByUserId(req, res) {
		const userId = req.params;

		try {
			const petListById = await CatalogDAO.getUserPets(userId);
			// console.log('petList', petListById[0]._id);
			return res.status(200).json({
				success: true,
				message: 'pet list',
				petList: petListById,
			});
		} catch (err) {
			console.log('Error in CatalogController.PetList: ', err);
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

	static async searchPetCatalog(req, res) {
		const searchQuery = req.query;
		console.log('searchQuery', searchQuery);
		try {
			const petList = await CatalogDAO.getPetCatalog(searchQuery);
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
