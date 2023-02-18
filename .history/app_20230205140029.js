require('dotenv').config();
const express = require('express');
const app = express();
const { initDB } = require('./models/init.js');
const cors = require('cors');
app.use(express.json());

initDB();

const { createUser } = require('./controllers/UsersDAO.js');

createUser({
	username: 'testusernam',
	password: 'testpassword',
});

app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
