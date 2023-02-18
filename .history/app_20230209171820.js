require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');
const CatalogController = require('./controllers/CatalogController.js');
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

app.post('/signup', UsersController.Signup);
app.post('/login', UsersController.Login);

app.post('/task/new', AuthMiddleware, (req, res) => {
	res.send('Hello world');
});

app.listen(3100, () => {
	console.log('Server is running on port 3100');
});
