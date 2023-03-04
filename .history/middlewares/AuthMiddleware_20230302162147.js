const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'];
	if (authHeader) {
		const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header
		// Do something with the token
		console.log('token', req.body.Authorization);
	}
	try {
		// let token = req.headers.authorization.split(' ')[1];
		//extract token from header

		// if (!token) {
		// 	return res.status(401).send('Access denied. No token provided.');
		// }

		// const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		// const userData = await UsersDAO.getUserById(decodedToken.user_id);
		// if (!userData) {
		// 	return res.status(401).send('Access denied. No token provided.');
		// }
		// req.currentUser = userData;
		// console.log('Authenticated', token);

		next();
	} catch (err) {
		console.log('Error in AuthMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error in Auth',
		});
	}
};
