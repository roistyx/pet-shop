require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');
const CatalogController = require('./controllers/CatalogController.js');
const UsersDAO = require('./models/UsersDAO.js');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const { AuthMiddleware } = require('./middlewares/AuthMiddleware');
const {
	ToLowerCaseMiddleware,
} = require('./middlewares/ToLowerCaseMiddleware.js');

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

const uploadsDirectory = 'uploads';

app.use('/' + uploadsDirectory, express.static(uploadsDirectory));
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './' + uploadsDirectory);
	},
	filename: function (req, file, cb) {
		// logger('DEBUG', file);

		if (file.mimetype != 'image/jpeg') {
			cb(new Error('Wrong mime type'));
			return;
		}

		const newFileName = Date.now() + Math.random() * 1000 + file.originalname;

		cb(null, newFileName);
	},
});
const upload = multer({ storage });
app.post('/upload', upload.single('file'), function (req, res) {
	// logger('INFO', req.file.path);
	console.log('req.file', req.file);

	return;
	// res.json({
	// file: 'http://localhost:3000/' + req.file.path,
	// });
});

app.get('/Dashboard', AuthMiddleware, UsersController.getUserStatus);

app.post('/user/signup', UsersController.Signup);
app.post('/user/login', UsersController.Login);

app.post('/user/logout', AuthMiddleware, UsersController.Logout);
app.put('/user/:id', AuthMiddleware, UsersController.updateUser);
app.get('/pet/:id/save', AuthMiddleware, UsersController.savePet);
app.get('/pet/:id/unsave', AuthMiddleware, UsersController.unSavePet);
app.delete('/pet/:id/delete', AuthMiddleware, UsersController.deletePet);
app.put('/pet/:id/caregiver', AuthMiddleware, UsersController.caregiverStatus);
app.get('/auth', authenticate);
// app.use(authenticate);

async function authenticate(req, res) {
	try {
		let token = req.headers.authorization.split(' ')[1];

		if (!token) {
			return res.status(401).send('Access denied. No token provided.');
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const userData = await UsersDAO.getUserById(decodedToken.user_id);
		if (!userData) {
			return res.status(401).send('Access denied. No token provided.');
		}
		req.currentUser = userData;

		res.status(200).json({
			success: true,
			message: 'User is authenticated',
			userObj: req.currentUser,
		});
	} catch (err) {
		console.log('Error in AuthMiddleware: ', err);
		return res.status(500).json({
			success: false,
			message: 'Unknown error in Auth',
		});
	}
}

app.post(
	'/catalog/add-pet',
	AuthMiddleware,
	// ToLowerCaseMiddleware,
	CatalogController.addPet
);
app.get('/catalog/myPets', AuthMiddleware, CatalogController.petListByUserId);
app.put(
	'/catalog/update-pet/:id',
	AuthMiddleware,
	// ToLowerCaseMiddleware,
	CatalogController.updatePet
);
app.get('/catalog/pet/:id', CatalogController.getPetById);
app.delete(
	'/catalog/delete-pet/:id',
	AuthMiddleware,
	CatalogController.deletePet
);
app.get('/search', CatalogController.searchField);
app.get('/search/:term', CatalogController.searchEverywhere);

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
