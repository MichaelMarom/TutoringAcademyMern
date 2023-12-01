const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        const userId = req.query.userId;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`;

        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.pdf', '.jpeg', '.png', '.jpg'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
