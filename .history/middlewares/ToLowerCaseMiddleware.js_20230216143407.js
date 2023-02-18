const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.ToLowerCaseMiddleware = async function ToLowerCaseMiddleware(
	req,
	res,
	next
) {
	const obj = req.body;
	const lowercaseObj = Object.entries(obj).reduce((result, [key, value]) => {
		result[key] = typeof value === 'string' ? value.toLowerCase() : value;
		return result;
	}, {});

	console.log('lowercaseObj', lowercaseObj);
};
