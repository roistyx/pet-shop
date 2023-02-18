// injectDB injects this connection to the database

module.exports = class UsersDao {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			collection = await connection.collection('users');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in usersDAO: ${err}`
			);
		}
	}
};
