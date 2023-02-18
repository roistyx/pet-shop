const CatalogDAO = require('../models/CatalogDAO');

// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addPet(req, res) {
		console.log('req.body', req.body);
		try {
			const petObject = {
				pet_id: req.body.id,
				specie: req.body.specie,
				breed: req.body.breed,
				sex: req.body.sex,
				age: req.body.age,
				weight: req.body.weight,
				height: req.body.height,
				color: req.body.color,
				hypoallergenic: req.body.hypoallergenic,
				name: req.body.name,
				bio: req.body.bio,
				profilePic: req.body.profilePic,
				adoptionStatus: req.body.adoptionStatus,
			};
			petObject.currentUser = req.currentUser.username;
			// console.log('req.body.currentUser.username', req.currentUser);

			// await CatalogDAO.createPet(petObject);
			// console.log('pet created', petObject);
			// return res.status(200).json({
			// 	success: true,
			// 	message: 'pet created',
			// 	petObj: petObject,
			// });
		} catch (err) {
			console.log('Error in CatalogController.addPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};
