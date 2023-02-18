module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			console.log(req.body);
			return res.status(200).json({
				success: true,
				message: 'User created',
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
