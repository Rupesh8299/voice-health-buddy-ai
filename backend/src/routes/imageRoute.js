const express = require('express');
const multer = require('multer');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Configure multer for image uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

router.post('/analyze-image', 
  upload.single('image'),
  handleMulterError,
  (req, res) => {
    console.log("🔍 Image received");
    imageController.handleImageUpload(req, res);
  }
);

module.exports = router;
