const multer = require('multer');

function fileUploader() {
	const uploadsDirectory = 'uploads';

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './' + uploadsDirectory);
		},
		filename: function (req, file, cb) {
			// logger('DEBUG', file);

			if (file.mimetype != 'image/jpeg') {
				cb(new Error('Wrong mime type'));
				return;
			}

			const newFileName = Date.now() + Math.random() * 1000 + file.originalname;

			cb(null, newFileName);
		},
	});
	const upload = multer({ storage });

	return upload.single('file');
}

module.exports = fileUploader;
