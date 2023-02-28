const multer = require('multer');

// Define storage configuration for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});

// Export a function that creates and configures the multer middleware
module.exports = function () {
	return multer({ storage: storage });
};
