module.exports.AuthMiddleware = async function AuthMiddleware(req, res, next) {
	let token = req.headers['authorization'];
	console.log('token', token);
	if (!token) {
		return res.status(401).send('Access denied. No token provided.');
	}
	token.replace('Bearer ', '');
	next();
};
