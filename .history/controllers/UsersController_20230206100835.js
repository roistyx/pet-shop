const UsersDAO = require('../models/UsersDAO');
const sha256 = require('sha256');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			const userObject = req.body;
			userObject.password = sha256(userObject.password);
			console.log(console.log(userObject));
			await UsersDAO.createUser(req.body);
			return res.status(200).json({
				success: true,
				message: 'User created',
				userObj: req.body,
			});
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
