const multer = require('multer');

const uploadsDirectory = 'uploads';

app.use('/' + uploadsDirectory, express.static(uploadsDirectory));
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
export function fileUploader(req, res, next) {
	upload.single('file'), console.log('req.file', req.file);

	console.log('req.file', req.file);

	return res.json({
		file: 'http://localhost:3000/' + req.file.path,
	});
}
