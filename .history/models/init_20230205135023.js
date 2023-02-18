const { MongoClient } = require('mongodb');
const UsersDAO = require('./UsersDAO');

module.exports.initDB = async function initDB() {
	MongoClient.connect(process.env.MONGODB_URI);
	console
		.log('Hello world')
		// .then(async (connection) => {
		// 	await UsersDAO.injectDB(connection.db(process.env.DB));
		// 	console.log('Connected to MongoDB');
		// })
		.catch((err) => {
			console.log('error connecting to MongoDB:', err);
			process.exit(1);
		});
};
