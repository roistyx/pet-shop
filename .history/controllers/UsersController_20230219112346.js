const UsersDAO = require('../models/UsersDAO');

const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const {
	SignupValidations,
	LoginValidations,
	StatusValidations,
} = require('./validations/UsersValidations');
const CatalogDAO = require('../models/CatalogDAO');
const { ObjectId } = require('mongodb');

module.exports = class UsersController {
	static async Signup(req, res) {
		// console.log('req.body', req.body);

		try {
			const userObject = {
				username: req.body.username,
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
			};

			const exitingUser = await UsersDAO.getUserByUsername(userObject.username);
			const validRequest = SignupValidations(userObject);
			if (!validRequest) {
				console.log('Missing required fields');
				return res.status(400).json({
					success: false,
					message: 'Invalid request',
				});
			}
			if (exitingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}

			userObject.password = sha256(userObject.password);

			await UsersDAO.createUser(userObject);
			console.log('User created', userObject);
			return res.status(200).json({
				success: true,
				message: 'User created',
				userObj: userObject,
			});
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async Login(req, res) {
		try {
			// const userObject = {
			// 	username: req.body.username,
			// 	password: req.body.password,
			// };
			console.log('req.body.username', req.body.username);

			const user = await UsersDAO.getUserByUsername(req.body.username);
			console.log('user', user);
			const validRequest = LoginValidations(req.body);
			console.log('validRequest', validRequest);
			if (!validRequest) {
				return res.status(400).json({
					success: false,
					message: 'Please enter username and password',
				});
			}

			if (!user || user.password !== sha256(req.body.password)) {
				console.log('Wrong username or password');
				return res.status(400).json({
					success: false,
					message: 'Wrong username or password',
				});
			}

			// await UsersDAO.getUserById('63e206319ca263ccfef06d8f');
			console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
			const token = jwt.sign(
				{ user_id: user._id, username: user.username },
				process.env.JWT_SECRET
			);
			const userProfile = await UsersDAO.getUserById(user._id);
			console.log('userProfile', userProfile);
			return res.status(200).json({
				success: true,
				message: 'User logged in',
				userProfile,
				token,
			});
		} catch (err) {
			console.log('Error in UsersController.Login: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async getUser(req, res) {
		console.log('req.params', req.params);
		const userId = req.params;
		const getUserObject = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
		};
		try {
			const user = await UsersDAO.getUserById(userId);

			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'User not found',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'User found',
				user: getUserObject,
			});
		} catch (err) {
			console.log('Error in UsersController.getUser: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get user',
			});
		}
	}

	static async updateUser(req, res) {
		const userId = req.params;
		const verifiedUserid = new ObjectId(userId);
		console.log(new ObjectId(userId));
		console.log(req.currentUser._id);
		if (req.currentUser._id !== verifiedUserid) {
			console.log('You are not authorized to update this user');
		}

		const updatedUserObject = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
		};

		try {
			const user = await UsersDAO.getUserById(userId);

			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'User not found',
				});
			}

			await UsersDAO.updateUserById(userId, updatedUserObject);
			console.log('User updated', updatedUserObject);
			return res.status(200).json({
				success: true,
				message: 'User updated',
				user: updatedUserObject,
			});
		} catch (err) {
			console.log('Error in UsersController.updateUser: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not update user',
			});
		}
	}

	static async savePet(req, res) {
		try {
			const petId = req.params.id;
			const petObj = await CatalogDAO.getPetById(petId);
			const currentUserId = req.currentUser._id;
			console.log('currentUserId log', currentUserId);

			console.log('petId', petId);

			if (!petObj)
				return res.status(400).json({
					success: false,
					message: 'Your are the owner of this pet or pet does not exist',
				});
			const savedPet = await UsersDAO.savePet(currentUserId, petId);
			console.log('savedPet', savedPet);
			return res.status(200).json({
				success: true,
				message: 'Pet saved',
			});
		} catch (err) {
			console.log('Error in CatalogController.savePet: ', err);
			return res.status(500).json({
				success: false,

				message: 'Could not save pet',
			});
		}
	}

	static async deletePet(req, res) {
		try {
			const petId = req.params.id;
			const currentUserId = req.currentUser._id;
			console.log('currentUserId log', currentUserId);
			console.log('petId', petId);

			// await UsersDAO.deleteSavedPet(currentUserId, petId);
			const savedList = await UsersDAO.deletePet(currentUserId, petId);

			console.log('savedList', savedList);
			return res.status(200).json({
				success: true,
				message: 'Pet deleted',
				save_list: savedList,
			});
		} catch (err) {
			console.log('Error in CatalogController.deleteSavedPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not delete pet',
			});
		}
	}

	static async petListByUserId(req, res) {
		const userId = req.currentUser._id;
		const petToUpdate = await CatalogDAO.getUserPets(userId);
		console.log('users pets', petToUpdate);

		if (petToUpdate.currentOwner !== userId) {
			console.log('Your are not the owner of this pet or pet does not exist');
			// return res.status(400).json({
			// 	success: false,
			// 	message: 'Your are not the owner of this pet or pet does not exist',
			// });
		}
		console.log('user matched');
		try {
			const petListById = await CatalogDAO.getUserPets(userId);
			// console.log('petList', petListById);
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

	static async caregiverStatus(req, res) {
		const currentUserId = req.currentUser._id.toString();
		const updateCaregiver = {
			status: req.body.status,
		};

		const petId = req.params.id;
		const petObj = await CatalogDAO.getPetById(petId);

		const petOwnerId = petObj.current_owner;

		switch (typeof updateCaregiver.status) {
			case 'boolean':
				try {
					// const petObj = await CatalogDAO.getPetById(petId);
					// if (!petObj || currentUserId !== new ObjectId(petOwnerId))
					// 	return res.status(400).json({
					// 		success: false,
					// 		message:
					// 			'Your are not the owner of this pet or pet does not exist',
					// 	});
					updateCaregiver.current_owner = currentUserId;
					console.log('updateCaregiver', updateCaregiver);
					const returnedPet = await CatalogDAO.updatePetById(
						petId,
						updateCaregiver
					);
					// console.log('petObject', petObject);
					res.status(200).json({
						success: true,
						message: 'Pet Updated',
						petObj: returnedPet,
					});
				} catch (err) {
					console.log('Error in CatalogController.updatePet: ', err);
					res.status(400).json({
						success: false,

						message: 'Could not update pet',
					});
				}

				break;
			case 'string':
				if (updateCaregiver.status === 'return_pet') {
					const petObj = await CatalogDAO.getPetById(petId);
					// if (!petObj || currentUserId !== new ObjectId(petOwnerId))
					// 	return res.status(400).json({
					// 		success: false,
					// 		message:
					// 			'Your are not the owner of this pet or pet does not exist',
					// 	});
					updatedPet = {
						currentOwner: currentUserId,
						last_updated: Date.now(),
					};
					const updatedPet = await CatalogDAO.updatePetById(
						petId,
						updateCaregiver
					);
					// console.log('petObject', petObject);
					res.status(200).json({
						success: true,
						message: 'Pet Updated',
						petObj: updatedPet,
					});
				} else {
					res.status(400).json({
						success: false,

						message: 'Could not update pet',
					});
				}

				break;

			default:
				console.log('Unknown data type');
		}
		// petObject.petCreatedByUsername = req.currentUser.username;
	}
};
