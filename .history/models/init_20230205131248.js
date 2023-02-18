const { MongoClient } = require('mongodb');

module.exports.initDB = async function initDB() {
	MongoClient.connect(process.env.MONGODB)
		.then(async () => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log(err);
		});
};
