const UsersDAO = require('../models/UsersDAO');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const {
	SignupValidations: SignupValidations,
} = require('./validations/UsersValidations');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			const userObject = {
				username: req.body.email,
				password: req.body.password,
			};
			console.log('req.body.email', req.body.email);
			console.log('res', res);
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
			const user = await UsersDAO.getUserByUsername(req.body.username);
			// console.log('user', user.password);
			// console.log('sha', sha256(req.body.password));

			if (!user || user.password !== sha256(req.body.password)) {
				return res.status(400).json({
					success: false,
					message: 'Wrong username or password',
				});
			}
			const token = jwt.sign(
				{ user_id: user._id, username: user.username },
				process.env.JWT_SECRET,
				{}
			);
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
};
