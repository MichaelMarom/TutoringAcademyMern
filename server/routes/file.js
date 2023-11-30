const express = require('express');
const { upload } = require('../files');
const FILE_ROUTER = express.Router();

const handleFileUpload = (req, res) => {
    const filePath = req.file.path;
    res.json({ filePath });
};

// Route for /upload
FILE_ROUTER.post('/upload', upload.single('file'), handleFileUpload);

module.exports = FILE_ROUTER;