module.exports.AuthMiddleware = async function AuthMiddleware(req, res) {
	const token = req.headers.authorization.split(' ')[1];
	// console.log('token', token);
	if (!token) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized',
		});
	}
};
