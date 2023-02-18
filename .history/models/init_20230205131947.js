const { MongoClient } = require('mongodb');

module.exports.initDB = async function initDB() {
	MongoClient.connect(process.env.MONGODB_URI)
		.then(async () => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log('error connecting to MongoDB:', err);
			process.exit(1);
		});
};
