const multer = require('multer');
const uploadsDirectory = 'uploads';

// Define storage configuration for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './' + uploadsDirectory);
	},
	filename: function (req, file, cb) {
		// logger('DEBUG', file);

		if (file.mimetype != 'image/jpeg') {
			return cb(new Error('Wrong mime type'));
		}

		const newFileName = Date.now() + req.currentUser._id + file.originalname;

		cb(null, newFileName);
	},
});

// Export a function that creates and configures the multer middleware
module.exports = function () {
	return multer({ storage: storage });
};
