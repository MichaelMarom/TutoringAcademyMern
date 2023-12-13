const express = require('express');
const { upload } = require('../files');
const { fs } = require('../modules');
const FILE_ROUTER = express.Router();
const path = require('path');
const unlinkAsync = fs.promises.unlink;

const handleFileUpload = (req, res) => {
    const filePath = req.file.path;
    res.json({ filePath });
};

const handleFileDeletion = async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '..', 'uploads', filename); // Update the path based on your file structure
  
      // Check if the file exists
      const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);
  
      if (fileExists) {
        // Delete the file
        await unlinkAsync(filePath);
        res.json({ success: true, message: 'File deleted successfully.' });
      } else {
        res.status(404).json({ success: false, message: 'File not found.' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
  
// Route for /upload
FILE_ROUTER.post('/upload', upload.single('file'), handleFileUpload);
FILE_ROUTER.delete('/delete-file/:filename', handleFileDeletion);
module.exports = FILE_ROUTER;