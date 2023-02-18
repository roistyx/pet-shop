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
	},
	required: ['username', 'password'],
	additionalProperties: false,
});
