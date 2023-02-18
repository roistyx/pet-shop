const UserDAO = require('../model/UsersDAO');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			await UsersDao.signUp(req.body);
			return res.status(200).json({
				success: true,
				message: json(req.body),
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
