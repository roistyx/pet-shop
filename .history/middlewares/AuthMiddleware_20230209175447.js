const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	let token = req.headers.authorization.split(' ')[1];

	console.log('token', token);
	if (!token) {
		return res.status(401).send('Access denied. No token provided.');
	}
	console.log('token', token);

	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	const userData = await UsersDAO.getUserById(decodedToken._id);
	console.log('decoded', decodedToken);
	next();
};
