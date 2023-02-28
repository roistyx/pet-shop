const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.AuthMiddleware = async function AuthMiddleware(req, res) {
	// if (!req.body.authorization) {
	// 	return res.status(401).send('Access denied.');
	// }
	try {
		let token = req.headers.authorization.split(' ')[1];

		console.log('token', token);

		// if (!token) {
		// 	return res.status(401).send('Access denied. No token provided.');
		// }

		// const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		// const userData = await UsersDAO.getUserById(decodedToken.user_id);
		// if (!userData) {
		// 	return res.status(401).send('Access denied. No token provided.');
		// }
		// req.currentUser = userData;

		// return res.status(200).json({
		// 	success: true,
		// 	message: 'User is authenticated',
		// 	user: userData,
		// });
	} catch (err) {
		console.log('Error in AuthMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error in Auth',
		});
	}
};
