const petsDAO = require('../models/CatalogDAO');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addCatalog(req, res) {
		console.log('req.body', req.body);
		try {
			await CatalogDAO.createPet(petObject);
			console.log('pet created', petObject);
			return res.status(200).json({
				success: true,
				message: 'pet created',
				petObj: petObject,
			});
		} catch (err) {
			console.log('Error in Catalog.Controller.AddPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
