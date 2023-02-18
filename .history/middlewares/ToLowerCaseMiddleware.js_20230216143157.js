const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');

module.exports.ToLowerCaseMiddleware = async function ToLowerCaseMiddleware(
	req,
	res,
	next
) {
	const obj = req.body;
	const lowercaseObj = Object.keys(obj).reduce((result, key) => {
		result[key.toLowerCase()] = obj[key];
		return result;
	}, {});

	console.log(lowercaseObj);
};
