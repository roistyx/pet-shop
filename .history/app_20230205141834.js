require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const { Signup } = require('./controllers/UsersController.js');
InitDB();
const app = express();
// const cors = require('cors');

app.use(express.json());

app.post('signup', (req, res) => {});

app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
