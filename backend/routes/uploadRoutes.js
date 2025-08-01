const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage });


router.post('/', protect, upload.single('image'), (req, res) => {
  
    if (req.file) {
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path 
        });
    } else {
        res.status(400).json({ message: 'Image upload failed' });
    }
});

module.exports = router;