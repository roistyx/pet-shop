const UsersDAO = require('../models/UsersDAO');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const {
	SignupValidations,
	LoginValidations,
} = require('./validations/UsersValidations');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			const userObject = {
				username: req.body.username,
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
			};
			console.log('userObject', userObject);

			const exitingUser = await UsersDAO.getUserByUsername(userObject.username);
			if (exitingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}

			const validRequest = SignupValidations(userObject);
			if (!validRequest) {
				return res.status(400).json({
					success: false,
					message: 'Invalid request',
				});
			}

			if (await UsersDAO.getUserByUsername(userObject.username)) {
				console.log('Username already exists', userObject);
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
			console.log('req.body', req.body.password);
			const user = await UsersDAO.getUserByUsername(req.body.username);
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

			await UsersDAO.getUserById('63e206319ca263ccfef06d8f');

			const token = jwt.sign(
				{ user_id: user._id, username: user.username },
				process.env.JWT_SECRET
			);
			console.log('token', token);
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

	static async updateUser(req, res) {
		const userId = req.params;
		const updatedUserObject = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
		};

		try {
			const user = await UsersDAO.getUserById(userId);
			console.log('user found:', user);
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

	static async getUser(req, res) {
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
};
