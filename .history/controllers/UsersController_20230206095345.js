const UsersDAO = require('../models/UsersDAO');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			await UsersDAO.createUser(req.body);
			return res.json(req.body);
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
