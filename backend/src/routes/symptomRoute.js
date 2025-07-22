const express = require('express');
const router = express.Router();
const { handleSymptomCheck } = require('../controllers/symptomController');

router.post('/symptom-check', handleSymptomCheck);

module.exports = router;
