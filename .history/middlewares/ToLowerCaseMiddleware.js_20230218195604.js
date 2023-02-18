const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.ToLowerCaseMiddleware = async function ToLowerCaseMiddleware(
	req,
	res,
	next
) {
	const bodyObject = req.body;
	const lowercaseObj = Object.entries(bodyObject).reduce(
		(result, [key, value]) => {
			result[key] = typeof value === 'string' ? value.toLowerCase() : value;
			return result;
		},
		{}
	);

	console.log('lowercaseObj', lowercaseObj);
	next();
};
