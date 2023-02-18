const UsersDAO = require('../models/CatalogDAO');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const {
	SignupValidations: SignupValidations,
} = require('./validations/UsersValidations');

module.exports = class CatalogController {
	static async Catalog(req, res) {
		try {
			const petObject = {
				id: req.body.id,
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
			console.log('petObject', petObject);

			const exitingUser = await CatalogDAO.getPetByID(petObject.username);
			if (exitingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}

			const validRequest = SignupValidations(petObject);
			if (!validRequest) {
				return res.status(400).json({
					success: false,
					message: 'Invalid request',
				});
			}

			if (await CatalogDAO.getPetByID(petObject.username)) {
				console.log('Username already exists', petObject);
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}
			petObject.password = sha256(petObject.password);

			await CatalogDAO.createPet(petObject);
			console.log('User created', petObject);
			return res.status(200).json({
				success: true,
				message: 'User created',
				userObj: petObject,
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
			const user = await CatalogDAO.getPetByID(req.body.username);
			// console.log('user passowrd', user.password);
			// console.log('sha', sha256(req.body.password));

			if (!user || user.password !== sha256(req.body.password)) {
				console.log('Wrong username or password');
				return res.status(400).json({
					success: false,
					message: 'Wrong username or password',
				});
			}
			const token = jwt.sign(
				{ user_id: user._id, username: user.username },
				process.env.JWT_SECRET
			);
			// console.log('token', token);
			return res.status(200).json({
				success: true,
				message: 'User logged in',
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

	static async updateUser(userData) {
		logger('log me');
		await collection.updateOne({ _id: userData._id }, { $set: { userData } });
	}

	static async Auth(req, res) {
		console.log('req.header', req);
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log('decoded', decoded);
			const user = await CatalogDAO.getPetByID(decoded.username);
			console.log('user', user);
			if (!user) {
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
				userObj: {
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					phoneNumber: user.phoneNumber,
				},
			});
		} catch (err) {
			console.log('Error in UsersController.Auth: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
