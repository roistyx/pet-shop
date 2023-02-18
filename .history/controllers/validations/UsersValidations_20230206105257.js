const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.RegisterValidations = ajv.compile({
	type: 'object',
	properties: {
		username: {
			type: 'string',
			minLength: 3,
			maxLength: 20,
		},
		password: {
			type: 'string',
			minLength: 8,
			maxLength: 20,
		},
	},
	required: ['username', 'password'],
	additionalProperties: false,
});
