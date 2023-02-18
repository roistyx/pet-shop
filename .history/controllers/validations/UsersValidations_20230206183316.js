const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.SignupValidations = ajv.compile({
	type: 'object',
	properties: {
		username: {
			type: 'string',
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
		phoneNNumber: {
			type: 'integer',
		},
	},
	required: ['username', 'password'],
	additionalProperties: false,
});
