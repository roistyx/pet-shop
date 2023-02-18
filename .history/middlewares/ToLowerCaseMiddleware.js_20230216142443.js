// convert to string middleware
module.exports = function ToLowerCaseMiddleware(req, res, next) {
	try {
		const lowercaseObj = Object.keys(obj).reduce((result, key) => {
			result[key.toLowerCase()] = obj[key];
			return result;
		}, {});

		console.log(lowercaseObj);
	} catch (err) {
		console.log('Error in BodyToLowerCaseMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error',
		});
	}
};

// console.log('req.body', req.body);
