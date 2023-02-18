const petsDAO = require('../models/CatalogDAO');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addPet(req, res) {
		console.log('req.body', req.body);
		try {
			const petObject = {
				pet_id: req.body.id,
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
			petObject.currentUser = req.body.currentUser;

			await CatalogDAO.createPet(petObject);
			console.log('pet created', petObject);
			return res.status(200).json({
				success: true,
				message: 'pet created',
				petObj: petObject,
			});
		} catch (err) {
			console.log('Error in petsController.Signup: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async Login(req, res) {
		try {
			const pet = await CatalogDAO.getPetByID(req.body.petname);
			// console.log('pet passowrd', pet.password);
			// console.log('sha', sha256(req.body.password));

			if (!pet || pet.password !== sha256(req.body.password)) {
				console.log('Wrong petname or password');
				return res.status(400).json({
					success: false,
					message: 'Wrong petname or password',
				});
			}
			const token = jwt.sign(
				{ pet_id: pet._id, petname: pet.petname },
				process.env.JWT_SECRET
			);
			// console.log('token', token);
			return res.status(200).json({
				success: true,
				message: 'pet logged in',
				token,
			});
		} catch (err) {
			console.log('Error in petsController.Login: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async updatepet(petData) {
		logger('log me');
		await collection.updateOne({ _id: petData._id }, { $set: { petData } });
	}

	static async Auth(req, res) {
		console.log('req.header', req);
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log('decoded', decoded);
			const pet = await CatalogDAO.getPetByID(decoded.petname);
			console.log('pet', pet);
			if (!pet) {
				console.log('Unauthorized');
				return res.status(401).json({
					success: false,
					message: 'Unauthorized',
				});
			}
			console.log('Authorized');
			return res.status(200).json({
				success: true,
				message: 'Authorized',
				petObj: {
					petname: pet.petname,
					firstName: pet.firstName,
					lastName: pet.lastName,
					phoneNumber: pet.phoneNumber,
				},
			});
		} catch (err) {
			console.log('Error in petsController.Auth: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
