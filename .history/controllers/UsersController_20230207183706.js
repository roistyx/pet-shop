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
			const user = await UsersDAO.getUserByUsername(req.body.username);
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
			const user = await UsersDAO.getUserByUsername(decoded.username);
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
				// userObj: { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber },
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
