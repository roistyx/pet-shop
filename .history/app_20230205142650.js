require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');
InitDB();
const app = express();
// const cors = require('cors');

app.use(express.json());
app.post('/', (req, res) => {
	console.log(req.body);
	res.send('Hello World!');
});

app.post('signup', UsersController.Signup);

app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
