const UsersDAO = require('../models/UsersDAO');
const sha256 = require('sha256');
const {
	SignupValidations: SignupValidations,
} = require('./validations/UsersValidations');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			const userObject = {
				username: req.body.username,
				password: req.body.password,
			};
			const exitingUser = await UsersDAO.getUserByUsername(userObject.username);
			if (exitingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}

			const validRequest = SignupValidations(req.body);
			if (!validRequest) {
				return res.status(400).json({
					success: false,
					message: 'Invalid request',
				});
			}

			if (await UsersDAO.getUserByUsername(userObject.username)) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}
			userObject.password = sha256(userObject.password);

			await UsersDAO.createUser(userObject);
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
			const userFromDB = await UsersDAO.getUserByUsername(req.body.username);
			console.log('userFromDB', userFromDB);
			if (!userFromDB || userFromDB !== sha256(req.body.password)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid username or password',
				});
			}
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
};
