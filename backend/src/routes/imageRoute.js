const express = require('express');
const router = express.Router();
const multerUpload = require('../utils/multerUpload');
const { handleImageUpload } = require('../controllers/imageController');

router.post('/image', multerUpload.single('image'), (req, res, next) => {
  console.log('✅ Route hit: /api/image');
  next();
}, handleImageUpload);


module.exports = router;
