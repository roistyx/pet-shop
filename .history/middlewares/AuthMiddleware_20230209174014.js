const jwt = require('jsonwebtoken');
module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	let token = req.headers['authorization'];
	console.log('token', token);
	if (!token) {
		return res.status(401).send('Access denied. No token provided.');
	}
	token = token.replace('Bearer', '');

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	console.log('decoded', decoded);
	next();
};
