const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	try {
		let token = req.headers.authorization.split(' ')[1];

		console.log('token', token);
		if (!token) {
			return res.status(401).send('Access denied. No token provided.');
		}
		if (!userData) {
			return res.status(401).send('No token.');
		}
		console.log('token', token);

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const userData = await UsersDAO.getUserById(decodedToken.user_id);
		if (!userData) {
			return res.status(401).send('Access denied. No token provided.');
		}

		console.log('userData', userData);
		next();
	} catch (err) {
		console.log('Error in AuthMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error',
		});
	}
};
