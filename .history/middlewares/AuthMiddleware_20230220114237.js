const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	// if (!req.body.authorization) {
	// 	return res.status(401).send('Access denied.');
	// }
	try {
		// let token = req.headers.authorization.split(' ')[1];
		let token = req.headers;
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

		// console.log('req.currentUser', req.currentUser);
		// next();
	} catch (err) {
		console.log('Error in AuthMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error in Auth',
		});
	}
};
