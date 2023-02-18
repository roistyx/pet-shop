const Ajv = require('ajv');
const ajv = new Ajv();

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
