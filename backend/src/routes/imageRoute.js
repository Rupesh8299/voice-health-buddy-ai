const express = require('express');
const multer = require('multer');
const router = express.Router();
const imageController = require('../controllers/imageController');

const upload = multer();

router.post('/analyze-image', upload.single('image'), (req, res) => {
  console.log("🔍 Image received");
  imageController.handleImageUpload(req, res);
});

module.exports = router;
