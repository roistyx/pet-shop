module.exports.ToLowerCaseMiddleware = function ToLowerCaseMiddleware(
	req,
	res,
	next
) {
	console.log('req.body', req.body);
	req.body = Object.keys(req.body).reduce((acc, key) => {
		acc[key.toLowerCase()] = req.body[key];
		return acc;
	}, {});
	console.log('req.body', req.body);
	next();
};
