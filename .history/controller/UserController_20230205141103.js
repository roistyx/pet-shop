module.exports = class UsersController {
	static async Signup(req, res) {
		try {
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			res.status(500).json({ error: err });
		}
	}
};
