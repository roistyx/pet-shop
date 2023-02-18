require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');
const CatalogController = require('./controllers/CatalogController.js');
const UsersDAO = require('./models/UsersDAO.js');

const { AuthMiddleware } = require('./middlewares/AuthMiddleware');
const app = express();
const cors = require('cors');

InitDB();

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

app.use(express.json());

app.post('/user/signup', UsersController.Signup);
app.post('/user/login', UsersController.Login);
app.get('/user/:id', UsersController.getUser);
app.put('/user/:id', AuthMiddleware, UsersController.updateUser);

app.post('/catalog/add-pet', AuthMiddleware, CatalogController.addPet);
app.get('/catalog/user-pets/:id', CatalogController.petListByUserId);
app.put('/catalog/update-pet/:id', CatalogController.updatePet);
app.get('/catalog/pet/:id', AuthMiddleware, CatalogController.getPetById);
app.get('/catalog/', AuthMiddleware, CatalogController.searchPetCatalog);
app.delete(
	'/catalog/delete-pet/:id',
	AuthMiddleware,
	CatalogController.deletePet
);

app.get('/auth', AuthMiddleware, (req, res) => {
	console.log('req.currentUser', req.currentUser);
	const userObject = {
		username: req.currentUser.username,
		firstName: req.currentUser.firstName,
		lastName: req.currentUser.lastName,
		phoneNumber: req.currentUser.phoneNumber,
	};
	return res.status(200).json({
		success: true,
		message: 'User is authenticated',
		user: userObject,
	});
});

app.listen(3100, () => {
	console.log('Server is running on port 3100');
});
