const express = require('express');
const router = express.Router();
const multerUpload = require('../utils/multerUpload');
const { handleImageUpload } = require('../controllers/imageController');

router.post('/image', multerUpload.single('image'), handleImageUpload);

module.exports = router;
