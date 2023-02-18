module.exports = class UsersController {
	static async Signup(req, res) {
		try {
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			return res.status(500).send();
		}
	}
};
