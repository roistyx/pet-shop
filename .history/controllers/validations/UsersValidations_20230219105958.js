const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.SignupValidations = ajv.compile({
	type: 'object',
	properties: {
		username: {
			type: 'email',
		},
		password: {
			type: 'string',
		},
		firstName: {
			type: 'string',
		},
		lastName: {
			type: 'string',
		},
		phoneNumber: {
			type: 'string',
		},
	},
	required: [
		'username',
		'password',
		// 'firstName', 'lastName', 'phoneNumber'
	],
	additionalProperties: false,
});

module.exports.LoginValidations = ajv.compile({
	type: 'object',
	properties: {
		username: {
			type: 'string',
		},
		password: {
			type: 'string',
		},
	},
	required: ['username', 'password'],
	additionalProperties: false,
});

module.exports.StatusValidations = ajv.compile({
	type: 'object',
	properties: {
		adoptionStatus: {
			type: 'boolean',
		},
	},
	required: ['adoptionStatus'],
	additionalProperties: false,
});
